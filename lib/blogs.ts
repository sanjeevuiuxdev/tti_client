export async function fetchBlogs(params: { section?: string; category?: string; limit?: number }) {
    const base = process.env.NEXT_PUBLIC_API_BASE!;
    const qs = new URLSearchParams();
    if (params.section) qs.set("section", params.section);
    if (params.category) qs.set("category", params.category);
    if (params.limit) qs.set("limit", String(params.limit));
    const url = `${base}/api/blogs${qs.toString() ? `?${qs.toString()}` : ""}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    return res.json();
  }
  