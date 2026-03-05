import fetchWithRetry from './api';

export default async function getTenant() {
    const res = await fetchWithRetry(`${process.env.HOST_API}/api/guest/PopularTenant/${process.env.MALL_ID}`, { next: { revalidate: 300 } });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    // Recommendation: handle errors
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getTenant');
        throw new Error('Failed to fetch data getTenant');
    }

    return res.json();
}
