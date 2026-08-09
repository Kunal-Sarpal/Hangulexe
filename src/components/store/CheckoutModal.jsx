import React, { useState, useEffect } from 'react';
import Icons from '../Icons';

export default function CheckoutModal({ isOpen, onClose, cartItems, totalAmount, user, onOrderSuccess }) {
  const [step, setStep] = useState(1); // 1: Details, 2: UPI Scanner, 3: Success
  const [customer, setCustomer] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setCustomer(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreateOrder = async (e) => {
    if (e) e.preventDefault();
    if (!customer.name || !customer.phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    setLoading(true);
    try {
      const itemsPayload = cartItems.map(item => ({
        name: item.product.product_name,
        price: item.product.sellingPrice,
        quantity: item.quantity,
        size: item.size
      }));

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          items: itemsPayload,
          totalAmount,
          paymentMethod: 'UPI'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrderDetails(data);
        setStep(2); // Proceed to UPI Scanner
      } else {
        alert(data.error || 'Failed to initialize order');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to connect to checkout server');
    }
    setLoading(false);
  };

  const handleSimulatePayment = async () => {
    if (!orderDetails) return;
    setLoading(true);
    try {
      const res = await fetch('/api/orders/pay-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderDetails.orderNumber })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPaymentSuccess(true);
        setStep(3); // Show Success State
        if (onOrderSuccess) onOrderSuccess(orderDetails.orderNumber);
      } else {
        alert(data.error || 'Payment confirmation failed');
      }
    } catch (err) {
      console.error('Payment confirm error:', err);
      alert('Error confirming payment with server');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B19]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-lg overflow-hidden border border-[#E6E2DA] flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E2DA] bg-[#F5F3ED]">
          <div>
            <span className="text-[10px] font-bold text-[#6E6A63] uppercase tracking-[0.2em] block mb-0.5">HANGULUXE CHECKOUT</span>
            <h3 className="text-sm font-bold text-[#1C1B19] uppercase tracking-wider">
              {step === 1 && 'Delivery & Contact Details'}
              {step === 2 && 'Scan UPI QR Code to Pay'}
              {step === 3 && 'Order Placed Successfully!'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#6E6A63] hover:text-[#1C1B19] text-2xl font-light cursor-pointer select-none p-1"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Customer Details */}
          {step === 1 && (
            <form onSubmit={handleCreateOrder} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19] transition-all"
                  placeholder="e.g. Suraj Sharma"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19] transition-all"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customer.email}
                    disabled={!!user?.email}
                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E6E2DA] bg-[#FAF9F6] disabled:opacity-60 text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19] transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">Delivery Address</label>
                <textarea
                  rows={2}
                  value={customer.address}
                  onChange={e => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19] transition-all resize-none"
                  placeholder="Street name, Flat / House No., Pincode..."
                />
              </div>

              <div className="bg-[#F5F3ED] p-4 border border-[#E6E2DA] flex justify-between items-center mt-4">
                <div>
                  <span className="text-[10px] font-bold text-[#6E6A63] block uppercase tracking-wider">Total Payable</span>
                  <span className="text-xl font-bold text-[#1C1B19]">₹{totalAmount}</span>
                </div>
                <span className="bg-[#1C1B19] text-[#FAF9F6] text-[9px] font-bold px-3 py-1 uppercase tracking-wider">Instant UPI Payment</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1C1B19] text-[#FAF9F6] font-bold text-xs tracking-widest py-4 uppercase hover:opacity-90 transition-opacity disabled:opacity-75 shadow-sm mt-4"
              >
                {loading ? 'Generating UPI QR...' : 'Proceed to Pay with UPI'}
              </button>
            </form>
          )}

          {/* STEP 2: Live UPI QR Code Scanner */}
          {step === 2 && orderDetails && (
            <div className="flex flex-col items-center text-center space-y-4">
              
              <div className="bg-[#F5F3ED] text-[#1C1B19] text-xs font-bold px-4 py-2 border border-[#E6E2DA] uppercase tracking-wider">
                Order ID: <span className="font-mono text-sm tracking-normal">{orderDetails.orderNumber}</span>
              </div>

              {/* QR Scanner Container */}
              <div className="relative p-4 bg-white border border-[#E6E2DA] flex flex-col items-center">
                <img
                  src={orderDetails.qrCodeUrl}
                  alt="UPI Payment QR Code"
                  className="w-56 h-56 object-contain rounded-none border border-[#E6E2DA] shadow-sm"
                />
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#6E6A63] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  UPI ID: <span className="font-mono text-[#1C1B19] tracking-normal">hanguluxe@upi</span>
                </div>
              </div>

              <p className="text-xs font-bold text-[#6E6A63] uppercase tracking-wider">
                Scan using UPI app to pay <strong className="text-[#1C1B19] text-sm">₹{totalAmount}</strong>.
              </p>

              {/* Server Simulation Action */}
              <div className="w-full pt-3 border-t border-[#E6E2DA] space-y-2">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={loading}
                  className="w-full bg-[#1C1B19] hover:opacity-90 text-[#FAF9F6] font-bold text-xs py-4 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest"
                >
                  {loading ? 'Confirming with Server...' : '✓ Simulate Payment Success'}
                </button>
                <p className="text-[10px] text-[#A39E95] font-semibold leading-relaxed">
                  Clicking above simulates payment success webhook registration.
                </p>
              </div>

            </div>
          )}

          {/* STEP 3: Order Completed Success */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#15803D] border border-green-200 flex items-center justify-center text-2xl shadow-inner">
                ✓
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#1C1B19] uppercase tracking-wider">Payment Received!</h3>
                <p className="text-xs text-[#6E6A63] font-semibold mt-1 uppercase">Thank you, {customer.name}. Your order is confirmed.</p>
              </div>

              <div className="bg-[#F5F3ED] border border-[#E6E2DA] p-4 w-full text-left space-y-2 text-xs font-semibold">
                <div className="flex justify-between border-b border-[#E6E2DA] pb-2">
                  <span className="text-[#6E6A63] uppercase tracking-wider">Order Number:</span>
                  <span className="font-mono font-bold text-[#1C1B19]">{orderDetails?.orderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-[#E6E2DA] pb-2">
                  <span className="text-[#6E6A63] uppercase tracking-wider">Payment Status:</span>
                  <span className="font-bold text-[#15803D] uppercase tracking-wider">Paid (Completed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6A63] uppercase tracking-wider">Total Paid:</span>
                  <span className="font-bold text-[#1C1B19]">₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#1C1B19] hover:opacity-90 text-[#FAF9F6] font-bold text-xs py-4 uppercase tracking-widest"
              >
                Close & Continue Shopping
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
