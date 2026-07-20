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

export type ContactMessagePayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function submitContactMessage(payload: ContactMessagePayload) {
  return request('/vehicle/messages/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}