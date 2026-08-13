# Daffa Portfolio

Premium Next.js portfolio for Muhamad Daffa Permana.

## Run locally

```bash
npm install
npm run dev
```

## Real contact form

The contact form uses the Resend HTTP API from `app/api/contact/route.ts`.

1. Create a Resend account and API key.
2. Copy `.env.example` to `.env.local`.
3. Set `RESEND_API_KEY`.
4. Set `CONTACT_TO` to the inbox that should receive messages.
5. For production, set `CONTACT_FROM` to a sender/domain verified in Resend.

Without `RESEND_API_KEY`, the form intentionally does not pretend that a message was sent; it shows an error instead.
