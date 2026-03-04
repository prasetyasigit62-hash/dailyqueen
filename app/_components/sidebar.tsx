import Image from 'next/image';
import React from 'react';
import terpopulerNews from '@/public/terpopuler_news.png';
import { NewsArticle } from '@/types/newsInterface';

interface newsType {
    id: number;
    title: string;
    slug: string;
    image: string;
    content: string;
    meta_description: string;
    created_at: string;
}

export default function Sidebar(props: { sideBarNews: any; allNews: any }) {
    const { sideBarNews, allNews } = props;
    return (
        <div>
            <div className="px-4 md:px-0 md:pe-8">
                <div className="border-[#29328d] border-2 rounded-3xl p-5">
                    <Image src={terpopulerNews} height="100" width="320" className="" alt="terpopuler news" />
                    <ul className="list-decimal px-5">
                        {sideBarNews?.data.map((news: newsType, index: number) =>
                            // eslint-disable-next-line no-unused-expressions
                            index === 0 ? (
                                <li key={news.id} className="uppercase text-lg md:text-xl font-bold py-2 text-[#29328d]">
                                    <a href={`/news/${news.slug}`}>{news.title}</a>
                                </li>
                            ) : (
                                <li key={news.id} className="uppercase text-lg md:text-xl border-t py-2 text-[#29328d] border-[#29328d]">
                                    <a href={`/news/${news.slug}`}>{news.title}</a>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </div>
            <div className="mt-8">
                <div className="md:rounded-l-3xl shadow-md p-8 text-white" style={{ backgroundColor: `#${process.env.NEXT_PUBLIC_MALL_COLOR}` }}>
                    <div className="lg:min-h-full lg:max-h-[450px] md:overflow-y-auto custom-scrollbar p-4">
                        {allNews.data.map((item: NewsArticle) => (
                            <div className="py-2">
                                <p className="text-lg md:text-xl font-bold">{item.title}</p>
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
    );
}
