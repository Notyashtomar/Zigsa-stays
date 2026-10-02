# Zigsa Stays

Marketing and direct-booking site for **Zigsa Stays Manali** — hotel, café, and restaurant on a quiet hillside in Simsa village.

Tagline: **Elevation: High. Stress: Zero**

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Prisma + SQLite (`prisma/dev.db`) so `npm run dev` works on Windows without Postgres
- NextAuth credentials for a single staff login
- Razorpay Orders + Checkout + webhook (optional)
- Resend email (optional)

## Setup (Windows PowerShell)

From the project folder:

```powershell
npm install
Copy-Item .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Staff desk: [http://localhost:3000/admin](http://localhost:3000/admin)

Default local staff login (change these in `.env`):

- Email: `admin@zigsastays.com`
- Password: `zigsa-admin-change-me` if you copied the values from the example and then set `ADMIN_PASSWORD` yourself

If you only copied `.env.example`, set `NEXTAUTH_SECRET` and `ADMIN_PASSWORD` before using admin.

## Environment

See `.env.example`. Required for local run:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | `file:./dev.db` |
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random string |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Staff login |

Optional:

| Variable | If missing |
| --- | --- |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Guests still book; pay-at-property / WhatsApp fallback |
| `RAZORPAY_WEBHOOK_SECRET` | Checkout verify still works; webhook ignored if unsigned |
| `RESEND_API_KEY` / `EMAIL_FROM` | Booking still confirms; no email is sent |

Razorpay webhook URL: `https://your-domain/api/webhooks/razorpay`  
Events: `payment.captured`, `order.paid`

## Booking rules

- Price = nights × room type rate (stored in paise)
- Overlap check uses `inventoryCount` on each room type
- With Razorpay keys: `PENDING_PAYMENT` holds expire after 15 minutes; webhook or checkout verify marks the stay `CONFIRMED`
- Without Razorpay keys: bookings complete as pay-at-property reservations (`CONFIRMED`, payment marked `pay_at_property`) — no expiry
- Admin can cancel any booking to free inventory, or confirm a stuck hold
- Admin can block dates for one room type or the whole property

## Not in v1

OTA sync, GST invoices, guest accounts, multi-property. A single `Property` row is seeded so a second stay can be added later.

## Useful commands

```powershell
npx prisma studio
npx prisma migrate dev
npm run build
```
