# Solange Hair Braiding Authentication & Role-Based Access Control

This document outlines the login architecture, user roles, and access control mechanisms for the Solange Hair Braiding platform. The system is designed to provide entirely distinct experiences between clients booking services and internal staff managing the salon operations.

---

## 🔐 1. Authentication System (Login)

The platform utilizes a secure, session-based authentication system likely powered by NextAuth.js (or an equivalent JWT-based system) integrated with MongoDB.

### **Login Flow for Clients:**
- **Entry point:** `/login` or during the `/booking` flow checkout.
- **Methods:**
  - Standard Email / Password.
  - Social Logins (Google / Apple) for rapid booking.
- **Flow:**
  - Upon successful login, the client receives an authentication token (JWT) stored securely in HTTP-only cookies.
  - The client is redirected to their **Client Dashboard** or back to their active booking/checkout session.

### **Login Flow for Staff/Admins:**
- **Entry point:** `/admin/login` (a hidden or securely restricted gateway).
- **Methods:**
  - Strictly Email / Password (managed internally).
  - Multi-Factor Authentication (MFA) recommended for Super Admins.
- **Flow:**
  - Standard token issuance, but the JWT payload includes explicit `role` permissions.
  - The user is redirected to the `/admin/dashboard` showing proprietary metrics and tools.

---

## 🎭 2. User Roles & Specific Permissions

The platform supports a robust Role-Based Access Control (RBAC) model. There are **three primary tiers** of access.

### **Tier 1: The Client (Customer)**
_The end-user seeking salon services._
- **Role Identifier:** `client` (Default role upon standard registration).
- **Permissions:**
  - Complete the booking flow and pay for services.
  - View personal appointment history and upcoming bookings.
  - Cancel or reschedule own appointments (subject to salon time-window policies).
  - Update personal profile (name, phone, billing information).
- **Restricted from:** Any `/admin/*` routes.

### **Tier 2: The Stylist (Staff User)**
_Employees of Solange Salon._
- **Role Identifier:** `stylist` or `staff`.
- **Permissions:**
  - View their own personal daily/weekly appointment calendar.
  - Mark appointments as "Completed", "No-show", or "In-Progress".
  - Add specific notes to a client's profile (e.g., hair condition, previous custom formulas).
  - Block out personal time on their calendar (with admin approval).
- **Restricted from:** Financial analytics, overriding pricing, managing other staff members, modifying global salon settings.

### **Tier 3: The Super Admin (Owner/Manager)**
_The highest level of control, typically reserved for Solange or the studio manager._
- **Role Identifier:** `admin`.
- **Permissions:**
  - **Full Dashboard Access:** View gross revenue, daily sales, and aggregate analytics.
  - **User & Staff Management:** Create, promote, or delete staff accounts.
  - **Schedule God-Mode:** Override any booking, force-cancel appointments, or alter stylist schedules.
  - **Service Management:** Add/Edit/Delete available services, modify durations, and change global pricing.
  - **Global Settings:** Modify business hours, deposit requirements, and manage integrated payment gateways (Stripe/PayPal APIs).
  - **Database Control:** View raw client lists and export data.

---

## 🛡️ 3. Security & Route Protection

Routing in Next.js is heavily guarded by middleware to prevent unauthorized access.

### **Middleware Rules (`middleware.ts`)**

1. **Public Routes (No login required):**
   - `/`, `/about`, `/services`, `/contact`
   - `/booking` (Up to the personal information/payment step).

2. **Protected Routes (Requires `client` login or higher):**
   - `/profile`
   - `/appointments` (Client facing)
   - `/checkout`

3. **Admin Routes (Strictly requires `admin` or `staff` token):**
   - **`/admin/*`**: Any route nested under admin requires token validation.
   - If a standard `client` attempts to hit `/admin/dashboard`, the middleware intercepts the request and instantly redirects them to `/login` or a `403 Unauthorized` page.
   - Further checks within components restrict `staff` members from accessing `admin`-only components like financial charts or settings panels.

---

## 🗄️ 4. User Schema Architecture (MongoDB Example)

To support this logic, the underlying User model in MongoDB looks like this:

```typescript
// Sample architecture for the User Model
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // Hashed
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['client', 'stylist', 'admin'], 
    default: 'client' 
  },
  preferences: {
    // Client specific: notes regarding hair type
  },
  schedule: {
    // Staff specific: working days/hours
  }
}, { timestamps: true });
```

---

_This document outlines the architectural intent of the Solange platform's authorization system and serves as a blueprint for implementing further backend modifications._
