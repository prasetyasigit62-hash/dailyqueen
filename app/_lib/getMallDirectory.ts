import fetchWithRetry from './api';

export default async function getMallDirectory() {
    const res = await fetchWithRetry(`${process.env.HOST_API}/api/guest/mallDirectory/${process.env.MALL_ID}`, { next: { revalidate: 0 } });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    // Recommendation: handle errors
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getMallDirectory');
        throw new Error('Failed to fetch data getMallDirectory');
    }
    return res.json();
}
