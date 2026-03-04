import React from 'react';
import { infoMallInterface } from '@/types/infoMallInterface';

export default function FindUs(props: infoMallInterface) {
    // eslint-disable-next-line camelcase
    const { alamat, telepon, email, nama_mall, kordinat } = props;
    return (
        <section id="find-us">
            <div className="grid grid-cols-1 md:grid-cols-2 px-5 py-8">
                <div className="md:ps-24">
                    <h2 className="font-bold text-[#29328d] text-4xl md:text-5xl">Find Us</h2>
                    <div className="my-5">
                        {/* eslint-disable-next-line camelcase */}
                        <strong>{nama_mall}</strong>
                        {alamat}
                    </div>
                    {/* eslint-disable-next-line camelcase */}
                    <p className="my-5">We are pleased to assist you with all querues about {nama_mall}</p>
                    <div className="my-5">
                        <span className="font-bold text-lg">P</span>: {telepon}
                    </div>
                    <div className="my-5">
                        <span className="font-bold text-lg">E</span>: {email}
                    </div>
                </div>
                <div className="md:pe-24">
                    <iframe
                        title="google maps"
                        src={kordinat}
                        width="100%"
                        height="350"
                        style={{ border: '2px solid #000000' }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </section>
    );
}
