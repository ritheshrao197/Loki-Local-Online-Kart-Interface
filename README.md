# Loki - Local Marketplace Platform

Welcome to Loki, a modern e-commerce platform built with Next.js and Firebase, designed to connect local manufacturers and artisans with buyers. This platform provides a feature-rich environment for sellers to manage their products and for buyers to discover unique, locally-sourced goods.

## Key Features

- **Multi-Tenant Dashboards**: Separate, feature-rich dashboards for Sellers and Admins.
- **AI-Powered Tools**:
  - **Product Description Generation**: Automatically create compelling product descriptions from keywords.
  - **Product Categorization**: Suggest product categories based on images and descriptions.
  - **Admin Review Tools**: AI-assisted review of product listings to flag policy violations.
- **Complete E-commerce Workflow**:
  - Product and inventory management for sellers.
  - Order management for sellers.
  - Blog/content management system for sellers.
  - Secure authentication for buyers and sellers.
- **Administrative Controls**:
  - Seller onboarding and management (approve/reject/suspend).
  - Product moderation and approval workflow.
  - Commission rate management.
  - Homepage content management (hero slider, banner ads).

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) components.
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) for real-time data storage.
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) (Phone & Admin/Seller login).
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (Google's GenAI toolkit).
- **Deployment**: Configured for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting).
- **Language**: [TypeScript](https://www.typescriptlang.org/).

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm or yarn

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

3.  **Start the Genkit AI Server** (in a separate terminal):
    This command starts the local server that runs your AI flows.
    ```bash
    npm run genkit:dev
    ```

4.  **Open the App**:
    Your application should now be running at [http://localhost:9002](http://localhost:9002).

### Seeding the Database (Optional)

To quickly populate your Firestore database with mock data for testing, navigate to `http://localhost:9002/dev/seed-db` in your browser and click the "Clear and Seed Database" button. This will populate the `products`, `sellers`, and `orders` collections.

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
