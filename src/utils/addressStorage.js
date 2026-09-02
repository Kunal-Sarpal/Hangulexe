import { apiUpdateProfile } from '../api/api';

const STORAGE_KEY = 'hanguluxe_addresses';

// Helper to get local stored addresses
export const getLocalAddresses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse local addresses:', err);
    return [];
  }
};

// Helper to set local addresses
export const setLocalAddresses = (addresses) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  } catch (err) {
    console.error('Failed to save local addresses:', err);
  }
};

// Merge server addresses and local addresses
export const getSavedAddresses = (user) => {
  const local = getLocalAddresses();
  const server = Array.isArray(user?.addresses) ? user.addresses : [];

  const map = new Map();
  // Server addresses first
  server.forEach(addr => {
    if (addr && (addr.id || addr._id)) {
      const id = addr.id || addr._id;
      map.set(id, { ...addr, id });
    }
  });
  // Local addresses overlay/merge
  local.forEach(addr => {
    if (addr && addr.id) {
      map.set(addr.id, { ...addr });
    }
  });

  const merged = Array.from(map.values());

  // If user has default_address as simple string and no structured addresses, create an initial address
  if (merged.length === 0 && user?.default_address) {
    const defaultAddr = {
      id: 'addr_init',
      name: user.name || 'Recipient',
      phone: user.phone || '',
      addressLine: user.default_address,
      city: '',
      state: '',
      pincode: '',
      tag: 'Home',
      isDefault: true
    };
    merged.push(defaultAddr);
    setLocalAddresses(merged);
  }

  return merged;
};

// Save or update an address
export const saveOrUpdateAddress = async (address, user, setUser) => {
  const currentList = getSavedAddresses(user);
  let updatedList;

  const addressId = address.id || `addr_${Date.now()}`;
  const addressToSave = {
    ...address,
    id: addressId,
    tag: address.tag || 'Home'
  };

  const existingIndex = currentList.findIndex(a => a.id === addressId);

  if (addressToSave.isDefault) {
    // Demote any other defaults
    currentList.forEach(a => { a.isDefault = false; });
  } else if (currentList.length === 0) {
    addressToSave.isDefault = true;
  }

  if (existingIndex >= 0) {
    currentList[existingIndex] = addressToSave;
    updatedList = [...currentList];
  } else {
    updatedList = [addressToSave, ...currentList];
  }

  setLocalAddresses(updatedList);

  if (user && setUser) {
    const updatedUser = {
      ...user,
      addresses: updatedList,
      default_address: addressToSave.isDefault 
        ? formatAddressString(addressToSave) 
        : (user.default_address || formatAddressString(addressToSave))
    };
    setUser(updatedUser);

    try {
      await apiUpdateProfile({
        addresses: updatedList,
        default_address: updatedUser.default_address
      });
    } catch (err) {
      console.warn('Sync address to server failed, kept locally:', err.message);
    }
  }

  return { updatedList, savedAddress: addressToSave };
};

// Delete address
export const removeAddress = async (addressId, user, setUser) => {
  const currentList = getSavedAddresses(user);
  const updatedList = currentList.filter(a => a.id !== addressId);
  setLocalAddresses(updatedList);

  if (user && setUser) {
    const updatedUser = {
      ...user,
      addresses: updatedList
    };
    setUser(updatedUser);

    try {
      await apiUpdateProfile({ addresses: updatedList });
    } catch (err) {
      console.warn('Sync remove address to server failed, kept locally:', err.message);
    }
  }

  return updatedList;
};

// Set address as default
export const setDefaultAddress = async (addressId, user, setUser) => {
  const currentList = getSavedAddresses(user);
  let defaultAddr = null;

  const updatedList = currentList.map(a => {
    const isDef = a.id === addressId;
    if (isDef) defaultAddr = a;
    return { ...a, isDefault: isDef };
  });

  setLocalAddresses(updatedList);

  if (user && setUser) {
    const updatedUser = {
      ...user,
      addresses: updatedList,
      default_address: defaultAddr ? formatAddressString(defaultAddr) : user.default_address
    };
    setUser(updatedUser);

    try {
      await apiUpdateProfile({
        addresses: updatedList,
        default_address: updatedUser.default_address
      });
    } catch (err) {
      console.warn('Sync default address failed, kept locally:', err.message);
    }
  }

  return updatedList;
};

// Format address for human display
export const formatAddressString = (addr) => {
  if (!addr) return '';
  if (typeof addr === 'string') return addr;

  const parts = [
    addr.addressLine,
    addr.city,
    addr.state ? (addr.pincode ? `${addr.state} - ${addr.pincode}` : addr.state) : addr.pincode
  ].filter(Boolean);

  return parts.join(', ');
};
