
import { redirect } from 'next/navigation';

// Redirect root to /home
export default function RootPage() {
  redirect('/home');
}
