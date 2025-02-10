interface HeroTitleProps {
  title: string;
  year: number;
}

export const HeroTitle = ({ title, year }: HeroTitleProps) => (
  <>
    <h1 className="truncate !leading-normal text-wrap w-full text-3xl line-clamp-2 md:text-5xl font-extrabold">
      {title}
    </h1>
    <p>{year}</p>
  </>
);
