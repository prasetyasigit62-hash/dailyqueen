import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { Cormorant_Garamond as CormorantGaramond, Fraunces, Inter, JetBrains_Mono, Manrope } from 'next/font/google';
import React, { Suspense } from 'react';
import PrimaryNavbar from '@/app/_components/_primaryNavbar';
import CustomFooter from '@/app/_components/customFooter';
import ScrollRestorationReset from '@/app/_components/scrollRestorationReset';
import '@/app/globals.css';
import GoogleAnalytics from '@/components/analytic';
import Maintenance from '@/components/maintenance';
import { infoMallInterface } from '@/types/infoMallInterface';
import getInfoMall from '../_lib/getInfoMall';
import PrimaryLoading from './loading';

const inter = Inter({ subsets: ['latin'] });
const cormorantGaramond = CormorantGaramond({
    subsets: ['latin'],
    variable: '--font-mall-display',
    weight: ['500', '600', '700'],
});
const manrope = Manrope({
    subsets: ['latin'],
    variable: '--font-mall-sans',
    weight: ['400', '500', '600', '700', '800'],
});
const fraunces = Fraunces({
    subsets: ['latin'],
    variable: '--font-floor-banner-display',
    weight: ['300', '400'],
});
const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-floor-banner-mono',
    weight: ['400', '500'],
});

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

export default async function RootLayout({
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
    if (!infoMall || !infoMall.data || infoMall.data.primary_color === '') {
        color = '#29328d';
    } else {
        color = `#${infoMall.data.primary_color}`;
    }

    if (infoMall && infoMall.data) {
        // eslint-disable-next-line no-param-reassign
        params.mall = infoMall.data;
    }
    const tanggalSekarang = new Date();
    const tanggalTarget = new Date(`${process.env.RELEASE_DATE}`);
    const isReleased = tanggalSekarang <= tanggalTarget;
    return (
        <html lang="en" suppressHydrationWarning>
            <head>{isReleased && <meta name="robots" content="noindex" />}</head>
            <body
                className={`${inter.className} ${cormorantGaramond.variable} ${manrope.variable} ${fraunces.variable} ${jetBrainsMono.variable} bg-[#FFFDFA] max-full overflow-x-hidden antialiased z-30`}
            >
                {isReleased ? (
                    <Maintenance />
                ) : (
                    <Suspense>
                        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} /> : null}
                        <ScrollRestorationReset />
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
