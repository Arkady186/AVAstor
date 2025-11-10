import api from '../utils/api';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  old_price?: number;
  stock: number;
  sku?: string;
  category_id?: number;
  seller_id?: number;
  images?: string[];
  rating: number;
  reviews_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ProductFilters {
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export async function getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const response = await api.get<ProductListResponse>(`/products?${params.toString()}`);
  return response.data;
}

export async function getProduct(id: number): Promise<Product> {
  const response = await api.get<{ success: boolean; data: Product }>(`/products/${id}`);
  return response.data.data;
}

