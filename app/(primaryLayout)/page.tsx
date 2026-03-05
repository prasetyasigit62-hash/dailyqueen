import { Metadata } from 'next';
import { use } from 'react';
import getBanner from '../_lib/getBanner';
import getDataLoyalty from '../_lib/getDataLoyalty';
import getLatestNews from '../_lib/getLatestNews';
import getMallDirectory from '../_lib/getMallDirectory';
import getPopulerNews from '../_lib/getPopulerNews';
import getPromo from '../_lib/getPromo';
import HeroImage from './_section/heroImage';
import LatestNews from './_section/latestNews';
import MallDirectory from './_section/mallDirectory';
import QcLoyalty from './_section/qcLoyalty';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    icons: {
        icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
    },
};

export default async function Home() {
    // Wait for the promises to resolve
    let dataBanner: any;
    let dataPromo: any;
    let dataMallDirectory: any;
    let dataLatestNews: any;
    let dataNews: any;
    let dataLoyalty: any;

    try {
        [dataBanner, dataPromo, dataMallDirectory, dataLatestNews, dataNews, dataLoyalty] = await Promise.all([
            getBanner(),
            getPromo(),
            getMallDirectory(),
            getLatestNews(),
            getPopulerNews(),
            getDataLoyalty(),
        ]);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Home page fetch error:', error);
        dataBanner = { data: [] };
        dataPromo = { data: [] };
        dataMallDirectory = { data: [] };
        dataLatestNews = { data: [] };
        dataNews = { data: [] };
        dataLoyalty = { data: [{ image: '', title: '', description: '' }] };
    }

    const { data: banner } = dataBanner;
    const { data: promo } = dataPromo;
    const { data: mallDirectory } = dataMallDirectory;
    const { data: latestNews } = dataLatestNews;
    const { data: popularNews } = dataNews;
    const aboutLoyalty = dataLoyalty?.data?.[0] || { image: '', title: '', description: '' };
    return (
        <div className="lg:pt-[7.9rem] pt-16">
            <HeroImage banner={banner} />
            <MallDirectory mallDirectory={mallDirectory} />
            <QcLoyalty promo={promo} aboutLoyalty={aboutLoyalty} />
            <LatestNews latestNews={latestNews} news={popularNews} />
        </div>
    );
}
