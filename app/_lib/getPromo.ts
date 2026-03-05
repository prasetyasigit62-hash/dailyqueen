import fetchWithRetry from './api';

export default async function getPromo() {
    const res = await fetchWithRetry(`${process.env.HOST_API}/api/guest/topPromo/${process.env.MALL_ID}`, { next: { revalidate: 300 } });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    // Recommendation: handle errors
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getPromo');
        throw new Error('Failed to fetch data getPromo');
    }
    return res.json();
}
