import Search from "./search";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 z-100 flex h-fit w-full items-center justify-center mt-3 px-3">
      <Search />
    </nav>
  );
};
