import Image from 'next/image';
import terpopulerNews from '@/public/terpopuler_news.png';
import { NewsArticle } from '@/types/newsInterface';

type propsInterface = {
    news: NewsArticle[];
};

function News({ news }: propsInterface) {
    return (
        <>
            <div className="col-span-1 bg-white lg:min-h-full rounded-l-3xl hidden lg:block shadow-md px-6 py-2 border-l border-t border-b border-gray-300 text-white">
                <Image src={terpopulerNews} alt="terpopuler-news" sizes="100vw" className="w-full h-auto" />
                <div className="">
                    {news.map((item, index) => (
                        <div key={item.id}>
                            <a
                                href={`/news/${item.slug}`}
                                className={`font-bold ${index === 0 ? 'text-[#29328d] text-2xl' : 'text-[#2A338B] text-xl'}`}
                            >
                                {index + 1}. {item.title}
                            </a>
                            <hr className={`my-3 ${news.length === index + 1 && 'hidden'}`} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="2xl:mx-20 xl:mx-20 relative lg:hidden my-7">
                <div className="flex justify-center">
                    <Image src={terpopulerNews} alt="terpopuler-news" sizes="100vw" className="w-56 h-auto" />
                </div>
                {news.map((item) => (
                    <div className="border rounded-md p-4 shadow-md my-3" key={item.id}>
                        <p className="text-xl font-bold">{item.title}</p>
                        <p className="text-md">{item.meta_description}</p>
                        <div className="bg-gray-500 px-3 py-1.5 w-fit text-xs text-white rounded-full my-3 font-medium cursor-pointer">
                            <a href={`/news/${item.slug}`}>Read More</a>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default News;
