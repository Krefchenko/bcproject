import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    const limit = 10;

    // turning req.url into a URL object lets us query parameters
    const fullUrl = new URL(req.url);
    const pageParam = fullUrl.searchParams.get('page');

    // set page to 1 if no parameter was passed
    let page;
    if (pageParam) {
        page = Number(pageParam);
    } else {
        page = 1;
    }

    const cookieStore = await cookies();
    const storeHash = cookieStore.get('storeHash')!.value;
    const accessToken = cookieStore.get('accessToken')!.value;

    const productsUrl = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products?page=${page}&limit=${limit}`;

    try {
        const response = await fetch(productsUrl, {
            headers: {
                'X-Auth-Token': accessToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Request failed' },
                { status: 500 }
            );
        }

        const data = await response.json();

        const products = data.data;
        //const totalCount = data.meta.pagination.total;
        const totalPages = data.meta.pagination.total_pages;

        return NextResponse.json({
            products: products,
            totalPages: totalPages
        });

    } catch (error) {
        // catch unexpected errors
        console.error('Error fetching products:', error);

        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}