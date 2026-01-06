import Search from "./search";

export const Navbar = () => {
  return (
    <nav className="flex w-full h-fit fixed justify-center top-0 items-center z-50   mt-3">
      <Search />
    </nav>
  );
};
