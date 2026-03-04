export default async function getDataLoyalty() {
    const res = await fetch(`${process.env.HOST_API}/api/guest/loyalty/${process.env.MALL_ID}`, { next: { revalidate: 300 } });
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getDataLoyalty');
        throw new Error('Failed to fetch data getDataLoyalty');
    }

    return res.json();
}
