import { cookies } from 'next/headers';
import DashboardClient from './client';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  // using !.value to assert that these are not undefined to make typescript happy
  const storeHash = cookieStore.get('storeHash')!.value;
  const accessToken = cookieStore.get('accessToken')!.value;
  let storeName = "";

  // Fetch store info
  const storeInfoCall = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v2/store`, {
    headers: {
      'X-Auth-Token': accessToken,
      'Accept': 'application/json',
    }
  });

  if (!storeInfoCall.ok){
    storeName = "Failed to fetch store info"
  }else {
    const storeData = await storeInfoCall.json();
    storeName = storeData.name;
  }


  return <DashboardClient storeName={storeName} />;
}