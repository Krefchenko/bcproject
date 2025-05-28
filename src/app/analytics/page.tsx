'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

type OrderCoord = {
	id: number;
	lat: number;
	lng: number;
};

export default function OrdersMap() {
	const [orderCoords, setOrderCoords] = useState<OrderCoord[]>([]);

    async function loadCoords() {
            const callRoute = await fetch('/analytics');
            const data = await callRoute.json();
            setOrderCoords(data);
        }

    useEffect(() => {
        loadCoords();
    }, []);

	return (
		<LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY!}>
			<GoogleMap
				mapContainerStyle={{ width: '100vw', height: '100vh' }}
				center={{ lat: 20, lng: 0 }}
				zoom={2}
			>
				{orderCoords.map((order) => (
					<Marker
						key={order.id}
						position={{ lat: order.lat, lng: order.lng }}
					/>
				))}
			</GoogleMap>
		</LoadScript>
	);
}


