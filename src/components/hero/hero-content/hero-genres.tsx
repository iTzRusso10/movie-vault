interface HeroGenresProps {
  genres: Array<{ id: number; name: string }>;
}

export const HeroGenres = ({ genres }: HeroGenresProps) => (
  <p className="text-xs font-bold">
    {genres.map((genre) => genre.name).join(" • ")}
  </p>
);
