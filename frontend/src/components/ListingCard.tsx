import { Link } from "react-router-dom";
import type { Listing } from "@/types";
import { formatCurrency } from "@/utils/format";

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const image = listing.images?.[0] ?? "/placeholder.png";
  const priceLabel = formatCurrency(listing.price ?? 0, listing.currency ?? "DH");

  return (
    <article className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <Link to={`/listings/${listing.id}`} className="block">
        <div className="h-48 w-full bg-neutral-100">
          <img
            src={image}
            alt={listing.title}
            className="h-48 w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-neutral-800 truncate">{listing.title}</h3>
          <p className="mt-1 text-sm text-neutral-600">{listing.category}</p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-base font-bold text-brand-600">{priceLabel}</span>
            <span className="text-xs text-neutral-500">{listing.location}</span>
          </div>

          {listing.owner && (
            <p className="mt-2 text-xs text-neutral-500">Vendeur : {listing.owner.name}</p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ListingCard;
// ...existing code...