import { Metadata } from 'next';
import { resolveFaviconPath } from '@/app/_lib/getInfoMall';
import getAboutUs from '@/app/_lib/getAboutUs';
import { infoMallInterface } from '@/types/infoMallInterface';
import AboutUsSection from './_section/aboutUsSection';
import FindUs from './_section/findUs';
import OurServices from './_section/ourServices';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    try {
        const meta = await getAboutUs();
        const about = meta?.data?.about?.[0];
        if (!about) throw new Error('No about data available');
        return {
            title: `About Us - ${about.title} - ${process.env.MALL_NAME}`,
            description: about.meta_description,
            icons: {
                icon: resolveFaviconPath(),
            },
        };
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('About Us metadata fetch error:', error);
        return {
            title: `About Us - ${process.env.MALL_NAME}`,
            description: '',
            icons: {
                icon: resolveFaviconPath(),
            },
        };
    }
}

export default async function AboutUs({ params }: { params: { mall: infoMallInterface } }) {
    const { mall } = params;
    let data: any;

    try {
        const response = await getAboutUs();
        data = response?.data;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('About Us page fetch error:', error);
        data = { about: [{ title: '', description: '', meta_description: '' }], service: [] };
    }

    const { about } = data;
    const services = data?.service || [];
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
