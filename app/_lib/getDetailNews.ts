export default async function getDetailNews(slug: string) {
    const res = await fetch(`${process.env.HOST_API}/api/guest/newsDetail/${slug}`, { next: { revalidate: 300 } });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    // Recommendation: handle errors
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getDetailNews');
        throw new Error('Failed to fetch data getDetailNews');
    }
    return res.json();
}
