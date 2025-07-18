// components/MotivationCarousel.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";


const quotes = [
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
    },
    {
        text: "Don’t watch the clock; do what it does. Keep going.",
        author: "Sam Levenson",
    },
    {
        text: "Your limitation—it’s only your imagination.",
        author: "Unknown",
    },
];

export default function MotivationCarousel() {
    return (
        <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg min-h-[250px] flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Daily Drive
            </h2>
            <Swiper
                modules={[Autoplay, EffectFade]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                effect="fade"
                speed={1500}
                loop={true}
                className="w-full px-4"
            >
                {quotes.map((quote, index) => (
                    <SwiperSlide key={index}>
                        <div className="text-center px-2">
                            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-100 italic mb-4 leading-relaxed">
                                “{quote.text}”
                            </p>
                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
                                - {quote.author}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
