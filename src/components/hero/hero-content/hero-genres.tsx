interface HeroGenresProps {
  genres: Array<{ id: number; name: string }>;
}

export const HeroGenres = ({ genres }: HeroGenresProps) => (
  <div className="flex flex-wrap gap-1.5">
    {genres.slice(0, 4).map((genre) => (
      <span
        key={genre.id}
        className="rounded-full border border-white/9 bg-white/5 px-2.5 py-0.5 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-mv-cream-muted backdrop-blur-sm"
      >
        {genre.name}
      </span>
    ))}
  </div>
);
