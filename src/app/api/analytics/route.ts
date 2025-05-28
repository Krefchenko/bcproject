import { cookies } from 'next/headers';

export async function GET() {
	async function geocodeAddress(address: string) {
        // we're building a URL to get the coordinates of an address, example of a final URL is:
        // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
		const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        
		const res = await fetch(url);
		const data = await res.json();

		if (!data.results || data.results.length === 0) {
            // let's just give the errored out orders coords 0,0 for now
			return [0, 0];
		}

		const location = data.results[0].geometry.location;
		return [location.lat, location.lng];
	}

    const cookieStore = await cookies();
    const storeHash = cookieStore.get('storeHash')!.value;
    const accessToken = cookieStore.get('accessToken')!.value;
	const ordersCall = await fetch(
		`https://api.bigcommerce.com/stores/${storeHash}/v2/orders`,
		{
			headers: {
				'X-Auth-Token': accessToken,
				'Accept': 'application/json',
			},
		}
	);

	const orders = await ordersCall.json();

	const coords = [];
    for (const order of orders) {
        const billing = order.billing_address;
        if (!billing) continue;

        const fullAddress = `${billing.street_1}, ${billing.city}, ${billing.state}, ${billing.zip}, ${billing.country}`;
        const [lat, lng] = await geocodeAddress(fullAddress);

        coords.push({ id: order.id, lat, lng });
    }

	return new Response(JSON.stringify(coords), {
		headers: { 'Content-Type': 'application/json' },
	});
}