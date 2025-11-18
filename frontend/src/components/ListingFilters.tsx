import type { ListingFilters } from "@/types";

const categories = [
  "Tous",
  "Électronique",
  "Mode",
  "Maison",
  "Véhicules",
  "Services",
  "Autres",
];

const locations = [
  "Tous",
  "Mali",
  "Maroc",
];

interface Props {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

const ListingFilterBar = ({ filters, onChange }: Props) => {
  const update = (key: keyof ListingFilters, value?: string | number) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="grid gap-4 rounded-3xl border border-neutral-100 bg-white p-5 shadow-card shadow-black/5 md:grid-cols-5">
      <div className="md:col-span-2">
        <label className="text-xs uppercase tracking-wide text-neutral-500">Recherche</label>
        <input
          type="text"
          value={filters.search ?? ""}
          onChange={(event) => update("search", event.target.value)}
          placeholder="Titre, mots-clés..."
          className="mt-1 w-full rounded-2xl border-neutral-200 text-sm shadow-inner focus:border-brand.accent focus:ring-brand.accent"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-neutral-500">
          Catégorie
        </label>
        <select
          value={filters.category ?? "Tous"}
          onChange={(event) =>
            update("category", event.target.value === "Tous" ? undefined : event.target.value)
          }
          className="mt-1 w-full rounded-2xl border-neutral-200 text-sm focus:border-brand.accent focus:ring-brand.accent"
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-neutral-500">Localisation</label>
        <select
          value={filters.location ?? "Tous"}
          onChange={(event) =>
            update("location", event.target.value === "Tous" ? undefined : event.target.value)
          }
          className="mt-1 w-full rounded-2xl border-neutral-200 text-sm focus:border-brand.accent focus:ring-brand.accent"
        >
          {locations.map((location) => (
            <option key={location}>{location}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs uppercase tracking-wide text-neutral-500">
            Prix min
          </label>
          <input
            type="number"
            min={0}
            value={filters.minPrice ?? ""}
            onChange={(event) =>
              update("minPrice", event.target.value ? Number(event.target.value) : undefined)
            }
            className="mt-1 w-full rounded-2xl border-neutral-200 text-sm shadow-inner focus:border-brand.accent focus:ring-brand.accent"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-neutral-500">
            Prix max
          </label>
          <input
            type="number"
            min={0}
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              update("maxPrice", event.target.value ? Number(event.target.value) : undefined)
            }
            className="mt-1 w-full rounded-2xl border-neutral-200 text-sm shadow-inner focus:border-brand.accent focus:ring-brand.accent"
          />
        </div>
      </div>
    </div>
  );
};

export default ListingFilterBar;

