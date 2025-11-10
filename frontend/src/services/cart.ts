import api from '../utils/api';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  old_price?: number;
  images?: string[];
  stock: number;
  created_at: string;
  updated_at: string;
}

export async function getCart(): Promise<CartItem[]> {
  const response = await api.get<{ success: boolean; data: CartItem[] }>('/users/cart');
  return response.data.data;
}

export async function addToCart(productId: number, quantity: number = 1): Promise<CartItem> {
  const response = await api.post<{ success: boolean; data: CartItem }>('/users/cart', {
    product_id: productId,
    quantity,
  });
  return response.data.data;
}

export async function updateCartItem(cartItemId: number, quantity: number): Promise<CartItem> {
  const response = await api.put<{ success: boolean; data: CartItem }>(`/users/cart/${cartItemId}`, {
    quantity,
  });
  return response.data.data;
}

export async function removeFromCart(cartItemId: number): Promise<void> {
  await api.delete(`/users/cart/${cartItemId}`);
}

