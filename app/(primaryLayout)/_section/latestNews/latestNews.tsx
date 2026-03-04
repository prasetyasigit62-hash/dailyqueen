import Image from 'next/image';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { LatestNewsArticle } from '@/types/latestNewsInterface';
import ImagelatestNews from '../../../../public/latest_news.png';

type propsInterface = {
    latestNews: LatestNewsArticle[];
};

function News({ latestNews }: propsInterface) {
    return (
        <div className="lg:col-span-2 2xl:col-span-3 text-center">
            <div className="flex justify-center my-5 lg:my-0">
                <Image src={ImagelatestNews} alt="latest news" className="lg:w-1/3 w-56" height="0" width="0" sizes="100vw" />
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
                            <div className="rounded-md lg:rounded-xl h-full shadow-md lg:shadow-none lg:border-2 border-gray-300 p-4 my-3 lg:p-8">
                                <Image
                                    src={post.image}
                                    alt="latest news"
                                    className="w-full h-44"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    loading="eager"
                                />
                                <h3 className="text-lg font-bold text-green-700 text-start my-4">{post.title}</h3>
                                <p className="text-gray-400 text-start text-sm">{post.meta_description}</p>
                                <div className="bg-gray-500 px-3 py-1.5 w-fit text-xs text-white rounded-full my-3 cursor-pointer">
                                    <a href={post.sosmed_url} target="_blank" className="" rel="noreferrer">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
export default News;
