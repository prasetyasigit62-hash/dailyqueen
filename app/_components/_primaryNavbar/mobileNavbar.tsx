/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unescaped-entities */

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

function mobileNavbar(props: mobileNavbarProps) {
    const { logo, playstore, appstore } = props;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (sectionId: string): void => {
        setIsOpen(false);
        const section = document.getElementById(sectionId);
        // eslint-disable-next-line no-restricted-globals
        if (location.pathname === '/') {
            if (section) {
                const position = section.getBoundingClientRect().top + window.pageYOffset - 70;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        } else {
            window.location.href = `/#${sectionId}`;
        }
    };
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <div className="flex navbar w-screen bg-white sticky top-0">
                {/* Off-canvas button */}
                <div className="w-full flex bg-white justify-between p-4">
                    <div className="flex justify-center">
                        <Image src={logo} width={140} height="0" className="h-auto" alt="Queen City" priority />
                    </div>
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button className="flex items-center justify-center w-6 h-6 text-gray-800" onClick={toggleMenu}>
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Overlay */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            </div>
            {/* Off-canvas menu */}
            <div
                className={`fixed top-0 right-0 z-[50] w-full h-full bg-white transition-transform duration-300 ease-in-out transform overflow-x-hidden overflow-hidden ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Menu content */}
                <div className="flex w-full justify-between p-4">
                    <div className="flex justify-center">
                        <Link href="/">
                            <Image src={logo} className="h-auto" width={140} height={40} alt="Queen City" priority />
                        </Link>
                    </div>
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button className="flex items-center justify-center w-6 h-6 text-gray-800" onClick={toggleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="py-4 relative h-screen w-screen">
                    <ul className="space-y-2 px-4">
                        <li className="border-b pb-3">
                            <a href="/" className="text-[#29328d] hover:text-indigo-500 font-bold text-sm">
                                Home
                            </a>
                        </li>
                        <li className="border-b pb-3">
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                            <span
                                onClick={() => scrollToSection('mall-directory')}
                                className="text-[#29328d] hover:text-indigo-500 font-bold text-sm"
                            >
                                Mall Directory
                            </span>
                        </li>
                        <li className="border-b pb-3">
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                            <span onClick={() => scrollToSection('qc-loyalty')} className="text-[#29328d] hover:text-indigo-500 font-bold text-sm">
                                MySRLAND
                            </span>
                        </li>
                        <li className="border-b pb-3">
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                            <a href="/schedule-event" className="text-[#29328d] hover:text-indigo-500 font-bold text-sm">
                                Schedule Event
                            </a>
                        </li>
                        <li className="border-b pb-3">
                            <a href="/news" className="text-[#29328d] hover:text-indigo-500 font-bold text-sm">
                                Article
                            </a>
                        </li>
                        <li className="border-b pb-3">
                            <a href="/about-us" className="text-[#29328d] hover:text-indigo-500 font-bold text-sm">
                                About Us
                            </a>
                        </li>
                        <li className="border-b pb-3">
                            <a href="/maps" className="text-[#29328d] hover:text-indigo-500 font-bold text-sm">
                                Maps
                            </a>
                        </li>
                        <li className="border-b pb-3">
                            <a href="/contact-us" className="text-[#29328d] hover:text-indigo-500 font-bold text-sm">
                                Contact Us
                            </a>
                        </li>
                        <li className="border-b pb-3">
                            <a href="/download" className="text-[#29328d] hover:text-indigo-500 font-bold text-sm">
                                Download
                            </a>
                        </li>
                        <li className="border-b pb-3">
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                            <span onClick={() => scrollToSection('footer')} className="text-[#29328d] hover:text-indigo-500 font-bold text-sm">
                                Operational Hours
                            </span>
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
            {isOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50" onClick={toggleMenu} />}
        </>
    );
}
export default mobileNavbar;
