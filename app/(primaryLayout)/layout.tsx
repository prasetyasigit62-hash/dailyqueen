import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React, { Suspense } from 'react';
import PrimaryNavbar from '@/app/_components/_primaryNavbar';
import CustomFooter from '@/app/_components/customFooter';
import '@/app/globals.css';
import GoogleAnalytics from '@/components/analytic';
import Maintenance from '@/components/maintenance';
import { infoMallInterface } from '@/types/infoMallInterface';
import getInfoMall from '../_lib/getInfoMall';
import PrimaryLoading from './loading';

const inter = Inter({ subsets: ['latin'] });

export interface mall {
    mall: infoMallInterface;
}

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getInfoMall();
    return {
        description: meta.data.meta_description,
        title: meta.data.nama_mall,
    };
}

export default function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        mall: mall;
    };
}) {
    let infoMall: any;
    try {
        infoMall = React.use(getInfoMall());
    } catch (error) {
        console.error('Layout fetch error:', error);
        infoMall = {
            data: {
                id: Number(process.env.MALL_ID) || 3,
                nama_mall: process.env.MALL_NAME || 'Lawu Plaza',
                meta_description: `${process.env.MALL_NAME || 'Lawu Plaza'} Madiun`,
                primary_color: '29328d',
                secondary_color: '0d3c4c',
            },
        };
    }

    let color = '';
    if (!infoMall.data.primary_color) {
        color = '#29328d';
    } else {
        color = `#${infoMall.data.primary_color}`;
    }
    // eslint-disable-next-line no-param-reassign
    params.mall = infoMall.data;
    const tanggalSekarang = new Date();
    const tanggalTarget = new Date(`${process.env.RELEASE_DATE}`);
    const isReleased = tanggalSekarang <= tanggalTarget;
    return (
        <html lang="en" suppressHydrationWarning>
            <head>{isReleased && <meta name="robots" content="noindex" />}</head>
            <body className={`${inter.className} bg-[#FFFDFA] max-full overflow-x-hidden antialiased z-30`}>
                {isReleased ? (
                    <Maintenance />
                ) : (
                    <Suspense>
                        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} /> : null}
                        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                        <PrimaryNavbar {...infoMall.data} />
                        <React.Suspense fallback={<PrimaryLoading />}>{children}</React.Suspense>
                        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                        <CustomFooter {...infoMall.data} color={color} />
                        <SpeedInsights />
                    </Suspense>
                )}
            </body>
        </html>
    );
}
