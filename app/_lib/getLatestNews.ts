export default async function getLatestNews() {
    const res = await fetch(`${process.env.HOST_API}/api/guest/latestNews/${process.env.MALL_ID}`, { next: { revalidate: 300 } });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    // Recommendation: handle errors
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getLatestNews');
        throw new Error('Failed to fetch data getLatestNews');
    }
    return res.json();
}
