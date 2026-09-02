import React, { useState, useEffect } from 'react';
import {
  getSavedAddresses,
  saveOrUpdateAddress,
  removeAddress,
  setDefaultAddress,
  formatAddressString
} from '../../utils/addressStorage';

export default function ManageAddressesModal({ isOpen, onClose, user, setUser, onSelectAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({
    id: null,
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    tag: 'Home',
    isDefault: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const list = getSavedAddresses(user);
      setAddresses(list);
      setIsEditing(false);
      setError('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setCurrentEdit({
      id: null,
      name: user?.name || '',
      phone: user?.phone || '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      tag: 'Home',
      isDefault: addresses.length === 0
    });
    setIsEditing(true);
    setError('');
  };

  const handleStartEdit = (addr) => {
    setCurrentEdit({ ...addr });
    setIsEditing(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentEdit.name.trim() || !currentEdit.phone.trim() || !currentEdit.addressLine.trim()) {
      setError('Please fill in required fields (Name, Phone, Address)');
      return;
    }

    try {
      const { updatedList, savedAddress } = await saveOrUpdateAddress(currentEdit, user, setUser);
      setAddresses(updatedList);
      setIsEditing(false);
      if (onSelectAddress) {
        onSelectAddress(savedAddress);
      }
    } catch (err) {
      setError('Failed to save address: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updated = await removeAddress(id, user, setUser);
      setAddresses(updated);
    }
  };

  const handleSetDefault = async (id) => {
    const updated = await setDefaultAddress(id, user, setUser);
    setAddresses(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B19]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-lg overflow-hidden border border-[#E6E2DA] flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E2DA] bg-[#F5F3ED]">
          <div>
            <span className="text-[10px] font-bold text-[#6E6A63] uppercase tracking-[0.2em] block mb-0.5">
              HANGULUXE ACCOUNT
            </span>
            <h3 className="text-sm font-bold text-[#1C1B19] uppercase tracking-wider">
              {isEditing ? (currentEdit.id ? 'Edit Delivery Address' : 'Add New Address') : 'Saved Addresses'}
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
        <div className="p-6 overflow-y-auto flex-1 text-left">
          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 font-semibold">
              {error}
            </div>
          )}

          {isEditing ? (
            /* Address Form */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentEdit.name}
                    onChange={e => setCurrentEdit({ ...currentEdit, name: e.target.value })}
                    placeholder="e.g. Suraj Sharma"
                    className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={currentEdit.phone}
                    onChange={e => setCurrentEdit({ ...currentEdit, phone: e.target.value })}
                    placeholder="10-digit number"
                    className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">
                  Flat, House no., Building, Street *
                </label>
                <textarea
                  rows={2}
                  required
                  value={currentEdit.addressLine}
                  onChange={e => setCurrentEdit({ ...currentEdit, addressLine: e.target.value })}
                  placeholder="e.g. 402, Sunshine Heights, MG Road"
                  className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19] resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={currentEdit.city}
                    onChange={e => setCurrentEdit({ ...currentEdit, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">State</label>
                  <input
                    type="text"
                    value={currentEdit.state}
                    onChange={e => setCurrentEdit({ ...currentEdit, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    value={currentEdit.pincode}
                    onChange={e => setCurrentEdit({ ...currentEdit, pincode: e.target.value })}
                    placeholder="e.g. 400001"
                    className="w-full px-3 py-2 border border-[#E6E2DA] bg-white text-xs font-semibold outline-none text-[#1C1B19] focus:border-[#1C1B19]"
                  />
                </div>
              </div>

              {/* Tag Selection */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#6E6A63] uppercase mb-1.5">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setCurrentEdit({ ...currentEdit, tag: type })}
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        currentEdit.tag === type 
                          ? 'bg-[#1C1B19] text-[#FAF9F6] border-[#1C1B19]' 
                          : 'bg-white text-[#6E6A63] border-[#E6E2DA] hover:border-gray-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="makeDefault"
                  checked={currentEdit.isDefault}
                  onChange={e => setCurrentEdit({ ...currentEdit, isDefault: e.target.checked })}
                  className="rounded border-[#E6E2DA] text-[#1C1B19] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="makeDefault" className="text-xs font-semibold text-[#1C1B19] cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E6E2DA]">
                <button
                  type="submit"
                  className="flex-1 bg-[#1C1B19] text-[#FAF9F6] font-bold text-xs tracking-wider py-3 uppercase hover:opacity-90 cursor-pointer shadow-sm"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 border border-[#E6E2DA] text-[#1C1B19] font-bold text-xs tracking-wider py-3 uppercase hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Address List */
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-[#6E6A63]">
                  Select, edit, or add a delivery address.
                </p>
                <button
                  onClick={handleStartAdd}
                  className="bg-[#1C1B19] text-[#FAF9F6] text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider hover:opacity-90 cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <span>+</span> Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#E6E2DA] p-6">
                  <div className="text-3xl mb-2">📍</div>
                  <p className="text-xs font-bold text-[#1C1B19] uppercase tracking-wider mb-1">No Saved Addresses</p>
                  <p className="text-[11px] text-[#6E6A63] mb-4">You have not added any delivery addresses yet.</p>
                  <button
                    onClick={handleStartAdd}
                    className="bg-[#1C1B19] text-[#FAF9F6] text-xs font-bold px-4 py-2 uppercase tracking-wider hover:opacity-90 cursor-pointer"
                  >
                    Add Address Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      className={`p-4 border bg-white transition-all relative ${
                        addr.isDefault ? 'border-[#1C1B19] ring-1 ring-[#1C1B19]/20' : 'border-[#E6E2DA] hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1C1B19]">{addr.name}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#F5F3ED] text-[#1C1B19] border border-[#E6E2DA]">
                            {addr.tag || 'Home'}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <button
                            onClick={() => handleStartEdit(addr)}
                            className="text-[#6E6A63] hover:text-[#1C1B19] font-semibold underline cursor-pointer text-[11px]"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDelete(addr.id)}
                            className="text-red-500 hover:text-red-700 font-semibold underline cursor-pointer text-[11px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#1C1B19] leading-relaxed mb-1">
                        {formatAddressString(addr)}
                      </p>
                      <p className="text-[11px] text-[#6E6A63] font-medium">
                        Mobile: <span className="text-[#1C1B19]">{addr.phone}</span>
                      </p>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            className="text-[11px] text-[#6E6A63] hover:text-[#1C1B19] font-medium cursor-pointer"
                          >
                            Set as default
                          </button>
                        ) : (
                          <span className="text-[11px] text-green-600 font-medium">✓ Default Address</span>
                        )}

                        {onSelectAddress && (
                          <button
                            onClick={() => {
                              onSelectAddress(addr);
                              onClose();
                            }}
                            className="bg-[#1C1B19] text-[#FAF9F6] text-[10px] font-bold px-3 py-1 uppercase tracking-wider hover:opacity-90 cursor-pointer"
                          >
                            Deliver Here
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
