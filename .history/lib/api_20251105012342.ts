const BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 300 }, ...init });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}
