"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import Image from "next/image";
import logoApp from "../../../public/movie-app-logo.jpeg";
import Link from "next/link";

export default function Search() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [openInput, setOpenInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openInput]);

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/film/search?query=${encodeURIComponent(search.trim())}`, {
      scroll: true,
    });
    setSearch("");
    setOpenInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setOpenInput(false);
      setSearch("");
    }
  };

  const handleClose = () => {
    setOpenInput(false);
    setSearch("");
  };

  return (
    <div className="flex w-full justify-center px-4">
      {!openInput ? (
        <div className="flex items-center gap-3 md:gap-5 py-2 px-3 md:px-4 !backdrop-blur bg-white/20 hover:bg-white/30 mx-auto rounded-lg motion-preset-compress transition-all duration-300 shadow-lg border border-white/10">
          <Link
            href="/"
            prefetch
            scroll={false}
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <Image
              className="rounded-lg"
              width={32}
              height={32}
              alt="logo-app"
              priority
              src={logoApp}
            />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <button
              className="text-white text-sm hover:text-purple-300 transition-colors duration-200 font-medium"
              aria-label="Film"
            >
              Film
            </button>
            <button
              className="text-white text-sm hover:text-purple-300 transition-colors duration-200 font-medium"
              aria-label="TV Series"
            >
              TV Series
            </button>
            <button
              className="text-white text-sm hover:text-purple-300 transition-colors duration-200 font-medium"
              aria-label="Wishlist"
            >
              Wishlist
            </button>
          </div>

          <button
            onClick={() => setOpenInput(true)}
            className="p-2 bg-purple-800 hover:bg-purple-700 rounded-lg shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
            aria-label="Apri ricerca"
          >
            <FaSearch className="text-white" size={16} />
          </button>
        </div>
      ) : (
        <div className="relative flex items-center gap-2 w-full max-w-2xl motion-preset-slide-down-sm">
          <div className="relative flex-1">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 z-10"
              size={16}
            />
            <input
              ref={inputRef}
              placeholder="Cerca un film..."
              type="text"
              className="w-full h-12 md:h-14 pl-12 pr-4 text-sm md:text-base bg-black/90 backdrop-blur-sm text-white rounded-xl outline-none border-2 border-purple-800 focus:border-purple-500 transition-all duration-200 placeholder:text-gray-400 shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Campo di ricerca film"
            />
          </div>
          {search.trim() && (
            <button
              onClick={handleSearch}
              className="h-12 md:h-14 px-4 md:px-6 text-sm md:text-base bg-purple-800 hover:bg-purple-700 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold whitespace-nowrap active:scale-95"
              aria-label="Cerca"
            >
              Cerca
            </button>
          )}
          <button
            onClick={handleClose}
            className="h-12 md:h-14 w-12 md:w-14 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 active:scale-95 flex-shrink-0"
            aria-label="Chiudi ricerca"
          >
            <FaTimes size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
