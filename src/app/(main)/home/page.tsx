import { HomePageClient } from '../HomePageClient';

// This is now a pure Server Component.
// The actual content and client-side logic have been moved to HomePageClient.
export default function HomePage() {
  return <HomePageClient />;
}
