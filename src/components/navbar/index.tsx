import Search from "./search";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 z-[100] flex w-full justify-center px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <Search />
    </nav>
  );
};
