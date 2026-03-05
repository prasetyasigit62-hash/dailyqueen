import Image from 'next/image';
import React from 'react';
import getNews from '@/app/_lib/getAllArticles';
import getBanner from '@/app/_lib/getBanner';
import getLatestNews from '@/app/_lib/getLatestNews';
import getPopulerNews from '@/app/_lib/getPopulerNews';
import Sidebar from '@/components/sidebar';
import srLandNews from '@/public/srlandnews.png';
import { infoMallInterface } from '@/types/infoMallInterface';
import HeroImage from '../_section/heroImage';
import ListNews from './_section/ListNews';
import TopThree from './_section/TopThree';

export const metadata = {
    title: `News - ${process.env.MALL_NAME}`,
    icons: {
        icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
    },
};

// eslint-disable-next-line no-unused-vars
export default async function News() {
    let populerNews: any;
    let allNews: any;
    let dataBanner: any;

    try {
        [populerNews, allNews, dataBanner] = await Promise.all([getPopulerNews(), getNews(), getBanner()]);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('News page fetch error:', error);
        populerNews = { data: [] };
        allNews = { data: [] };
        dataBanner = { data: [] };
    }

    let sideBarNews = populerNews;
    const { data: banner } = dataBanner;
    if (populerNews.data.length === 0) {
        try {
            sideBarNews = await getLatestNews();
        } catch (error) {
            sideBarNews = { data: [] };
        }
    }

    return (
        <div className="lg:pt-[7.9rem] pt-16 pb-5">
            <HeroImage banner={banner} />
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 mt-8">
                <div className="col-span-2">
                    <div className="border-b-2 pb-8 ps-4 md:ps-8 pe-4" style={{ borderBottomColor: `#${process.env.NEXT_PUBLIC_MALL_COLOR}` }}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <TopThree data={allNews.data} />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <div className="px-4 pt-4 flex items-center justify-start">
                                {/* <div className="font-bold text-4xl text-[#29328d]">{process.env.NAME_NEWS}</div> */}
                                <Image src={srLandNews} height="120" width="250" alt="quincy news" />
                            </div>
                            <div className="w-48 h-0 border-b-[#29328d] border-b-8">&nbsp;</div>
                        </div>
                        <div className="w-48 border-t-[#29328d] border-t-8" />
                    </div>
                    <div className="border-t-2 pt-4 ps-8 pe-4" style={{ borderTopColor: `#${process.env.NEXT_PUBLIC_MALL_COLOR}` }} />
                    <ListNews data={allNews.data} />
                </div>
                <Sidebar sideBarNews={sideBarNews} allNews={allNews} />
            </div>
        </div>
    );
}
