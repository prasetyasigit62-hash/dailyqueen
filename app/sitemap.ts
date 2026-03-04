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
    const { data } = await getNews(20);
    const news = data.map(({ slug }: newsType) => ({
        url: `${process.env.DOMAIN_URL}/news/${slug}`,
        lastModified: new Date().toISOString(),
    }));
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

    return [...routes, ...news];
    // return [
    //     {
    //         url: 'https://queencity.id',
    //         lastModified: new Date(),
    //     },
    //     {
    //         url: 'https://queencity.id/news',
    //         lastModified: new Date(),
    //     },
    //     {
    //         url: 'https://queencity.id/schedule-event',
    //         lastModified: new Date(),
    //     },
    //     {
    //         url: 'https://queencity.id/about-us',
    //         lastModified: new Date(),
    //     },
    //     {
    //         url: 'https://queencity.id/contact-us',
    //         lastModified: new Date(),
    //     },
    //     {
    //         url: 'https://queencity.id/loyalty',
    //         lastModified: new Date(),
    //     },
    //     {
    //         url: 'https://queencity.id/loyalty/about',
    //         lastModified: new Date(),
    //     },
    //     {
    //         url: 'https://queencity.id/loyalty/terms-and-conditions',
    //         lastModified: new Date(),
    //     },
    //     {
    //         url: 'https://queencity.id/loyalty/point-redemption',
    //         lastModified: new Date(),
    //     },
    // ];
}
