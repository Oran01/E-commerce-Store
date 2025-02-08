# Next.js E-commerce Store

This is a **Next.js-based E-commerce Store** that supports product listing, payments using **Stripe**, and email notifications using **Resend**. The project includes an **admin panel** for managing products, customers, orders, and discount codes.

## 🚀 Tech Stack

- **Frontend:** Next.js, Tailwind CSS, React
- **Backend:** Next.js Server Actions, Prisma ORM
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** Basic Auth for Admin Panel
- **Payments:** Stripe Payment Integration
- **Email Notifications:** Resend API for sending emails
- **Deployment:** Vercel (recommended)

---

## 🎯 Features

### 🛒 E-commerce Functionality

- Browse and purchase products
- Stripe payment integration
- Order history with downloadable links

### 📦 Product Management

- Admin panel to manage products
- Upload images and digital products
- Set availability and pricing

### 🎟️ Discount System

- Create and manage discount codes
- Supports percentage and fixed discounts

### 📈 Analytics Dashboard

- Sales trends visualization
- Top-selling products
- Revenue breakdown by product

### 📩 Email Notifications

- Order confirmation emails
- Order history retrieval via email

---

## 🔧 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/nextjs-ecommerce.git
cd nextjs-ecommerce
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3️⃣ Setup Environment Variables

Create a **.env** file in the root directory and add:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/next-js-ecommerce-store-code"
ADMIN_USERNAME=admin
HASHED_ADMIN_PASSWORD=yourhashedpassword
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 4️⃣ Setup Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 💳 Stripe Payment Integration

This project integrates **Stripe** for handling payments.

- **Payments:** Users can checkout and pay via Stripe.

- **Webhook Handling:** The app listens to Stripe webhooks to process orders.
- **Success Page:** After payment, users get a download link.

To learn more, visit: [Stripe Docs](https://docs.stripe.com/payments/quickstart?client=next).

---

## 📧 Email Notifications with Resend

The **Resend API** is used to send email confirmations and order receipts.

- **Order Confirmation:** Sent after successful payment.

- **Order History Retrieval:** Users can request past orders via email.

To learn more, visit: [Resend Documentation](https://resend.com/emails).

---

## 🚀 Deployment

### Deploy to Vercel

1. **Login to Vercel:**

   ```bash
   vercel login
   ```

2. **Deploy:**

   ```bash
   vercel
   ```

For more details, check [Next.js Deployment Docs](https://nextjs.org/docs/deployment).

---

## 📚 References & Credits

- [Next.js Official Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/getting-started/quickstart-sqlite)
- [Stripe Docs](https://docs.stripe.com/payments/quickstart?client=next)
- [Resend Docs](https://resend.com/emails)
- [Web Dev Simplified - Next.js Course](https://www.youtube.com/watch?v=iqrgggs0Qk0&t=6414s)
