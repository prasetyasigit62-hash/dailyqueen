export default async function getDownload() {
    const res = await fetch(`${process.env.HOST_API}/api/guest/downloadFile/${process.env.MALL_ID}`, { next: { revalidate: 0 } });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    // Recommendation: handle errors
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getDownload');
        throw new Error('Failed to fetch data getDownload');
    }
    return res.json();
}
