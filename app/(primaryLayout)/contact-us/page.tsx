import ContactForm from './_section/contactForm';
import HeroImage from './_section/heroImage';
import { infoMallInterface } from '@/types/infoMallInterface';

export const metadata = {
    title: `Contact Us - ${process.env.MALL_NAME}`,
    icons: {
        icon: `/favicon-${new Date().setHours(0, 0, 0, 0)}.png`,
    },
};

export default function ContactUs({ params }: { params: { mall: infoMallInterface } }) {
    const { mall } = params;
    const identityColor = process.env.NEXT_PUBLIC_MALL_COLOR ? `#${process.env.NEXT_PUBLIC_MALL_COLOR}` : '#f26722';
    return (
        <div className="lg:pt-[7.9rem] pt-16">
            <HeroImage image={mall.gambar_mall} />
            <ContactForm apiUrl={process.env.HOST_API} mallId={process.env.MALL_ID} color={identityColor} />
        </div>
    );
}
