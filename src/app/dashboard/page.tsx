import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const storeHash = cookieStore.get('storeHash')?.value;
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!storeHash || !accessToken) {
    return (
      <div>
        <h1>Not Connected</h1>
        <p>Missing credentials. Please go back and connect first.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Connected to store: {storeHash}</p>
      <p>(Access token is present in cookies)</p>
    </div>
  );
}