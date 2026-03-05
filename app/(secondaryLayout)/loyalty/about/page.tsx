import { sanitize } from 'isomorphic-dompurify';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import getDataLoyalty from '@/app/_lib/getDataLoyalty';

export async function generateMetadata(): Promise<Metadata> {
    try {
        const loyalty = await getDataLoyalty();
        const meta = loyalty?.data?.[0];
        if (!meta) throw new Error('No loyalty data available');
        return {
            title: `${meta.segment} - ${process.env.MALL_NAME}`,
            description: meta.meta_description,
            icons: {
                icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
            },
        };
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Loyalty About metadata fetch error:', error);
        return {
            title: `Loyalty - ${process.env.MALL_NAME}`,
            description: '',
            icons: {
                icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
            },
        };
    }
}

export default async function QcLoyaltyCard() {
    let loyalty: any;
    try {
        loyalty = await getDataLoyalty();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Loyalty About page fetch error:', error);
        loyalty = { data: [{ image: '', title: '', description: '' }] };
    }
    const aboutLoyalty = loyalty?.data?.[0] || { image: '', title: '', description: '' };
    return (
        <div className="lg:pt-[7.9rem] pt-16">
            <section id="hero-image">
                <div className="flex justify-center">
                    <Image src={aboutLoyalty.image} alt="hero image" height="0" width="0" sizes="100vw" className="w-full h-auto" priority />
                </div>
            </section>
            <div className="text-white p-5 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 border-b border-white pb-3">{aboutLoyalty.title}</h1>
                </div>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: sanitize(aboutLoyalty.description) }} />
            </div>
            <div className="py-3 flex justify-center mb-5">
                <Link href="/loyalty/terms-and-conditions" className="bg-white rounded py-1 px-3 text-[#b29130]">
                    Terms & Conditions {process.env.NAME_LOYALTY} App
                </Link>
            </div>
        </div>
    );
}
