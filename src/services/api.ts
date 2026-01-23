import { Phone, PhoneDetail } from '@/types';

// ============================================
// API Configuration
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// ============================================
// Base Fetch Wrapper
// ============================================

/**
 * Base fetch wrapper with authentication headers
 */
async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL?.replace(/\/$/, '')}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY || '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid API key');
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ============================================
// Phone Endpoints
// ============================================

/**
 * Get list of phones with optional search filter
 * @param search - Optional search query to filter by name or brand
 * @returns Array of phones
 */
export async function getPhones(search?: string): Promise<Phone[]> {
  const params = new URLSearchParams();
  if (search) {
    params.append('search', search);
  }

  const queryString = params.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return fetchWithAuth<Phone[]>(endpoint);
}

/**
 * Get phone details by ID
 * @param id - Phone ID
 * @returns Phone details with specs, colors, storage options, and similar products
 */
export async function getPhoneById(id: string): Promise<PhoneDetail> {
  return fetchWithAuth<PhoneDetail>(`/products/${id}`);
}
