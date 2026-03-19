type MovieCompanies = Array<{
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}>;

export const HeroProductionInfo = ({
  companies,
}: {
  companies: MovieCompanies;
}) => {
  if (!companies.length) return;

  return (
    <p className="font-sans text-xs leading-relaxed text-mv-cream-muted">
      <span className="font-semibold uppercase tracking-wider text-mv-cream/70">
        Produzione
      </span>{" "}
      <span className="text-mv-cream-muted/90">
        {companies.map((company) => company.name).join(", ")}
      </span>
    </p>
  );
};
