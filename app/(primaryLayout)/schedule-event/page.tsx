import React from 'react';
import getBanner from '@/app/_lib/getBanner';
import getEvents from '@/app/_lib/getEvents';
// import getLatestNews from '@/app/_lib/getLatestNews';
import { infoMallInterface } from '@/types/infoMallInterface';
import HeroImage from '../_section/heroImage';
import ListNews from './_section/ListNews';
import TopThree from './_section/TopThree';

export const metadata = {
    title: `Schedule Event - ${process.env.MALL_NAME}`,
    icons: {
        icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
    },
};

// eslint-disable-next-line no-unused-vars
export default function Schedule({ params }: { params: { mall: infoMallInterface; slug: string } }) {
    const [
        allEvents,
        // populerNews,
        // allNews,
        dataBanner,
    ] = React.use(Promise.all([getEvents(), getBanner()]));
    // let sideBarNews = populerNews;
    const { data: banner } = dataBanner;
    // if (populerNews.data.length === 0) {
    //     sideBarNews = React.use(getLatestNews());
    // }

    return (
        <div className="lg:pt-[7.9rem] pt-16 pb-5">
            <HeroImage banner={banner} />
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-8 mt-8">
                <div className="col-span-4">
                    <div className="pb-8 ps-4 md:ps-8 pe-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <TopThree data={allEvents.data} />
                        </div>
                    </div>
                    <div className="w-48 border-t-[#29328d] border-t-8" />
                    <div className="border-t-2 pt-4 ps-8 pe-4" style={{ borderTopColor: `#${process.env.NEXT_PUBLIC_MALL_COLOR}` }} />
                    <ListNews data={allEvents.data} />
                </div>
                {/* <Sidebar sideBarNews={sideBarNews} allNews={allNews} /> */}
            </div>
        </div>
    );
}
