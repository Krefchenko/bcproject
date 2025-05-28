'use client';

import { useRouter } from 'next/navigation';

type Props = {
	storeName: string;
};

// this function is called in the page file
// after it's called there we get 'props' back - https://react.dev/learn/passing-props-to-a-component
export default function DashboardClient(props: Props) {
	const router = useRouter();
	const storeName = props.storeName;

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Connected to store: {storeName}</p>
			<button onClick={() => router.push('/products')}>Go to products section</button>
			<button onClick={() => router.push('/customers')}>Go to customers section</button>
			<button onClick={() => router.push('/analytics')}>Go to analytics section</button>
		</div>
	);
}