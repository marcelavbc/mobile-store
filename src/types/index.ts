// ============================================
// Phone Types
// ============================================

export interface Phone {
  id: string;
  brand: string;
  name: string;
  basePrice: number;
  imageUrl: string;
}

export interface PhoneDetail {
  id: string;
  brand: string;
  name: string;
  description: string;
  basePrice: number;
  rating: number;
  specs: PhoneSpecs;
  colorOptions: ColorOption[];
  storageOptions: StorageOption[];
  similarProducts: Phone[];
}

export interface PhoneSpecs {
  screen: string;
  resolution: string;
  processor: string;
  mainCamera: string;
  selfieCamera: string;
  battery: string;
  os: string;
  screenRefreshRate: string;
}

export interface ColorOption {
  name: string;
  hexCode: string;
  imageUrl: string;
}

export interface StorageOption {
  capacity: string;
  price: number;
}

// ============================================
// Cart Types
// ============================================

export interface CartItem {
  id: string;
  phoneId: string;
  name: string;
  brand: string;
  imageUrl: string;
  color: ColorOption;
  storage: StorageOption;
  quantity: number;
}

// ============================================
// API Types
// ============================================

export interface ApiError {
  error: string;
  message: string;
}
