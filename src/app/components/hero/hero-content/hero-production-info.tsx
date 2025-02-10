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
}) => (
  <div>
    <p className="text-sm font-bold">
      Production:{" "}
      <span className="text-sm font-normal">
        {companies.map((company) => company.name).join(", ")}
      </span>
    </p>
  </div>
);
