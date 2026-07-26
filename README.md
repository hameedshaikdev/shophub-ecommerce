# ShopHub - E-Commerce Platform

A modern, responsive e-commerce website with two shopping categories: **Tailoring Tools** and **Women's Fashion**, built with React, Tailwind CSS, Supabase, and Razorpay.

## 🌟 Features

### User Features
- **Dual Category System**: Switch between Tailoring Tools and Women's Fashion
- **Product Browsing**: Browse products with category filters
- **Product Search**: Search functionality across both categories
- **Product Details**: Detailed product pages with images and descriptions
- **Shopping Cart**: Unified cart shared across both categories
- **Wishlist**: Save favorite products for later
- **User Authentication**: Secure login/signup with Supabase
- **Checkout & Payment**: Integrated Razorpay payment gateway
- **Order Management**: View order history and status
- **WhatsApp Notifications**: Automatic order notifications via WhatsApp
- **Responsive Design**: Mobile-first design with bottom navigation
- **User Profile**: Manage account information

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Image Upload**: Upload product images to Supabase Storage
- **Inventory Control**: Manage stock levels
- **Category Management**: Organize products by category and subcategory
- **Product Status**: Activate/deactivate products

### WhatsApp Integration
- **Order Notifications**: Automatic WhatsApp messages to admin when orders are placed
- **Customer Confirmations**: Order confirmation messages to customers
- **Detailed Order Info**: Complete order details including items, customer info, and shipping address

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 3
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payment**: Razorpay
- **Notifications**: WhatsApp API integration
- **Icons**: Lucide React
- **Hosting**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Razorpay account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Set up Supabase database**
   - Run `database-setup.sql` in Supabase SQL Editor
   - Run `storage-policies.sql` for image upload policies
   - Create `product-images` storage bucket

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📱 WhatsApp Integration Setup

The app automatically sends WhatsApp notifications when orders are placed:

1. **Admin Notifications**: Detailed order information sent to admin WhatsApp
2. **Customer Confirmations**: Order confirmation sent to customer

### Configuration
- Admin phone number is set to: `+919173963720`
- Update in `src/utils/whatsappNotifications.js` if needed
- For production, integrate with WhatsApp Business API

## 🔐 Admin Access

Admin panel is accessible at `/admin` for the configured admin email:
- Current admin: `as.businezzz@gmail.com`
- Change in `src/pages/AdminPanel.jsx` if needed

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Import project from GitHub
   - Add environment variables
   - Deploy!

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_RAZORPAY_KEY_ID=your_production_razorpay_key
```

## 📊 Database Schema

### Products Table
- `id` (UUID, Primary Key)
- `name` (Text)
- `description` (Text)
- `price` (Decimal)
- `original_price` (Decimal)
- `category` (Text: 'tailoring' | 'fashion')
- `sub_category` (Text)
- `unit` (Text)
- `stock` (Integer)
- `image_url` (Text)
- `active` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Orders Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `total_amount` (Decimal)
- `payment_id` (Text)
- `shipping_address` (JSONB)
- `items` (JSONB)
- `status` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 🎯 Key Features Implementation

### Shared Cart System
- Cart persists across category switches
- Stored in localStorage
- Global state management with Context API

### WhatsApp Notifications
- Triggered after successful payment
- Detailed order information
- Admin and customer notifications
- Fallback if WhatsApp fails

### Payment Integration
- Razorpay payment gateway
- Test and production modes
- Order tracking with payment ID

### Error Handling
- Global error boundary
- Loading states
- User-friendly error messages
- Retry mechanisms

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

## 🔒 Security

- Row Level Security (RLS) enabled
- Authenticated routes protected
- Secure file uploads
- Environment variables for sensitive data
- HTTPS enforced in production

## 📧 Support

For issues or questions:
- Email: as.businezzz@gmail.com
- WhatsApp: +91 9173963720

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ using React, Tailwind CSS, Supabase, and Razorpay