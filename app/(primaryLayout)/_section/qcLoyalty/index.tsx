/* eslint-disable @next/next/no-img-element */

'use client';

import Link from 'next/link';
// import { tenantInterface } from '@/types/tenantInterface';
// eslint-disable-next-line import/order
import Image from 'next/image';
import { promoInterface } from '@/types/promoInterface';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import mysrland from '../../../../public/srland.png';
import PromoComponent from './promo';
// import TenantComponent from './tenant';

type propsInterface = {
    promo: promoInterface[];
    aboutLoyalty: {
        image: string;
    };
};

export default function QcLoyalty({ promo, aboutLoyalty }: propsInterface) {
    return (
        <section id="qc-loyalty" className="h-fit lg:border-b lg:border-black py-12">
            <div className="flex justify-center">
                <Link href="/loyalty" className="justify-center flex mb-3">
                    <Image src={mysrland} className="h-auto w-72" alt="qc-privileges" />
                </Link>
            </div>
            <div>
                <Link href="/loyalty" className="text-blue-500">
                    {aboutLoyalty.image && (
                        <Image src={aboutLoyalty.image} alt="hero image" height={0} width={0} sizes="100vw" className="h-auto w-full" />
                    )}
                </Link>
            </div>
            <div className="w-full container mx-auto">
                <div className="flex items-center justify-center pt-12">
                    <h3 className="text-[#29328d] font-bold text-xl lg:mb-8 mb-10 text-center lg:text-start mb">Promo</h3>
                </div>
                <PromoComponent className="w-full" promo={promo} />
                {/* <TenantComponent className="col-span-7 py-6 lg:py-0 px-2" tenant={tenant} /> */}
            </div>
        </section>
    );
}
