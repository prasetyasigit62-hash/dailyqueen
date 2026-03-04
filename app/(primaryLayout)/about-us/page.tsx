import { Metadata } from 'next';
import React from 'react';
import getAboutUs from '@/app/_lib/getAboutUs';
import { infoMallInterface } from '@/types/infoMallInterface';
import AboutUsSection from './_section/aboutUsSection';
import FindUs from './_section/findUs';
import OurServices from './_section/ourServices';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getAboutUs();
    return {
        title: `About Us - ${meta.data.about[0].title} - ${process.env.MALL_NAME}`,
        description: meta.data.about[0].meta_description,
        icons: {
            icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
        },
    };
}

export default function AboutUs({ params }: { params: { mall: infoMallInterface } }) {
    const { mall } = params;
    const { data } = React.use(getAboutUs());
    const { about } = data;
    const services = data.service;
    const identityColor = process.env.NEXT_PUBLIC_MALL_COLOR ? `#${process.env.NEXT_PUBLIC_MALL_COLOR}` : '#f26722';
    return (
        <div className="lg:pt-[7.9rem] pt-16">
            <AboutUsSection about={about} service={[]} color={identityColor} />
            <OurServices service={services} about={[]} color={identityColor} />
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <FindUs {...mall} />
        </div>
    );
}
