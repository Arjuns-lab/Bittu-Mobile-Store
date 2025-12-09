import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button, Card } from '../../components/UIComponents';
import { ArrowLeft, ShoppingCart, Check, Truck, Star, User as UserIcon, ShieldCheck } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, addToCart, user, orders, addReview } = useApp();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  
  // Review State
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const product = products.find(p => p.id === id);

  // Derived State for Reviews
  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (product?.reviews) {
      product.reviews.forEach(r => {
        const rounded = Math.round(r.rating);
        if (rounded >= 1 && rounded <= 5) {
          dist[rounded]++;
        }
      });
    }
    return dist;
  }, [product?.reviews]);

  if (!product) return <div className="p-10 text-center">Product not found</div>;

  // Check if user has purchased this product to allow review
  const hasPurchased = orders.some(o => 
    o.userId === user?.id && 
    o.items.some(i => i.id === product.id)
  );

  // Check if user already reviewed
  const hasReviewed = product.reviews?.some(r => r.userId === user?.id);

  // Calculate current price based on quantity
  const getCurrentPrice = (quantity: number) => {
    let price = product.wholesalePrice;
    const sortedSlabs = [...product.slabs].sort((a, b) => b.minQty - a.minQty);
    for (const slab of sortedSlabs) {
      if (quantity >= slab.minQty) {
        price = slab.price;
        break;
      }
    }
    return price;
  };

  const currentPrice = getCurrentPrice(qty);
  const totalPrice = currentPrice * qty;

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/store/cart');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmittingReview(true);
    await addReview(product.id, userRating, reviewComment);
    setSubmittingReview(false);
    setReviewComment('');
  };

  return (
    <div className="pb-20 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-600 hover:text-brand-blue mb-6 group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Store
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div className="bg-white rounded-2xl p-8 flex items-center justify-center shadow-sm border border-slate-100 h-96 sticky top-24">
          <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">{product.name}</h1>
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <span className="font-bold text-yellow-700 mr-1">{product.rating || 0}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-slate-400 ml-1 border-l border-slate-300 pl-1">{product.reviews?.length || 0} Ratings</span>
                </div>
                <span className="text-sm text-slate-500 font-medium">{product.brand}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(product.specs).map(([key, value]) => (
              value && (
                <div key={key} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{key}</span>
                    <span className="font-medium text-slate-800 text-sm truncate block" title={value}>{value}</span>
                </div>
              )
            ))}
          </div>

          {/* Pricing Slabs */}
          <Card className="p-0 overflow-hidden border-brand-accent/20 shadow-md">
            <div className="bg-brand-dark text-white p-3 font-medium text-center text-sm uppercase tracking-wide">
              Wholesale Pricing Tiers
            </div>
            <div className="divide-y divide-slate-100">
                <div className="flex justify-between items-center p-3 bg-white">
                    <span className="text-sm text-slate-600">1 - {product.slabs[0]?.minQty - 1 || 4} pcs</span>
                    <span className="font-bold text-slate-900">₹{product.wholesalePrice.toLocaleString()}</span>
                </div>
                {product.slabs.sort((a,b) => a.minQty - b.minQty).map((slab, i) => (
                  <div key={i} className={`flex justify-between items-center p-3 transition-colors ${qty >= slab.minQty ? 'bg-green-50' : 'bg-white'}`}>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm ${qty >= slab.minQty ? 'font-bold text-green-700' : 'text-slate-600'}`}>
                            {slab.minQty}+ pcs
                        </span>
                        {qty >= slab.minQty && <Check className="w-4 h-4 text-green-600" />}
                    </div>
                    <span className={`font-bold ${qty >= slab.minQty ? 'text-green-700' : 'text-brand-blue'}`}>
                        ₹{slab.price.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </Card>

          {/* Add to Order Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky bottom-4 z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                  <p className="text-xs text-slate-500 mb-1">Total Amount ({qty} units)</p>
                  <p className="text-3xl font-bold text-brand-blue">₹{totalPrice.toLocaleString()}</p>
              </div>
              <div className="text-right">
                  <p className="text-xs text-slate-400 line-through">MRP: ₹{(product.basePrice * qty).toLocaleString()}</p>
                  <p className="text-xs text-green-600 font-bold">You Save ₹{((product.basePrice - currentPrice) * qty).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex gap-3 h-12">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-1">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >-</button>
                <span className="w-10 text-center font-bold text-slate-900">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >+</button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 text-lg shadow-lg shadow-brand-blue/30">
                <ShoppingCart className="w-5 h-5" /> Add to Order
              </Button>
            </div>
            <div className="mt-3 flex items-center justify-center text-xs text-slate-500 gap-4">
              <span className="flex items-center"><Truck className="w-3 h-3 mr-1" /> Free Delivery</span>
              <span className="flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> GST Invoice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <div className="border-t border-slate-200 pt-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Ratings & Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Stats & Distribution */}
          <div className="md:col-span-4 space-y-6">
             <Card className="p-6">
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-5xl font-bold text-slate-900">{product.rating || 0}</span>
                    <div className="mb-2">
                        <div className="flex mb-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-4 h-4 ${s <= (product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                            ))}
                        </div>
                        <p className="text-xs text-slate-500">{product.reviews?.length || 0} Verified Buyers</p>
                    </div>
                </div>
                
                {/* Rating Distribution Bars */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingDistribution[star] || 0;
                        const total = product.reviews?.length || 0;
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        
                        return (
                            <div key={star} className="flex items-center gap-2 text-xs">
                                <span className="w-3 font-medium text-slate-600">{star}</span>
                                <Star className="w-3 h-3 text-slate-300" />
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="w-8 text-right text-slate-400">{count}</span>
                            </div>
                        );
                    })}
                </div>
             </Card>

             {/* Write Review Card */}
             {hasPurchased && !hasReviewed ? (
               <div className="bg-white border border-brand-blue/20 rounded-xl p-6 shadow-sm">
                 <h3 className="font-bold text-lg mb-1">Rate this Product</h3>
                 <p className="text-xs text-slate-500 mb-4">Share your experience with other retailers</p>
                 <form onSubmit={handleSubmitReview}>
                   <div className="mb-4">
                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Your Rating</label>
                     <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map((s) => (
                         <button
                           key={s}
                           type="button"
                           onClick={() => setUserRating(s)}
                           className="focus:outline-none transition-transform hover:scale-110"
                         >
                           <Star className={`w-8 h-8 ${s <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                         </button>
                       ))}
                     </div>
                   </div>
                   <div className="mb-4">
                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Review</label>
                     <textarea
                       className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                       rows={4}
                       placeholder="Tell us about the product quality, packaging, and delivery..."
                       value={reviewComment}
                       onChange={(e) => setReviewComment(e.target.value)}
                       required
                     />
                   </div>
                   <Button type="submit" className="w-full" disabled={submittingReview}>
                     {submittingReview ? 'Submitting...' : 'Submit Review'}
                   </Button>
                 </form>
               </div>
             ) : hasReviewed ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-bold text-green-800">Review Submitted</h3>
                    <p className="text-sm text-green-700 mt-1">Thank you for your feedback!</p>
                </div>
             ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                    <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-700">Verified Reviews Only</h3>
                    <p className="text-sm text-slate-500 mt-1">Purchase this item to leave a review.</p>
                </div>
             )}
          </div>

          {/* Right Column: Review List */}
          <div className="md:col-span-8 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Customer Feedback</h3>
            {(product.reviews && product.reviews.length > 0) ? (
              product.reviews.map((review, idx) => (
                <div key={review.id || idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{review.userName}</p>
                        <div className="flex items-center gap-2">
                             <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                                ))}
                             </div>
                             <span className="text-xs text-slate-400">• {review.date}</span>
                        </div>
                      </div>
                    </div>
                    {review.rating >= 4 && (
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Recommended
                        </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed pl-13 border-l-2 border-slate-100 ml-5 pl-4">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-medium text-slate-900">No reviews yet</h3>
                <p className="text-slate-500 text-sm mt-1">Be the first to rate this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;