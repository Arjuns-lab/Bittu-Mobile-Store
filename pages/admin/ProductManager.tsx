import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Input } from '../../components/UIComponents';
import { Plus, Edit2, Trash2, X, Search, MinusCircle, Layers } from 'lucide-react';
import { Product, PricingSlab } from '../../types';

const ProductManager = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const initialFormState: Product = {
    id: '',
    name: '',
    brand: '',
    category: 'Mobile',
    basePrice: 0,
    wholesalePrice: 0,
    stock: 0,
    image: '',
    description: '',
    specs: { ram: '', storage: '', color: '', battery: '', processor: '' },
    slabs: [],
    reviews: [],
    rating: 0,
    isNewArrival: false
  };

  const [formData, setFormData] = useState<Product>(initialFormState);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    // Ensure specs object has all keys even if product data is old/incomplete
    setFormData({
        ...product,
        specs: { 
            ram: '', storage: '', color: '', battery: '', processor: '', 
            ...product.specs 
        },
        slabs: product.slabs || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate Slabs
    const validSlabs = formData.slabs.filter(s => s.minQty > 0 && s.price > 0).sort((a,b) => a.minQty - b.minQty);
    
    const productData = { ...formData, slabs: validSlabs };

    if (editingProduct) {
      await updateProduct(productData);
    } else {
      await addProduct({ ...productData, id: Date.now().toString() });
    }
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingProduct(null);
  };

  // Slab Management Helpers
  const addSlab = () => {
    setFormData({ ...formData, slabs: [...formData.slabs, { minQty: 0, price: 0 }] });
  };

  const removeSlab = (index: number) => {
    const newSlabs = formData.slabs.filter((_, i) => i !== index);
    setFormData({ ...formData, slabs: newSlabs });
  };

  const handleSlabChange = (index: number, field: keyof PricingSlab, value: number) => {
    const newSlabs = [...formData.slabs];
    newSlabs[index] = { ...newSlabs[index], [field]: value };
    setFormData({ ...formData, slabs: newSlabs });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
        <Button onClick={() => { setEditingProduct(null); setFormData(initialFormState); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input 
          placeholder="Search products..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Prices (W/R)</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} className="w-10 h-10 rounded bg-slate-100 object-contain" alt="" />
                      <div>
                        <span className="font-medium text-slate-900 block">{product.name}</span>
                        {product.isNewArrival && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.brand}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-blue">₹{product.wholesalePrice}</span>
                      <span className="text-xs text-slate-400 line-through">₹{product.basePrice}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Basic Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <Input label="Brand" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Category" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} />
                    <Input label="Image URL" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-blue outline-none" 
                    rows={3}
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                </div>
                
                {/* New Arrival Checkbox */}
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="isNewArrival"
                        checked={formData.isNewArrival || false}
                        onChange={e => setFormData({...formData, isNewArrival: e.target.checked})}
                        className="w-4 h-4 text-brand-blue border-slate-300 rounded focus:ring-brand-blue cursor-pointer"
                    />
                    <label htmlFor="isNewArrival" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                        Mark as New Arrival
                    </label>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Inventory & Pricing</h3>
                <div className="grid grid-cols-3 gap-4">
                    <Input label="Base Wholesale Price (₹)" type="number" required value={formData.wholesalePrice} onChange={e => setFormData({...formData, wholesalePrice: Number(e.target.value)})} />
                    <Input label="Market Retail Price (₹)" type="number" required value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})} />
                    <Input label="Stock Quantity" type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Input label="RAM" placeholder="e.g. 8GB" value={formData.specs.ram || ''} onChange={e => setFormData({...formData, specs: {...formData.specs, ram: e.target.value}})} />
                    <Input label="Storage" placeholder="e.g. 256GB" value={formData.specs.storage || ''} onChange={e => setFormData({...formData, specs: {...formData.specs, storage: e.target.value}})} />
                    <Input label="Color" placeholder="e.g. Midnight Black" value={formData.specs.color || ''} onChange={e => setFormData({...formData, specs: {...formData.specs, color: e.target.value}})} />
                    <Input label="Battery" placeholder="e.g. 5000mAh" value={formData.specs.battery || ''} onChange={e => setFormData({...formData, specs: {...formData.specs, battery: e.target.value}})} />
                    <Input label="Processor" placeholder="e.g. Snapdragon 8 Gen 2" value={formData.specs.processor || ''} onChange={e => setFormData({...formData, specs: {...formData.specs, processor: e.target.value}})} />
                </div>
              </div>

              {/* Wholesale Pricing Slabs */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Wholesale Pricing Slabs
                    </h3>
                    <Button type="button" size="sm" variant="outline" onClick={addSlab} className="text-xs">
                        <Plus className="w-3 h-3 mr-1" /> Add Slab
                    </Button>
                </div>
                
                {formData.slabs.length === 0 ? (
                    <p className="text-sm text-slate-400 italic text-center py-2">No bulk pricing slabs defined. Standard wholesale price will apply.</p>
                ) : (
                    <div className="space-y-3">
                        {formData.slabs.map((slab, index) => (
                            <div key={index} className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 font-semibold block mb-1">Min Qty</label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                                        value={slab.minQty}
                                        onChange={(e) => handleSlabChange(index, 'minQty', Number(e.target.value))}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 font-semibold block mb-1">Unit Price (₹)</label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                                        value={slab.price}
                                        onChange={(e) => handleSlabChange(index, 'price', Number(e.target.value))}
                                    />
                                </div>
                                <div className="pt-4">
                                    <button type="button" onClick={() => removeSlab(index)} className="text-red-500 hover:text-red-700">
                                        <MinusCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-2 sticky bottom-0 bg-white border-t mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">{editingProduct ? 'Update Product' : 'Create Product'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductManager;