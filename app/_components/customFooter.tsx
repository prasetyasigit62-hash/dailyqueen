'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import appstore from '@/public/app_store.png';
import playstore from '@/public/play_store.png';
import fallbackLogo from '@/public/logo_queencity_white.png';
import { infoMallInterface } from '@/types/infoMallInterface';

interface propsColor extends infoMallInterface {
    color: string;
}
function CustomFooter(props: propsColor) {
    // eslint-disable-next-line camelcase
    const { color, logo_footer, mall_hours, facebook, instagram, twitter, tiktok, whatsapp, youtube, email, play_store, app_store } = props;
    const [background, setBackground] = useState(color);
    const pathname = usePathname();
    useEffect(() => {
        setBackground(color);
    }, [color, background]);

    if (pathname === '/maps') return null;

    return (
        <section id="footer" className="grid grid-cols-1 md:grid-cols-2 gap-4 md:py-6 pt-6" style={{ backgroundColor: background }}>
            <div className="text-white text-center">
                <div className="flex justify-center px-3">
                    <div className="w-[500px] h-auto">
                        {/* eslint-disable-next-line camelcase */}
                        <Image alt="queen city footer" src={logo_footer || fallbackLogo} width="0" height="0" sizes="100vw" className="w-full h-auto" />
                    </div>
                </div>
                <div className="mt-8 text-sm md:text-base">
                    <strong>Mall Hours : </strong>
                    {/* eslint-disable-next-line camelcase */}
                    <span className="font-light">{mall_hours}</span>
                </div>
                <div className="flex justify-center space-x-6 items-center p-5">
                    {facebook && (
                        <a href={facebook} title="facebook" target="_blank" rel="noreferrer">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 text-white" viewBox="0 0 448 512">
                                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                                </svg>
                            </div>
                        </a>
                    )}
                    {instagram && (
                        <a href={instagram} title="instagram" target="_blank" rel="noreferrer">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 text-white" viewBox="0 0 448 512">
                                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                </svg>
                            </div>
                        </a>
                    )}
                    {twitter && (
                        <a href={twitter} title="twitter" target="_blank" rel="noreferrer">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 text-white" viewBox="0 0 448 512">
                                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                                </svg>
                            </div>
                        </a>
                    )}
                    {tiktok && (
                        <a href={tiktok} title="tiktok" target="_blank" rel="noreferrer">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 text-white" viewBox="0 0 448 512">
                                    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                                </svg>
                            </div>
                        </a>
                    )}
                    {whatsapp && (
                        <a href={`https://api.whatsapp.com/send?phone=${whatsapp}`} title="whatsapp" target="_blank" rel="noreferrer">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 text-white" viewBox="0 0 448 512">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                </svg>
                            </div>
                        </a>
                    )}
                    {youtube && (
                        <a href={youtube} title="youtube" target="_blank" rel="noreferrer">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 text-white" viewBox="0 0 576 512">
                                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                                </svg>
                            </div>
                        </a>
                    )}
                    {email && (
                        <a href={email} title="email" target="_blank" rel="noreferrer">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 text-white" viewBox="0 0 512 512">
                                    <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                                </svg>
                            </div>
                        </a>
                    )}
                    {/* eslint-disable-next-line camelcase */}
                    {play_store && (
                        // eslint-disable-next-line camelcase
                        <a href={play_store} title="playstore" target="_blank" rel="noreferrer">
                            <div className="w-20 h-auto hidden md:block">
                                <Image alt="playstore" src={playstore} width="0" height="0" sizes="100vw" className="w-full h-auto" />
                            </div>
                        </a>
                    )}
                    {/* eslint-disable-next-line camelcase */}
                    {app_store && (
                        // eslint-disable-next-line camelcase
                        <a href={app_store} title="appstore" target="_blank" rel="noreferrer">
                            <div className="w-20 h-auto hidden md:block">
                                <Image alt="appstore" src={appstore} width="0" height="0" sizes="100vw" className="w-full h-auto" />
                            </div>
                        </a>
                    )}
                </div>
            </div>
            <div className="bg-white p-5 md:rounded-tl-[2.5rem] md:rounded-tr-none rounded-t-[2.5rem]">
                <div>
                    <div className="font-bold flex md:justify-end justify-center">Developed by :</div>
                    <div className="flex md:justify-end justify-center mb-5">
                        <div className="w-[300px] h-auto">
                            <Image alt="appstore" src="/logo_srgroup_2026.png" width="0" height="0" sizes="100vw" className="w-full h-auto" />
                        </div>
                    </div>

                    <div className="flex justify-between text-xs md:text-base space-x-1">
                        <div className="md:text-right">
                            <strong>BUSINESS HOURS:</strong>
                            <p className="leading-tight">
                                Sunday - Monday
                                <br />9 am - 5.30 pm
                            </p>
                        </div>
                        <div className="md:text-right">
                            <strong>BUSINESS TALK:</strong>
                            <p className="leading-tight">
                                (+62-24) 3511 533
                                <br />
                                (+62-24) 3511 532
                            </p>
                        </div>
                        <div className="md:text-right">
                            <strong>LOCATION:</strong>
                            <p className="leading-tight">
                                Jl. Pemuda no 35,
                                <br />
                                Semarang, 50138
                                <br />
                                Central Java, Indonesia
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default CustomFooter;
