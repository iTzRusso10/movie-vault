import Search from "./search";

export const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] pointer-events-none">
      <div className="pointer-events-auto mx-3 mt-3 md:mx-6 md:mt-4">
        <div className="relative overflow-hidden rounded-2xl border border-mv-gold/15 bg-mv-deep/75 shadow-marquee backdrop-blur-xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07] animate-mv-shine"
            style={{
              background:
                "linear-gradient(105deg, transparent 0%, var(--color-mv-gold) 45%, transparent 90%)",
            }}
          />
          <Search />
        </div>
      </div>
    </header>
  );
};
