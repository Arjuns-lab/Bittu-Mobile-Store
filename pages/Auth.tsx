import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/UIComponents';
import { Smartphone, ShieldCheck, UserCheck } from 'lucide-react';

const Auth = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<'retailer' | 'admin'>('retailer');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return alert('Enter valid number');
    // Simulate API call
    setTimeout(() => setStep(2), 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') {
      login(role, phone);
      navigate(role === 'admin' ? '/admin' : '/store');
    } else {
      alert('Invalid OTP (Use 1234)');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-blue p-3 rounded-full">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">Bittu Mobiles Wholesale</h1>
          <p className="text-slate-500">Trusted B2B Partner for Mobiles</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => { setRole('retailer'); setStep(1); }}
            className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${role === 'retailer' ? 'bg-white shadow text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <UserCheck className="w-4 h-4 mr-2" /> Retailer
          </button>
          <button
            onClick={() => { setRole('admin'); setStep(1); }}
            className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${role === 'admin' ? 'bg-white shadow text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ShieldCheck className="w-4 h-4 mr-2" /> Admin
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input 
              label="Mobile Number" 
              placeholder="Enter 10-digit number" 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button type="submit" className="w-full">Get OTP</Button>
            <p className="text-xs text-center text-slate-400">By logging in, you agree to terms & conditions</p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-sm text-slate-600">OTP sent to +91 {phone}</span>
              <button type="button" onClick={() => setStep(1)} className="text-xs text-brand-blue ml-2 underline">Edit</button>
            </div>
            <Input 
              label="Enter OTP" 
              placeholder="Enter 4-digit OTP" 
              type="password"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button type="submit" className="w-full">Verify & Login</Button>
            <p className="text-xs text-center text-green-600 font-medium">Use OTP: 1234</p>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Auth;
