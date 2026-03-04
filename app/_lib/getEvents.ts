export default async function getEvents(pageSize: number = 10) {
    const res = await fetch(`${process.env.HOST_API}/api/guest/event/${process.env.MALL_ID}?offsite=0&paginate=${pageSize}`, {
        next: { revalidate: 300 },
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    // Recommendation: handle errors
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getEvents');
        throw new Error('Failed to fetch data getEvents');
    }
    return res.json();
}
