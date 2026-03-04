import Image from 'next/image';
import React from 'react';

interface heroImageProps {
    image: string;
}
export default function HeroImage(props: heroImageProps) {
    const { image } = props;
    return (
        <section id="hero-image">
            <div className="flex justify-center">
                <Image src={image} alt="hero image" height="0" width="0" sizes="100vw" className="w-full h-auto" priority />
            </div>
        </section>
    );
}
