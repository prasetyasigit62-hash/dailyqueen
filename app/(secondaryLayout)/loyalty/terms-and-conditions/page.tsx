import { sanitize } from 'isomorphic-dompurify';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';
import getDataLoyalty from '@/app/_lib/getDataLoyalty';

export async function generateMetadata(): Promise<Metadata> {
    const loyalty = await getDataLoyalty();
    const meta = loyalty.data[1];
    return {
        title: `${meta.segment} - ${process.env.MALL_NAME}`,
        description: meta.meta_description,
        icons: {
            icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
        },
    };
}

export default function TermCondition() {
    const loyalty = React.use(getDataLoyalty());
    const tnc = loyalty.data[1];
    return (
        <div className="lg:pt-[7.9rem] pt-16">
            <section id="hero-image">
                <div className="flex justify-center">
                    <Image src={tnc.image} alt="hero image" height="0" width="0" sizes="100vw" className="w-full h-auto" priority />
                </div>
            </section>
            <div className="text-white p-5">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 border-b border-white pb-3">{tnc.title}</h1>
                </div>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: sanitize(tnc.description) }} />
            </div>
        </div>
    );
}
