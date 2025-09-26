
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Loki collects, uses, and protects your personal information when you use our local marketplace platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="prose lg:prose-xl max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section>
          <p>
            Welcome to Loki. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </section>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, contact details (email, phone number), shipping address, and payment information when you register, place an order, or interact with our services.
          </p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is used to:
          </p>
          <ul>
            <li>Process transactions and fulfill orders.</li>
            <li>Communicate with you about your account or orders.</li>
            <li>Personalize your experience and provide customer support.</li>
            <li>Improve our platform and services.</li>
            <li>Send you promotional materials, from which you can opt-out at any time.</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell or rent your personal data to third parties. We may share information with:
          </p>
          <ul>
            <li>Sellers to fulfill your orders.</li>
            <li>Payment processors to facilitate payments.</li>
            <li>Service providers who assist us in our operations.</li>
            <li>Law enforcement if required by law.</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You can manage your information through your account settings or by contacting our support team.
          </p>
        </section>

        <section>
          <h2>6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </section>

        <section>
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please <a href="/contact">contact us</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
