"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDebounceFn } from "crustack/hooks";
import Image from "next/image";
import logoApp from "../../../public/movie-app-logo.jpeg";
import Link from "next/link";

export default function Search() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [openInput, setOpenInput] = useState<boolean>(false);
  const { debounce, cancel } = useDebounceFn(1500);

  useEffect(() => {
    if (!search.length) {
      cancel();
      router.push("/", { scroll: false });
      return;
    }
    debounce(() => {
      router.push(`/film/search?query=${encodeURIComponent(search)}`, {
        scroll: true,
      });
    });

    return () => cancel();
  }, [search, cancel, debounce, router]);

  return (
    <div className="flex w-full justify-center">
      {!openInput ? (
        <div className="flex items-center gap-5 py-2 px-3 !backdrop-blur bg-white/30 mx-auto rounded-lg motion-preset-compress">
          <Link href="/" prefetch scroll={false}>
            <Image
              className="rounded-lg"
              width={32}
              height={32}
              alt="logo-app"
              priority
              src={logoApp}
            />
          </Link>

          <p className="text-white text-sm">Film</p>
          <p className="text-white text-sm">Serie TV</p>
          <p className="text-white text-sm">Preferiti</p>
          <div
            className="p-2 bg-purple-800 rounded-lg shadow-2xl cursor-pointer"
            onClick={() => setOpenInput(true)}
          >
            <FaSearch color="white" />
          </div>
        </div>
      ) : (
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-purple-400" />
          <input
            placeholder="Enter movie name..."
            type="text"
            className="w-[303px] h-[46px] p-2 pl-10 text-sm border-2 bg-black text-white rounded-lg outline-none border-purple-800"
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => setOpenInput(false)}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
