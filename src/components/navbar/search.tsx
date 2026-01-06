import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import logoApp from "../../../public/movie-app-logo.jpeg";

export default function Search() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openInput, setOpenInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openInput]);

  const handleSearch = () => {
    const value = search.trim();
    if (!value) return;

    navigate({
      to: "/film/search",
      search: { query: value },
      replace: false,
    });

    setSearch("");
    setOpenInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") handleClose();
  };

  const handleClose = () => {
    setOpenInput(false);
    setSearch("");
  };

  return (
    <div className="flex w-full justify-center px-4">
      {!openInput ? (
        <div className="flex items-center gap-3 md:gap-5 py-2 px-3 md:px-4 backdrop-blur bg-white/20 hover:bg-white/30 animate-compress mx-auto rounded-lg transition-all duration-300 shadow-lg border border-white/10">
          <Link
            to="/"
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <img
              className="rounded-lg"
              width={32}
              height={32}
              alt="logo-app"
              src={logoApp}
            />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-white text-sm hover:text-purple-300 transition-colors font-medium">
              Film
            </button>
            <button className="text-white text-sm hover:text-purple-300 transition-colors font-medium">
              TV Series
            </button>
            <button className="text-white text-sm hover:text-purple-300 transition-colors font-medium">
              Wishlist
            </button>
          </div>

          <button
            onClick={() => setOpenInput(true)}
            className="p-2 bg-purple-800 hover:bg-purple-700 rounded-lg shadow-lg transition-all active:scale-95"
            aria-label="Apri ricerca"
          >
            <FaSearch className="text-white" size={16} />
          </button>
        </div>
      ) : (
        <div className="relative flex items-center gap-2 w-full max-w-2xl">
          <div className="relative flex-1">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 z-10"
              size={16}
            />
            <input
              ref={inputRef}
              placeholder="Cerca un film..."
              type="text"
              className="w-full h-12 md:h-14 pl-12 pr-4 bg-black/90 text-white rounded-xl outline-none border-2 border-purple-800 focus:border-purple-500 transition-all placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {search.trim() && (
            <button
              onClick={handleSearch}
              className="h-12 md:h-14 px-4 md:px-6 bg-purple-800 hover:bg-purple-700 text-white rounded-xl transition-all active:scale-95 font-semibold"
            >
              Cerca
            </button>
          )}

          <button
            onClick={handleClose}
            className="h-12 md:h-14 w-12 md:w-14 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all active:scale-95"
          >
            <FaTimes size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
