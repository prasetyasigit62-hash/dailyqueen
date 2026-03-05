/* eslint-disable camelcase */
import getNews from './_lib/getAllArticles';

interface newsType {
    id: number;
    title: string;
    slug: string;
    image: string;
    content: string;
    meta_description: string;
    created_at: string;
}

export default async function sitemap() {
    const routes = [
        '',
        '/news',
        '/schedule-event',
        '/about-us',
        '/contact-us',
        '/download',
        '/loyalty',
        '/loyalty/about',
        '/loyalty/point-redemption',
        '/loyalty/terms-and-conditions',
    ].map((route) => ({
        url: `${process.env.DOMAIN_URL}${route}`,
        lastModified: new Date().toISOString(),
    }));

    try {
        const response = await getNews(20);
        const data = response?.data || [];
        const news = data.map(({ slug }: newsType) => ({
            url: `${process.env.DOMAIN_URL}/news/${slug}`,
            lastModified: new Date().toISOString(),
        }));
        return [...routes, ...news];
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Sitemap news fetch failed:', error);
        return routes;
    }
}
