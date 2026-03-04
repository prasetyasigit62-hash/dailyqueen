'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Playstore from '@/public/play_store.png';
import Appstore from '@/public/app_store.png';

interface mobileNavbarProps {
    logo: string;
    playstore: string;
    appstore: string;
}

function MobileNavbar(props: mobileNavbarProps) {
    const { logo, playstore, appstore } = props;
    // eslint-disable-next-line
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <div className="flex navbar w-screen bg-white sticky top-0">
                {/* Off-canvas button */}
                <div className="w-full flex bg-[#b29130] justify-between p-4">
                    <div className="flex justify-center">
                        <Link href="/">
                            <Image src={logo} width={140} height="0" className="h-auto" alt="Queen City" priority />
                        </Link>
                    </div>
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button className="flex items-center justify-center w-6 h-6 text-white" onClick={toggleMenu}>
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
            {/* Off-canvas menu */}
            <div
                className={`fixed top-0 left-0 z-50 w-72 h-full bg-white transition-transform duration-300 ease-in-out transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Menu content */}
                <div className="flex w-full justify-start p-4 bg-white">
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button className="flex items-center justify-center w-6 h-6 text-gray-800" onClick={toggleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="py-4 relative">
                    <ul className="space-y-2 px-4">
                        <li className="border-b border-[#b29130] pb-3">
                            <Link href="/" className="text-[#b29130] font-semibold text-sm">
                                Home
                            </Link>
                        </li>
                        <li className="border-b pb-3 border-[#b29130]">
                            <Link href="/loyalty/about" className="text-[#b29130] font-semibold text-sm">
                                About {process.env.NEXT_PUBLIC_NAME_LOYALTY} Card
                            </Link>
                        </li>
                        <li className="border-b border-[#b29130] pb-3">
                            <Link href="/loyalty/point-redemption" className="text-[#b29130] font-semibold text-sm">
                                Point Redemption
                            </Link>
                        </li>
                        <li className="border-b border-[#b29130] pb-3">
                            <Link href="/about-us" className="text-[#b29130] font-semibold text-sm">
                                About Us
                            </Link>
                        </li>
                        <li className="border-b border-[#b29130] pb-3">
                            <Link href="/contact-us" className="text-[#b29130] font-semibold text-sm">
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                    <div className="fixed bottom-0 mb-8 w-full px-4">
                        <p className="font-medium text-sm text-gray-400 mb-2">Download our app available on</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-1">
                                <a href={playstore} target="_blank" rel="noreferrer">
                                    <Image src={Playstore} className="h-auto w-full" height="0" width="0" sizes="100vw" alt="Play Store" />
                                </a>
                            </div>
                            <div className="col-span-1">
                                <a href={appstore} target="_blank" rel="noreferrer">
                                    <Image src={Appstore} className="h-auto w-full" height="0" width="0" sizes="100vw" alt="App Store" />
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Overlay */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            {isOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50" onClick={toggleMenu} />}
        </>
    );
}

export default MobileNavbar;
