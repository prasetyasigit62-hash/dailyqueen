/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unescaped-entities */

'use client';

import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { SVGAttributes, useEffect, useState } from 'react';

interface navbarProps {
    logo: string;
}

function Navbar(props: navbarProps) {
    const { logo } = props;
    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const handleItemClick = (item: any) => {
        if (item !== selectedItem) {
            setSelectedItem(item);
            setIsOpen(true);
        } else {
            setSelectedItem(null);
            setIsOpen(false);
        }
    };
    const scrollToSection = (sectionId: string): void => {
        const section = document.getElementById(sectionId);
        // eslint-disable-next-line no-restricted-globals
        if (location.pathname === '/') {
            if (section) {
                const position = section.getBoundingClientRect().top + window.pageYOffset - 120;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        } else {
            window.location.href = `/#${sectionId}`;
        }
    };

    function Bars3Icon(props: SVGAttributes<SVGElement>) {
        return (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <svg
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                {...props}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" fill="#2596be" />
            </svg>
        );
    }

    useEffect(() => {
        const handleClick = (event: any) => {
            if (!event.target.closest('.menu-item')) {
                setSelectedItem(null);
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [selectedItem]);
    return (
        <div className="navbar w-full bg-white pt-4 z-50">
            <div className="flex justify-center my-2">
                <Image src={logo} className="h-auto" width={220} height="0" alt="Queen City" priority />
            </div>
            <div className="menu container mx-auto">
                <ul className="flex w-full justify-between font-bold items-center">
                    <li className="mx-4 text-lg py-3">
                        <Link href="/" className="text-[#29328d] hover:text-orange-400">
                            Home
                        </Link>
                    </li>
                    <li className="mx-4 text-lg py-3">
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                        <span onClick={() => scrollToSection('mall-directory')} className="text-[#29328d] hover:text-orange-400 cursor-pointer">
                            Mall Directory
                        </span>
                    </li>
                    <li className="mx-4 text-lg py-3">
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                        <span onClick={() => scrollToSection('qc-loyalty')} className="text-[#29328d] cursor-pointer hover:text-orange-400">
                            MySRLAND
                        </span>
                    </li>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, react/jsx-curly-brace-presence */}
                    <li
                        className={`mx-4 px-2 ${
                            selectedItem === 'whatson' ? `bg-[#29328d] rounded-t-xl text-white` : 'text-[#29328d] hover:text-orange-400'
                        } py-3 relative`}
                    >
                        <div className="text-right">
                            <Menu as="div" className="inherit text-left">
                                <Menu.Button onClick={() => handleItemClick('whatson')} className="menu-item text-lg">
                                    What's On
                                </Menu.Button>

                                {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
                                <Transition
                                    show={isOpen && selectedItem === 'whatson'}
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <Menu.Items className="absolute left-[-8px] text-center mt-[0.72rem] w-48 bg-[#536368]/90 origin-top-left rounded-b-xl  shadow-lg focus:outline-none py-3">
                                        <div className="py-1 hover:bg-[#0f2632] w-full">
                                            <Menu.Item>
                                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                                                <a href="/schedule-event" className="text-white text-md uppercase w-full">
                                                    Schedule Event
                                                </a>
                                            </Menu.Item>
                                        </div>
                                        <div className="border-[0.1px] mx-2 border-gray-400 my-1" />
                                        <div className="py-1 hover:bg-[#0f2632] w-full">
                                            <Menu.Item>
                                                <a href="/news" className="text-white text-md uppercase w-full">
                                                    Article
                                                </a>
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </li>
                    <li className="mx-4 text-lg py-3">
                        <a href="/about-us" className="text-[#29328d] hover:text-orange-400">
                            About Us
                        </a>
                    </li>
                    <li className="mx-4 text-lg py-3">
                        <a href="/contact-us" className="text-[#29328d] hover:text-orange-400">
                            Contact Us
                        </a>
                    </li>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, react/jsx-curly-brace-presence */}
                    <li
                        className={`mx-4 px-4 ${
                            selectedItem === 'etc' ? `bg-[#29328d] rounded-t-xl text-white` : 'text-[#29328d] hover:text-orange-400'
                        } py-3 relative menu-item`}
                    >
                        <div className="text-right">
                            <Menu>
                                <div>
                                    <Menu.Button onClick={() => handleItemClick('etc')} className="menu-item">
                                        <Bars3Icon className="w-12 h-6" />
                                    </Menu.Button>
                                </div>
                                {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
                                <>
                                    <Transition
                                        show={isOpen && selectedItem === 'etc'}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-[-16px] text-center mt-3 w-60 bg-[#536368]/90 origin-top-right rounded-b-xl shadow-lgfocus:outline-none py-3">
                                            <div className="py-1 hover:bg-[#0f2632] w-full">
                                                <Menu.Item>
                                                    <a href="/download" className="text-white text-base uppercase w-full">
                                                        Download
                                                    </a>
                                                </Menu.Item>
                                            </div>
                                            <div className="border-[0.1px] mx-2 border-gray-400 my-1" />
                                            <div className="py-1 hover:bg-[#0f2632] w-full">
                                                <Menu.Item>
                                                    <Menu.Button
                                                        onClick={() => scrollToSection('footer')}
                                                        className="menu-item text-lg uppercase w-full"
                                                    >
                                                        Operational Hours
                                                    </Menu.Button>
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </>
                            </Menu>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;
