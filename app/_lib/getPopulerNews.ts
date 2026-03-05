import fetchWithRetry from './api';

export default async function getPopulerNews() {
    const res = await fetchWithRetry(`${process.env.HOST_API}/api/guest/popularNews/${process.env.MALL_ID}`, { next: { revalidate: 300 } });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    // Recommendation: handle errors
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getPopulerNews');
        throw new Error('Failed to fetch data getPopulerNews');
    }
    return res.json();
}
