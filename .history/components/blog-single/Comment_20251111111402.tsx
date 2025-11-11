// app/components/blog-single/Comment.tsx
"use client";

import { useEffect, useState } from "react";

type CommentRow = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
};

export default function Comment({ postId }: { postId: string }) {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const [rows, setRows] = useState<CommentRow[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    if (!postId) return;
    try {
      // ⬇️ use the id name your backend expects
      const r = await fetch(`${API}/api/comments?eventId=${encodeURIComponent(postId)}`, {
        cache: "no-store",
      });
      if (!r.ok) {
        const txt = await r.text();
        console.error("Comments GET failed:", r.status, txt);
        setRows([]);
        return;
      }
      setRows(await r.json());
    } catch (e) {
      console.error("Comments GET error:", e);
      setRows([]);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return alert("Fill all fields");

    setSending(true);
    try {
      // ⬇️ send eventId (NOT postId)
      const r = await fetch(`${API}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: postId, name, email, message }),
      });

      if (!r.ok) {
        const txt = await r.text();
        console.error("Comment POST failed:", r.status, txt);
        alert(`Failed (${r.status}). ${txt}`);
        return;
      }

      setName("");
      setEmail("");
      setMessage("");
      alert("Thanks! Your comment will appear after approval.");
      load(); // refresh list in case auto-approves in dev
    } catch (e) {
      console.error("Comment POST error:", e);
      alert("Network error.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="wrap-post-details" style={{ marginTop: "40px" }}>
        <div className="post-details">
          <h3 className="mb_20">{String(rows.length).padStart(2, "0")} Comments</h3>
          {rows.map((c) => (
            <div key={c._id} className="comment-item mb_20">
              <div className="d-flex gap_16 align-items-start">
                <div className="avatar sz-56 bg-surface2-color rounded-circle" />
                <div className="flex-1">
                  <div className="d-flex align-items-center gap_8 mb_4">
                    <h6 className="mb-0">{c.name}</h6>
                    <span className="badge bg-success" style={{ fontSize: 10 }}>✔</span>
                  </div>
                  <div className="text-body-2 text_on-surface-color mb_8">
                    {new Date(c.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                  <p className="mb_8">{c.message}</p>
                </div>
              </div>
              <div className="divider mt_16" />
            </div>
          ))}
        </div>
      </div>

      <div className="leave-comment mt_28">
        <h3 className="mb_16">Leave A Comment</h3>
        <form onSubmit={submit} className="row g-3">
          <div className="col-md-6">
            <input
              className="tf-input"
              placeholder="Your Name*"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              className="tf-input"
              placeholder="Your Email*"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="col-12">
            <textarea
              className="tf-textarea"
              placeholder="Your Comment*"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div className="col-12">
            <button className="tf-btn" disabled={sending}>
              {sending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
