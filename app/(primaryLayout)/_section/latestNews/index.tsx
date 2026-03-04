/* eslint-disable @next/next/no-img-element */

'use client';

import { LatestNewsArticle } from '@/types/latestNewsInterface';
import { NewsArticle } from '@/types/newsInterface';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import LatestNewsComponent from './latestNews';
import NewsComponent from './news';

type propsInterface = {
    latestNews: LatestNewsArticle[];
    news: NewsArticle[];
};

export default function LatestNews({ latestNews, news }: propsInterface) {
    return (
        <section id="latest-news">
            <div className="lg:grid lg:grid-cols-3 2xl:grid-cols-4 gap-12 w-full lg:py-5 px-2 lg:px-0 mt-4">
                <LatestNewsComponent latestNews={latestNews} />
                <NewsComponent news={news} />
            </div>
        </section>
    );
}
