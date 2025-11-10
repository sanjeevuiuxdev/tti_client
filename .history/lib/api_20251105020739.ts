// lib/api.ts
export async function getJSON<T>(path: string): Promise<T> {
    const base = process.env.NEXT_PUBLIC_API_BASE;
  
    // Temporary loud debug – remove after it prints once
    console.log("NEXT_PUBLIC_API_BASE =", JSON.stringify(base));
  
    if (!base) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE is missing. Put it in .env.local (NEXT_PUBLIC_API_BASE=http://localhost:5000) and restart Next."
      );
    }
  
    const url = `${base}${path}`; // path should start with /api/...
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`API ${res.status} for ${url}: ${body}`);
    }
    return res.json();
  }
  