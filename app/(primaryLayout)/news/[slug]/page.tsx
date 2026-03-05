import dayjs from 'dayjs';
import { sanitize } from 'isomorphic-dompurify';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';
import getNews from '@/app/_lib/getAllArticles';
import getBanner from '@/app/_lib/getBanner';
import getDetailNews from '@/app/_lib/getDetailNews';
import getLatestNews from '@/app/_lib/getLatestNews';
import getPopulerNews from '@/app/_lib/getPopulerNews';
import terpopulerNews from '@/public/terpopuler_news.png';
import { infoMallInterface } from '@/types/infoMallInterface';
import { NewsArticle } from '@/types/newsInterface';
import HeroImage from '../../_section/heroImage';

interface newsType {
    id: number;
    title: string;
    slug: string;
    image: string;
    content: string;
    meta_description: string;
    created_at: string;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const meta = await getDetailNews(params.slug);
    return {
        title: `${meta.data.title} - ${process.env.MALL_NAME}`,
        description: meta.data.meta_description,
        icons: {
            icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
        },
    };
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
    try {
        const news = await getNews(20);
        return news.data.map((post: newsType) => ({
            slug: post.slug,
        }));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to generate static params for news:', error);
        return []; // Return empty to allow build to continue
    }
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function DetailNews({ params }: { params: { mall: infoMallInterface; slug: string } }) {
    let detailNews: any;
    let populerNews: any;
    let allNews: any;
    let dataBanner: any;

    try {
        [detailNews, populerNews, allNews, dataBanner] = await Promise.all([getDetailNews(params.slug), getPopulerNews(), getNews(), getBanner()]);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error loading data for news ${params.slug}:`, error);
        // Fallback or handle nulls in rendering
        return <div className="pt-32 pb-10 text-center">Data news tidak dapat dimuat saat ini.</div>;
    }

    let sideBarNews = populerNews;
    const { data: banner } = dataBanner;
    if (populerNews.data.length === 0) {
        sideBarNews = await getLatestNews();
    }
    return (
        <div className="lg:pt-[7.9rem] pt-16 pb-5">
            <HeroImage banner={banner} />
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 mt-8">
                <div className="col-span-2 px-4 md:px-0 md:ps-8">
                    <div className="text-center">
                        <h1 className="font-bold text-2xl md:text-3xl text-[#29328d]">{detailNews.data.title}</h1>
                        <div className="text-gray-700 text-sm pt-1 py-2">{dayjs(detailNews.data.created_at).format('D MMMM YYYY')}</div>
                        <div>
                            <Image src={detailNews.data.image} alt="thumbnail" height="0" width="0" sizes="100vw" className="w-full h-auto " />
                        </div>
                    </div>
                    <div
                        className="text-sm md:text-base my-5"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: sanitize(detailNews.data.content.replace(/\n/g, '<br />')) }}
                    />
                </div>
                <div>
                    <div className="px-4 md:px-0 md:pe-8">
                        <div className="border-[#29328d] border-2 rounded-3xl p-5">
                            <Image src={terpopulerNews} height="0" width="0" sizes="100vw" className="w-full h-auto" alt="terpopuler news" />
                            <ul className="list-decimal px-5">
                                {sideBarNews?.data.map((news: newsType, index: number) =>
                                    // eslint-disable-next-line no-unused-expressions
                                    index === 0 ? (
                                        <li key={news.id} className="uppercase text-xl font-bold py-2 text-[#29328d]">
                                            <a href={`/news/${news.slug}`}>{news.title}</a>
                                        </li>
                                    ) : (
                                        <li key={news.id} className="uppercase text-lg border-t py-2 text-[#29328d] border-[#29328d]">
                                            <a href={`/news/${news.slug}`}>{news.title}</a>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div
                            className="md:rounded-l-3xl shadow-md p-8 text-white"
                            style={{ backgroundColor: `#${process.env.NEXT_PUBLIC_MALL_COLOR}` }}
                        >
                            <div className="lg:min-h-full lg:max-h-[450px] md:overflow-y-auto custom-scrollbar p-4">
                                {allNews.data.map((item: NewsArticle) => (
                                    <div className="py-2" key={item.id}>
                                        <p className="text-xl md:text-2xl font-bold">{item.title}</p>
                                        <p className="text-md">{item.meta_description}</p>
                                        <div className="bg-white px-3 py-1.5 w-fit text-xs text-black rounded-full my-3 font-medium cursor-pointer">
                                            <a href={`/news/${item.slug}`}>Read More</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
