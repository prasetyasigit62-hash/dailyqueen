export default async function getBanner() {
    const res = await fetch(`${process.env.HOST_API}/api/guest/banner/${process.env.MALL_ID}`, { next: { revalidate: 300 } });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    // Recommendation: handle errors
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getBanner');
        throw new Error('Failed to fetch data getBanner');
    }

    return res.json();
}
