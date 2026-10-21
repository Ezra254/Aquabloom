import { useState } from 'react';
import { companyContent } from '../data/companyContent';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  interest: 'fingerlings',
  message: '',
  companyWebsite: '',
};

export function Contact() {
  const { contact } = companyContent;
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Sending your enquiry…' });

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to send your enquiry right now.');
      }

      setForm(emptyForm);
      setStatus({
        type: 'success',
        message:
          'Thank you. Your enquiry has been emailed to Aquabloom Ventures Limited and saved for follow-up.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to send your enquiry right now.',
      });
    }
  }

  return (
    <section className="section section--soft" id="contact">
      <div className="contact-layout">
        <div>
          <p className="kicker">{contact.kicker}</p>
          <h2>{contact.title}</h2>
          <p className="lede">{contact.text}</p>

          <ul className="contact-details">
            <li>
              <span>Phone</span>
              <a href={contact.phoneHref}>{contact.phoneLabel}</a>
            </li>
            <li>
              <span>Email</span>
              <a href={contact.emailHref}>{contact.emailLabel}</a>
            </li>
          </ul>

          <div className="panel contact-aside">
            <h3>{contact.locationTitle}</h3>
            <p>{contact.location}</p>
            <p className="contact-audiences">{contact.audiences}</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">
            Full name
            <input
              id="name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={updateField}
              required
              minLength={2}
            />
          </label>

          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={updateField}
              required
            />
          </label>

          <label htmlFor="phone">
            Phone <span>(optional)</span>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={updateField}
            />
          </label>

          <label htmlFor="interest">
            I am enquiring about
            <select
              id="interest"
              name="interest"
              value={form.interest}
              onChange={updateField}
            >
              {contact.interests.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="hp" htmlFor="companyWebsite">
            Company website
            <input
              id="companyWebsite"
              name="companyWebsite"
              value={form.companyWebsite}
              onChange={updateField}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>

          <label className="full" htmlFor="message">
            Message
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={updateField}
              required
              minLength={10}
            />
          </label>

          <button className="button-primary" type="submit" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Sending…' : 'Send enquiry'}
          </button>

          {status.type !== 'idle' && status.type !== 'loading' ? (
            <p className={`form-status form-status--${status.type}`} role="status">
              {status.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
