// /lib/api.ts (or the inline helper you used)
export async function getJSON<T>(path: string): Promise<T> {
    const base = process.env.NEXT_PUBLIC_API_BASE;
    if (!base) {
      throw new Error("NEXT_PUBLIC_API_BASE is missing. Set it in .env.local and restart Next.");
    }
    const res = await fetch(`${base}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`API ${res.status}: ${body}`);
    }
    return res.json();
  }
  