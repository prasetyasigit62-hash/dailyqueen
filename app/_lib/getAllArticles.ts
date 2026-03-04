export default async function getNews(pageSize: number = 10) {
    const res = await fetch(`${process.env.HOST_API}/api/guest/news/${process.env.MALL_ID}?offsite=0&paginate=${pageSize}`, {
        next: { revalidate: 300 },
    });
    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.log('failed getNews');
        throw new Error('Failed to fetch data getNews');
    }
    return res.json();
}
