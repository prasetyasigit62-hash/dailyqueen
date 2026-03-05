import '@/app/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React, { Suspense } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CustomFooter from '@/app/_components/customFooter';
import SecondaryNavbar from '@/app/_components/_secondaryNavbar';
import { infoMallInterface } from '@/types/infoMallInterface';
import getInfoMall from '../_lib/getInfoMall';
import SecondaryLoading from './loading';
import GoogleAnalytics from '@/components/analytic';

const inter = Inter({ subsets: ['latin'] });

export interface mall {
    mall: infoMallInterface;
}

export async function generateMetadata(): Promise<Metadata> {
    await getInfoMall();
    return {
        title: `${process.env.NAME_LOYALTY}`,
    };
}

export default async function AlternativeLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        mall: mall;
    };
}) {
    const infoMall = await getInfoMall();

    let color = '';
    if (!infoMall || !infoMall.data || infoMall.data.secondary_color === '') {
        color = '#0d3c4c';
    } else {
        color = `#${infoMall.data.secondary_color}`;
    }

    if (infoMall && infoMall.data) {
        // eslint-disable-next-line no-param-reassign
        params.mall = infoMall.data;
    }

    return (
        <html lang="en">
            <body className={`${inter.className} bg-[#b29130] max-full overflow-x-hidden antialiased z-30`}>
                <Suspense>
                    {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} /> : null}
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <SecondaryNavbar {...infoMall.data} />
                    <React.Suspense fallback={<SecondaryLoading />}>{children}</React.Suspense>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <CustomFooter {...infoMall.data} color={color} />
                    <SpeedInsights />
                </Suspense>
            </body>
        </html>
    );
}
