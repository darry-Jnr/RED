import { useEffect, useState } from "react";

const quotes = [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Your limitation—it’s only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Les Brown" },
    { text: "Great things never come from comfort zones.", author: "Roy T. Bennett" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Success doesn’t just find you. You have to go out and get it.", author: "Marva Collins" },
    { text: "The harder you work for something, the greater you’ll feel when you achieve it.", author: "Unknown" },
    { text: "Don’t stop when you’re tired. Stop when you’re done.", author: "Marilyn Monroe" },
    { text: "Wake up with determination. Go to bed with satisfaction.", author: "George Lorimer" },
    { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
    { text: "Little things make big days.", author: "Isabel Marant" },
    { text: "It’s going to be hard, but hard does not mean impossible.", author: "Art Williams" },
    { text: "Don’t wait for opportunity. Create it.", author: "George Bernard Shaw" },
    { text: "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
    { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown" },
    { text: "Dream bigger. Do bigger.", author: "Robin Sharma" },
    { text: "Don’t limit your challenges. Challenge your limits.", author: "Jerry Dunn" },
    { text: "Stay positive. Work hard. Make it happen.", author: "Unknown" },
];

export default function MotivationCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Start fade out
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % quotes.length);
                setFade(true); // Start fade in
            }, 2000); // Allow time for fade out before switching (2s)
        }, 10000); // Switch quote every 10 seconds
        return () => clearInterval(interval);
    }, []);


    const { text, author } = quotes[currentIndex];

    return (
        <div className="w-full p-6 bg-gradient-to-br from-white via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl min-h-[280px] flex flex-col justify-center items-center transition-all duration-500">
            <h2 className="text-3xl font-extrabold mb-6 text-indigo-600 dark:text-indigo-300 tracking-tight">
                ✨ Daily Drive
            </h2>

            <div
                className={`transition-opacity duration-500 ease-in-out ${fade ? "opacity-100" : "opacity-0"
                    } text-center px-4`}
            >
                <p className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-semibold italic mb-4 leading-snug drop-shadow-md transition duration-300">
                    “{text}”
                </p>
                <p className="text-sm md:text-base text-indigo-500 dark:text-indigo-300 font-medium tracking-wide">
                    — {author}
                </p>
            </div>
        </div>
    );
}
