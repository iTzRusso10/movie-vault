interface HeroOverviewProps {
  overview: string;
}

export const HeroOverview = ({ overview }: HeroOverviewProps) => (
  <p className="text-sm hidden md:block">{overview}</p>
);
