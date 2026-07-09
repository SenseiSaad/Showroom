export type Vehicle = {
  id: number;
  brand: number;
  brand_name?: string;
  category: number;
  category_name?: string;
  name: string;
  price: string | number;
  fuel_type: string;
  transmission: string;
  top_speed: number;
  horsepower: number;
  country_of_origin: string;
  year: number;
  description: string;
  created_at?: string;
};

export type Brand = {
  id: number;
  name: string;
  country: string;
};

export type Category = {
  id: number;
  name: string;
};

const BASE_URL = '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

export function getVehicles() {
  return request<{ results?: Vehicle[] } | Vehicle[]>('/vehicle/');
}

export function getBrands() {
  return request<Brand[]>('/vehicle/brands/');
}

export function getCategories() {
  return request<Category[]>('/vehicle/categories/');
}

export function login(username: string, password: string) {
  return request<{ access: string; refresh: string }>('/api/token/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function registerUser(payload: { username: string; email: string; password: string }) {
  return request('/vehicle/register-user/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createVehicle(token: string, payload: Record<string, unknown>) {
  return request('/vehicle/create/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}