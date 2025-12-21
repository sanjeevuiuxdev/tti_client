"use client";

export default function Contact() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    const API = process.env.NEXT_PUBLIC_API_BASE;

    const res = await fetch(`${API}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Message sent successfully");
      form.reset();
    } else {
      alert("Failed to send message");
    }
  }

  return (
    <form className="form-contact" onSubmit={handleSubmit}>
      {/* ⬇️ YOUR EXISTING JSX — UNCHANGED */}
