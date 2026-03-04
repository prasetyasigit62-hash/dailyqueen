/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-no-comment-textnodes */

'use client';

import { Tab } from '@headlessui/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Floor, mallDirectoryInterface } from '@/types/mallDirectoryInterface';
import mallDirectoryImage from '@/public/mall_directory.png';
import DesktopMallDirectory from './desktopMallDirectory';
import MobileMallDirectory from './mobileMallDirectory';
import qCimage from '@/public/qc_fromtop.jpg';

type mallDirectoryProps = {
    mallDirectory: mallDirectoryInterface;
};

export default function MallDirectory({ mallDirectory }: mallDirectoryProps) {
    // eslint-disable-next-line no-unused-vars
    const [tenant, setTenant] = useState(Object.values(mallDirectory)[0][0].tenant as Floor['tenant']);
    function classNames(...classes: any) {
        return classes.filter(Boolean).join(' ');
    }
    return (
        <section id="mall-directory">
            <div className="relative">
                <div className="absolute lg:block hidden w-full h-full -z-20">
                    <Image
                        src={qCimage}
                        width="0"
                        height="0"
                        sizes="100vw"
                        className="top-0 left-0 w-full h-full opacity-7 opacity-30 object-cover"
                        alt="topmall"
                    />
                </div>
                <div className="flex w-full justify-center py-6">
                    <Image src={mallDirectoryImage} className="w-1/2 lg:w-2/12" alt="mall-directory" />
                </div>
                <div className="w-full px-0">
                    <Tab.Group>
                        <Tab.List className="flex space-x-1 bg-black lg:bg-black/70 p-1 overflow-x-auto hide-scrollbar">
                            <div className="lg:container lg:mx-auto flex">
                                {Object.keys(mallDirectory).map((category, index) => (
                                    <Tab
                                        key={category}
                                        onClick={() => setTenant(Object.values(mallDirectory)[index][0]?.tenant)}
                                        className={({ selected }) =>
                                            classNames(
                                                'w-full rounded-lg lg:whitespace-normal whitespace-nowrap py-2.5 lg:text-md text-sm font-medium lg:font-bold lg:text-lg leading-5 text-white mx-3',
                                                'focus:outline-none ',
                                                selected ? 'shadow' : 'hover:text-white'
                                            )
                                        }
                                    >
                                        {category}
                                    </Tab>
                                ))}
                            </div>
                        </Tab.List>
                        <Tab.Panels className="mt-2">
                            <div className="container lg:mx-auto lg:flex">
                                {Object.values(mallDirectory).map((mall, idx) => (
                                    <Tab.Panel
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={idx}
                                        className={classNames('rounded-xl bg-transparent py-3', 'focus:outline-none ')}
                                    >
                                        <>
                                            <DesktopMallDirectory mall={mall} setTenant={setTenant} tenant={tenant} />
                                            <MobileMallDirectory mall={mall} setTenant={setTenant} tenant={tenant} />
                                        </>
                                    </Tab.Panel>
                                ))}
                            </div>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </section>
    );
}
