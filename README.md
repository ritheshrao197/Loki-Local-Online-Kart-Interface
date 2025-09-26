# Loki - Local Marketplace Platform

Welcome to Loki, a modern e-commerce platform built with Next.js and Firebase, designed to connect local manufacturers and artisans with buyers. This platform provides a feature-rich environment for sellers to manage their products and for buyers to discover unique, locally-sourced goods.

---

## Key Features

### For Buyers
-   **Personalized Home Page**: Dynamic recommendations based on browsing history, previous orders, and location.
-   **Visual-First Product Listings**: Large, high-quality product images with zoom and gallery swiping. Badges for "Best Seller," "Local Star," and stock status.
-   **Advanced Search & Filtering**: Intuitive search with filters for category, price, and other attributes.
-   **Seamless Cart & Checkout**: A smooth, multi-step checkout process with clear order summaries.
-   **Order Tracking**: Real-time updates on order status from confirmation to delivery.
-   **User Profiles**: Manage personal information, view order history, and saved addresses.

### For Sellers
-   **Dedicated Seller Dashboard**: A central hub to manage products, orders, and content.
-   **AI-Powered Product Management**:
    -   **Description Generation**: Automatically create compelling product descriptions from keywords.
    -   **Image-Based Categorization**: Get automatic category suggestions by uploading a product photo.
-   **Full E-commerce Workflow**:
    -   **Product Management**: Add, edit, and manage product listings with detailed fields.
    -   **Inventory Control**: Track stock levels and set low-stock alerts.
    -   **Order Management**: View and update the status of incoming orders.
-   **Content Management System**:
    -   **Blog Creation**: Write and publish blog posts to engage with customers and tell your brand's story.

### For Admins
-   **Comprehensive Admin Panel**: A powerful interface for platform oversight and management.
-   **AI-Assisted Moderation**:
    -   **Product Review**: Automatically flag listings that may violate platform policies, with AI-generated summaries for quick review.
-   **Seller Management**:
    -   **Onboarding**: Approve, reject, or suspend seller accounts.
    -   **Commission Control**: Set and manage commission rates on a per-seller basis or using tiered slabs.
-   **Content & Product Moderation**:
    -   Review and approve/reject new products and blog posts submitted by sellers.
-   **Homepage Content Management**:
    -   **Hero Slider**: Manage the main carousel slides.
    -   **Banner Ads**: Control promotional banners across the homepage.

---

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) components.
-   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) for real-time data storage.
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) (Phone & Admin/Seller login).
-   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (Google's GenAI toolkit).
-   **Deployment**: Configured for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).

---

## Getting Started

### Prerequisites

-   Node.js (v20 or later)
-   npm or yarn

### Running the Development Server

1.  **Install Dependencies**:
    Open your terminal and run the following command to install the necessary packages:
    ```bash
    npm install
    ```

2.  **Start the Next.js App**:
    This command starts the main web application.
    ```bash
    npm run dev
    ```
    Your application will be available at [http://localhost:9002](http://localhost:9002).

3.  **Start the Genkit AI Server** (in a separate terminal):
    This command starts the local server that runs your AI flows. The app will function without it, but AI features will not work.
    ```bash
    npm run genkit:dev
    ```

### Seeding the Database (Optional)

To quickly populate your Firestore database with mock data for testing, navigate to `http://localhost:9002/dev/seed-db` in your browser and click the "Clear and Seed Database" button. This will populate the `products`, `sellers`, and `orders` collections.

---

## Login Credentials for Testing

-   **Buyer Login**: Use any 10-digit mobile number. You'll receive a mock OTP in the browser console.
-   **Admin Login**:
    -   Go to the [Seller/Admin Login page](/login/admin).
    -   Username: `admin`
    -   Password: (can be left blank)
-   **Seller Login**:
    -   Go to the [Seller/Admin Login page](/login/admin).
    -   Username: Use a seller ID from the mock data (e.g., `seller_1`, `seller_2`).
    -   Password: (can be left blank)

---

## Project Structure

-   `src/app/`: Main application routes (App Router).
-   `src/app/(main)/`: Routes for the main user-facing site (homepage, product pages, etc.).
-   `src/app/(auth)/`: Authentication-related routes (login, signup).
-   `src/app/admin/`: Routes for the Admin Dashboard.
-   `src/app/dashboard/[sellerId]/`: Routes for the Seller Dashboard.
-   `src/components/`: Reusable React components.
-   `src/ai/`: Contains all Genkit-related code.
-   `src/ai/flows/`: Individual AI flow definitions.
-   `src/lib/`: Utility functions and shared logic.
-   `src/lib/firebase/`: Firebase configuration and Firestore interaction functions.
-   `public/`: Static assets like images and fonts.
