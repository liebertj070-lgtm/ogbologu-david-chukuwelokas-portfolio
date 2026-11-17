import { Check, Copy, Mail, Phone, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { PROFILE } from '../data/content';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'fallback'>('idle');
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    if (PROFILE.contactFormEndpoint) {
      setStatus('submitting');
      try {
        const res = await fetch(PROFILE.contactFormEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        if (res.ok) {
          setStatus('sent');
          setName('');
          setEmail('');
          setMessage('');
          return;
        }
      } catch {
        // fall through to mailto fallback
      }
    }

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    setStatus('fallback');
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 1800);
    } catch {
      // ignore clipboard restrictions
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
        <a
          href={`mailto:${PROFILE.email}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/5 px-3 py-2 transition-colors hover:border-[#FF6A1A] hover:text-white"
        >
          <Mail className="h-3.5 w-3.5 text-[#FF6A1A]" />
          <span>{PROFILE.email}</span>
        </a>
        <button
          type="button"
          onClick={handleCopyPhone}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/5 px-3 py-2 transition-colors hover:border-[#4DE1FF] hover:text-white"
        >
          <Phone className="h-3.5 w-3.5 text-[#4DE1FF]" />
          <span className="font-mono">{PROFILE.phone}</span>
          {copiedPhone ? <Check className="h-3 w-3 text-[#4DE1FF]" /> : <Copy className="h-3 w-3 text-zinc-400" />}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="mb-1 block text-xs text-zinc-400">
              Your Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Recruiter or client name"
              className="w-full rounded-lg border border-white/12 bg-[#090B10] px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-[#FF6A1A] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1 block text-xs text-zinc-400">
              Your Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-white/12 bg-[#090B10] px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-[#FF6A1A] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1 block text-xs text-zinc-400">
            Project or Role Details
          </label>
          <textarea
            id="contact-message"
            rows={3}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me about the product, interface, frontend build, or video project."
            className="w-full rounded-lg border border-white/12 bg-[#090B10] px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-[#FF6A1A] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center gap-2 rounded-lg bg-[#FF6A1A] px-5 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-[#ff7f3a] disabled:opacity-60"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
          </button>

          {status === 'sent' && (
            <span className="font-mono text-xs text-[#4DE1FF]">Message delivered. Thank you!</span>
          )}
          {status === 'fallback' && (
            <span className="font-mono text-xs text-zinc-300">
              Opened email draft to {PROFILE.email}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
