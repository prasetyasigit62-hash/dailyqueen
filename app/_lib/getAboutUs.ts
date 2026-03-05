import fetchWithRetry from './api';

export default async function getAboutUs() {
    const res = await fetchWithRetry(`${process.env.HOST_API}/api/guest/about/${process.env.MALL_ID}`, { next: { revalidate: 0 } });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    // Recommendation: handle errors
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        // eslint-disable-next-line no-console
        console.log('failed getAboutUs');
        throw new Error('Failed to fetch data getAboutUs');
    }
    return res.json();
}
