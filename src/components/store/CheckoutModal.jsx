import React, { useState, useEffect } from 'react';
import {
  getSavedAddresses,
  saveOrUpdateAddress,
  formatAddressString
} from '../../utils/addressStorage';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  totalAmount, 
  user, 
  setUser,
  onOrderSuccess 
}) {
  const [step, setStep] = useState(1); // 1: Details, 2: UPI Scanner, 3: Success
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const [customer, setCustomer] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: ''
  });

  const [newAddressForm, setNewAddressForm] = useState({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    tag: 'Home',
    isDefault: false
  });

  const [saveToAccount, setSaveToAccount] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Load saved addresses and set initial customer details
  useEffect(() => {
    if (isOpen) {
      const list = getSavedAddresses(user);
      setSavedAddresses(list);
      setIsSelectingAddress(false);
      setIsAddingNewAddress(false);

      if (list.length > 0) {
        const defaultAddr = list.find(a => a.isDefault) || list[0];
        setSelectedAddressId(defaultAddr.id);
        setCustomer(prev => ({
          ...prev,
          name: defaultAddr.name || user?.name || prev.name,
          phone: defaultAddr.phone || user?.phone || prev.phone,
          email: user?.email || prev.email,
          address: formatAddressString(defaultAddr)
        }));
      } else {
        setCustomer(prev => ({
          ...prev,
          name: user?.name || prev.name,
          phone: user?.phone || prev.phone,
          email: user?.email || prev.email,
          address: user?.default_address || prev.address
        }));
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Handler when user selects a saved address
  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setCustomer(prev => ({
      ...prev,
      name: addr.name || prev.name,
      phone: addr.phone || prev.phone,
      address: formatAddressString(addr)
    }));
    setIsSelectingAddress(false);
  };

  // Handler when adding a new address from checkout
  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddressForm.name.trim() || !newAddressForm.phone.trim() || !newAddressForm.addressLine.trim()) {
      alert('Please fill in required fields (Name, Phone, and Address).');
      return;
    }

    try {
      const { updatedList, savedAddress } = await saveOrUpdateAddress(newAddressForm, user, setUser);
      setSavedAddresses(updatedList);
      handleSelectAddress(savedAddress);
      setIsAddingNewAddress(false);
    } catch (err) {
      alert('Failed to save address: ' + err.message);
    }
  };

  const handleCreateOrder = async (e) => {
    if (e) e.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }
    if (!customer.address.trim()) {
      alert('Please provide a delivery address.');
      return;
    }

    setLoading(true);

    // If user entered/edited an address and selected "saveToAccount", save it
    if (saveToAccount && (!selectedAddressId || selectedAddressId === 'manual')) {
      try {
        await saveOrUpdateAddress({
          name: customer.name,
          phone: customer.phone,
          addressLine: customer.address,
          tag: 'Home',
          isDefault: savedAddresses.length === 0
        }, user, setUser);
      } catch (e) {
        console.warn('Auto-save address note:', e.message);
      }
    }

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
              {step === 1 && (isSelectingAddress ? 'Select Delivery Address' : isAddingNewAddress ? 'Add New Delivery Address' : 'Delivery & Contact Details')}
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
            <>
              {/* ADDRESS PICKER SUB-VIEW */}
              {isSelectingAddress ? (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3">
                    <span className="text-xs font-bold uppercase text-[#1C1B19] tracking-wider">Saved Addresses</span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewAddressForm({
                          name: user?.name || '',
                          phone: user?.phone || '',
                          addressLine: '',
                          city: '',
                          state: '',
                          pincode: '',
                          tag: 'Home',
                          isDefault: false
                        });
                        setIsAddingNewAddress(true);
                        setIsSelectingAddress(false);
                      }}
                      className="text-[11px] font-bold uppercase text-[#1C1B19] underline hover:opacity-75 cursor-pointer"
                    >
                      + Add New Address
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {savedAddresses.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`p-4 border bg-white cursor-pointer transition-all ${
                          selectedAddressId === addr.id 
                            ? 'border-[#1C1B19] ring-2 ring-[#1C1B19]/20' 
                            : 'border-[#E6E2DA] hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="addressRadio"
                              checked={selectedAddressId === addr.id}
                              onChange={() => handleSelectAddress(addr)}
                              className="accent-[#1C1B19] cursor-pointer"
                            />
                            <span className="text-xs font-bold text-[#1C1B19]">{addr.name}</span>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#F5F3ED] text-[#1C1B19] border border-[#E6E2DA]">
                              {addr.tag || 'Home'}
                            </span>
                          </div>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold text-green-700 uppercase bg-green-50 px-1.5 py-0.5 border border-green-200">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#1C1B19] ml-5 leading-relaxed">
                          {formatAddressString(addr)}
                        </p>
                        <p className="text-[11px] text-[#6E6A63] ml-5 mt-1">
                          Phone: <span className="text-[#1C1B19] font-medium">{addr.phone}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E6E2DA] flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSelectingAddress(false)}
                      className="w-full border border-[#E6E2DA] py-3 text-xs font-bold uppercase tracking-wider text-[#1C1B19] hover:bg-gray-100 cursor-pointer"
                    >
                      Back to Checkout
                    </button>
                  </div>
                </div>
              ) : isAddingNewAddress ? (
                /* ADD NEW ADDRESS SUB-FORM */
                <form onSubmit={handleSaveNewAddress} className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddressForm.name}
                        onChange={e => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19]"
                        placeholder="e.g. Suraj Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={newAddressForm.phone}
                        onChange={e => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19]"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">Delivery Address *</label>
                    <textarea
                      rows={2}
                      required
                      value={newAddressForm.addressLine}
                      onChange={e => setNewAddressForm({ ...newAddressForm, addressLine: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19] resize-none"
                      placeholder="Flat, House no., Building, Street..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">City</label>
                      <input
                        type="text"
                        value={newAddressForm.city}
                        onChange={e => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19]"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">State</label>
                      <input
                        type="text"
                        value={newAddressForm.state}
                        onChange={e => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19]"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">Pincode</label>
                      <input
                        type="text"
                        value={newAddressForm.pincode}
                        onChange={e => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19]"
                        placeholder="Pincode"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {['Home', 'Work', 'Other'].map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setNewAddressForm({ ...newAddressForm, tag })}
                        className={`px-3 py-1 text-xs font-bold uppercase border transition-all cursor-pointer ${
                          newAddressForm.tag === tag 
                            ? 'bg-[#1C1B19] text-[#FAF9F6] border-[#1C1B19]' 
                            : 'bg-white text-[#6E6A63] border-[#E6E2DA]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-[#E6E2DA]">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1C1B19] text-[#FAF9F6] font-bold text-xs tracking-wider py-3 uppercase hover:opacity-90 cursor-pointer shadow-sm"
                    >
                      Save & Deliver Here
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="px-5 border border-[#E6E2DA] text-[#1C1B19] font-bold text-xs tracking-wider py-3 uppercase hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* MAIN CHECKOUT FORM */
                <form onSubmit={handleCreateOrder} className="space-y-4 text-left">
                  
                  {/* Address Selection Card / Switcher */}
                  <div className="p-3.5 bg-[#F5F3ED] border border-[#E6E2DA] relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#6E6A63] uppercase tracking-wider">
                          Delivery Address
                        </span>
                        {selectedAddressId && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 bg-white text-[#1C1B19] border border-[#E6E2DA]">
                            Active Address
                          </span>
                        )}
                      </div>

                      {/* CHANGE ADDRESS BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          if (savedAddresses.length > 0) {
                            setIsSelectingAddress(true);
                          } else {
                            setNewAddressForm({
                              name: customer.name || user?.name || '',
                              phone: customer.phone || user?.phone || '',
                              addressLine: customer.address || '',
                              city: '',
                              state: '',
                              pincode: '',
                              tag: 'Home',
                              isDefault: true
                            });
                            setIsAddingNewAddress(true);
                          }
                        }}
                        className="text-xs font-bold text-[#1C1B19] underline hover:opacity-75 uppercase tracking-wider cursor-pointer"
                      >
                        {savedAddresses.length > 0 ? 'Change Address' : '+ Add Address'}
                      </button>
                    </div>

                    {customer.address ? (
                      <div>
                        <p className="text-xs font-semibold text-[#1C1B19] leading-relaxed">
                          {customer.address}
                        </p>
                        {customer.phone && (
                          <p className="text-[11px] text-[#6E6A63] mt-1 font-medium">
                            Phone: <span className="text-[#1C1B19] font-semibold">{customer.phone}</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-[#6E6A63] italic">
                        No address selected. Please enter delivery address below or click "+ Add Address".
                      </p>
                    )}
                  </div>

                  {/* Customer Full Name */}
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

                  {/* Phone & Email */}
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

                  {/* Delivery Address Details (always directly editable as well) */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase">
                        Delivery Address Details *
                      </label>
                      <span className="text-[10px] text-[#6E6A63] font-normal">
                        (Editable)
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      required
                      value={customer.address}
                      onChange={e => {
                        setCustomer({ ...customer, address: e.target.value });
                        setSelectedAddressId('manual');
                      }}
                      className="w-full px-4 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19] transition-all resize-none"
                      placeholder="Street name, Flat / House No., Landmark, City, Pincode..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveAddressFuture"
                      checked={saveToAccount}
                      onChange={e => setSaveToAccount(e.target.checked)}
                      className="rounded border-[#E6E2DA] text-[#1C1B19] cursor-pointer"
                    />
                    <label htmlFor="saveAddressFuture" className="text-[11px] font-semibold text-[#1C1B19] cursor-pointer select-none">
                      Save / update this address in my account for future orders
                    </label>
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
                    className="w-full bg-[#1C1B19] text-[#FAF9F6] font-bold text-xs tracking-widest py-4 uppercase hover:opacity-90 transition-opacity disabled:opacity-75 shadow-sm mt-4 cursor-pointer"
                  >
                    {loading ? 'Generating UPI QR...' : 'Proceed to Pay with UPI'}
                  </button>
                </form>
              )}
            </>
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
                  <span className="text-[#6E6A63] uppercase tracking-wider">Delivery To:</span>
                  <span className="font-medium text-[#1C1B19] text-right truncate max-w-[200px]">{customer.address}</span>
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
                className="w-full bg-[#1C1B19] hover:opacity-90 text-[#FAF9F6] font-bold text-xs py-4 uppercase tracking-widest cursor-pointer"
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
