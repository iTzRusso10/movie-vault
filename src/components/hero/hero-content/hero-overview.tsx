interface HeroOverviewProps {
  overview: string;
}

export const HeroOverview = ({ overview }: HeroOverviewProps) => (
  <p className="hidden max-w-xl font-sans text-sm leading-relaxed text-mv-cream/85 md:block md:text-base">
    {overview}
  </p>
);
