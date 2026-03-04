/* eslint-disable @next/next/no-img-element */

'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Keyboard } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import ImagelatestNews from '../../../public/latest_news.png';
import { LatestNewsArticle } from '@/types/latestNewsInterface';
import { NewsArticle } from '@/types/newsInterface';

type propsInterface = {
    latestNews: LatestNewsArticle[];
    news: NewsArticle[];
};

export default function LatestNews({ latestNews, news }: propsInterface) {
    return (
        <section id="latest-news">
            <div className="lg:grid lg:grid-cols-3 2xl:grid-cols-4 gap-12 w-full lg:py-5 px-2 lg:px-0">
                <div className="lg:col-span-2 2xl:col-span-3 text-center">
                    <div className="flex justify-center my-5 lg:my-0">
                        <Image src={ImagelatestNews} alt="latest news" className="lg:w-1/3 w-56" />
                    </div>
                    <div className="2xl:mx-20 xl:mx-20 relative">
                        <Swiper
                            autoplay={{
                                delay: 10000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                200: {
                                    slidesPerView: 1,
                                    spaceBetween: 10,
                                },
                                520: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                                1366: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                                1920: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                },
                            }}
                            keyboard
                            navigation
                            modules={[Autoplay, Pagination, Navigation, Keyboard]}
                            className="bannerArticle"
                        >
                            {latestNews.map((post) => (
                                <SwiperSlide key={post.id}>
                                    <div className="lg:rounded-xl h-full rounded-bl-3xl shadow-md lg:shadow-none lg:border-2 border-gray-300 p-4 my-3 lg:p-8">
                                        <Image src={post.image} alt="latest news" className="w-full h-44" width={0} height={0} sizes="100vw" />
                                        <h3 className="text-lg font-bold text-green-700 text-start my-4">{post.title}</h3>
                                        <p className="text-gray-400 text-start text-sm">{post.meta_description}</p>
                                        <div className="bg-gray-500 px-3 py-1.5 w-fit text-xs text-white rounded-full my-3 cursor-pointer">
                                            Read More
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                <div className="col-span-1 bg-orange-500 lg:min-h-full rounded-l-3xl hidden lg:block shadow-md p-12 lg:max-h-32 text-white">
                    <div className="custom-scrollbar overflow-y-auto max-h-full">
                        {news.map((item) => (
                            <div>
                                <p className="text-xl font-bold">{item.title}</p>
                                <p className="text-md">{item.meta_description}</p>
                                <div className="bg-white px-3 py-1.5 w-fit text-xs text-black rounded-full my-3 font-medium cursor-pointer">
                                    Read More
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="2xl:mx-20 xl:mx-20 relative lg:hidden my-7">
                    <h3 className="text-xl text-center font-bold mb-10 text-[#29328d] "> Get More Points</h3>
                    <div className="border rounded-bl-3xl p-4 shadow-md my-3">
                        <p className="text-xl font-bold">Get More Points</p>
                        <p className="text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                        <div className="bg-gray-500 px-3 py-1.5 w-fit text-xs text-white rounded-full my-3 font-medium cursor-pointer">Read More</div>
                    </div>
                    <div className="border rounded-bl-3xl p-4 shadow-md my-3">
                        <p className="text-xl font-bold">Get More Points</p>
                        <p className="text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                        <div className="bg-gray-500 px-3 py-1.5 w-fit text-xs text-white rounded-full my-3 font-medium cursor-pointer">Read More</div>
                    </div>
                    <div className="border rounded-bl-3xl p-4 shadow-md my-3">
                        <p className="text-xl font-bold">Get More Points</p>
                        <p className="text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                        <div className="bg-gray-500 px-3 py-1.5 w-fit text-xs text-white rounded-full my-3 font-medium cursor-pointer">Read More</div>
                    </div>
                    <p className="my-2 text-white py-1.5 px-4 rounded-full font-bold cursor-pointer text-xs bg-[#29328d] w-fit">{'More Points ->'}</p>
                </div>
            </div>
        </section>
    );
}
