import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import getDataLoyalty from '@/app/_lib/getDataLoyalty';
import getPromo from '@/app/_lib/getPromo';
import getTenant from '@/app/_lib/getTenant';
import 'swiper/css';
import 'swiper/css/pagination';
import Promo from './_section/promo';
import Tenant from './_section/tenant';

export const metadata = {
    title: process.env.NAME_LOYALTY,
    icons: {
        icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
    },
};

export default async function Loyalty() {
    let dataTenant: any;
    let dataPromo: any;
    let dataLoyalty: any;

    try {
        [dataTenant, dataPromo, dataLoyalty] = await Promise.all([getTenant(), getPromo(), getDataLoyalty()]);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Loyalty page fetch error:', error);
        dataTenant = { data: [] };
        dataPromo = { data: [] };
        dataLoyalty = { data: [{ image: '', title: '', description: '' }] };
    }

    const aboutLoyalty = dataLoyalty?.data?.[0] || { image: '', title: '', description: '' };
    const tenant = dataTenant?.data || [];
    const promo = dataPromo?.data || [];
    return (
        <div className="lg:pt-[7.9rem] pt-16">
            <section id="hero-image">
                <div className="flex justify-center">
                    <Image src={aboutLoyalty.image} alt="hero image" height="0" width="0" sizes="100vw" className="w-full h-auto" priority />
                </div>
            </section>
            <div className="w-full">
                <Suspense fallback={<p>loading</p>}>
                    <Tenant tenant={tenant} />
                    <Promo promo={promo} />
                </Suspense>
            </div>
            <div className="py-3 flex justify-center mb-5">
                <Link href="/loyalty/terms-and-conditions" className="bg-white rounded py-1 px-3 text-[#b29130]">
                    Terms & Conditions QC Loyalty App
                </Link>
            </div>
        </div>
    );
}
