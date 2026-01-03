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
    <div className="">
      <p className="font-bold text-xs">
        Production:{" "}
        <span className="text-xs font-normal">
          {companies.map((company) => company.name).join(", ")}
        </span>
      </p>
    </div>
  );
};
