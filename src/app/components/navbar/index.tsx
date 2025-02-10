import Image from "next/image";
import logoApp from "../../../../public/movie-app-logo.jpeg";
import { FaSearch } from "react-icons/fa";

export const Navbar = () => {
  return (
    <nav className="flex w-full h-fit fixed top-0 items-center z-20  mt-3 ">
      <div className="flex items-center gap-5 py-2 px-3 !backdrop-blur bg-white/30  mx-auto rounded-lg motion-preset-compress">
        <Image
          className="rounded-lg"
          width={32}
          height={32}
          alt="logo-app"
          src={logoApp}
        />
        <p className="text-white text-sm">Film</p>
        <p className="text-white text-sm">Serie TV</p>
        <p className="text-white text-sm">Preferiti</p>
        <div className="p-2 bg-purple-800 rounded-lg shadow-2xl">
          <FaSearch color="white" />
        </div>
      </div>
    </nav>
  );
};
