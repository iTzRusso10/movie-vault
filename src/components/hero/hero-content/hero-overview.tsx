interface HeroOverviewProps {
  overview: string;
}

export const HeroOverview = ({ overview }: HeroOverviewProps) => (
  <p className="text-md hidden md:block">{overview}</p>
);
