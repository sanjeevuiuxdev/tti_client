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
      <div className="wrap">
        <div className="tf-grid-layout md-col-2 mb_20">
          <fieldset className="">
            <label
              className="text-body-1 mb_8 text_on-surface-color"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your Name*"
              name="name"
              tabIndex={2}
              defaultValue=""
              aria-required="true"
              required
            />
          </fieldset>
          <fieldset className="">
            <label
              className="text-body-1 mb_8 text_on-surface-color"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              className=""
              type="number"
              placeholder="Phone"
              name="phone"
              tabIndex={2}
              defaultValue=""
              id="phone"
              aria-required="true"
              required
            />
          </fieldset>
        </div>

        <fieldset className="">
            <label
              className="text-body-1 mb_8 text_on-surface-color"
              htmlFor="em"
            >
              Phone
            </label>
            <input
              className=""
              type="number"
              placeholder="Phone"
              name="phone"
              tabIndex={2}
              defaultValue=""
              id="phone"
              aria-required="true"
              required
            />
          </fieldset>


        <fieldset>
          <label
            className="text-body-1 mb_12 text_on-surface-color"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            id="message"
            className=""
            name="message"
            rows={4}
            placeholder="Write note"
            tabIndex={2}
            aria-required="true"
            required
            defaultValue={""}
          />
        </fieldset>
      </div>
      <div className="button-submit">
        <button
          className="tf-btn animate-hover-btn btn-switch-text"
          type="submit"
        >
          <span>
            <span className="btn-double-text" data-text="Send Message">
              Send Message
            </span>
          </span>
        </button>
      </div>
    </form>
  );
}
