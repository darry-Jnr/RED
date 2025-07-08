import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

const dummyNews = [
  {
    id: 1,
    title: "Red launches new freelancer matching system",
    date: "Jul 6, 2025",
    content: "Our new algorithm improves how clients connect with skilled freelancers. Try it now!",
  },
  {
    id: 2,
    title: "Tips for writing better job descriptions",
    date: "Jul 5, 2025",
    content: "Clear and detailed descriptions attract top talent. Here's how to improve yours.",
  },
  {
    id: 3,
    title: "Tips for writing better job descriptions",
    date: "Jul 5, 2025",
    content: "Clear and detailed descriptions attract top talent. Here's how to improve yours.",
  },
];

export default function ClientNewsSection() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 pb-6 bg-white shadow-default rounded-2xl dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Red News
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Updates, announcements & tips for clients
            </p>
          </div>

          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View All
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {dummyNews.map((news) => (
            <div key={news.id} className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{news.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{news.date}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{news.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
