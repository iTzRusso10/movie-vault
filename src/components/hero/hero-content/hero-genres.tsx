interface HeroGenresProps {
  genres: Array<{ id: number; name: string }>;
}

export const HeroGenres = ({ genres }: HeroGenresProps) => (
  <p className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.28em] text-mv-cream-muted">
    {genres.map((genre) => genre.name).join(" · ")}
  </p>
);
