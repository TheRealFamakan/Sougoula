import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { fetchSeller } from "@/services/userService";
import ListingCard from "@/components/ListingCard";

const SellerProfilePage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();

  const { data: seller, isLoading } = useQuery({
    enabled: Boolean(sellerId),
    queryKey: ["seller", sellerId],
    queryFn: () => fetchSeller(sellerId!),
  });

  if (isLoading) return <LoadingSpinner label="Loading seller profile..." />;
  if (!seller) return <EmptyState title="Seller not found" />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-[32px] border border-neutral-100 bg-white p-8 shadow-card shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Seller profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-brand.primary">{seller.name}</h1>
        <p className="text-neutral-500">{seller.location ?? "Location not provided"}</p>
        <p className="mt-2 text-sm text-neutral-500">
          WhatsApp: <strong>{seller.whatsappNumber}</strong>
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {seller.listings.length === 0 ? (
          <EmptyState title="No listings" description="This seller has not published anything yet." />
        ) : (
          seller.listings.map((listing) => (
            <ListingCard key={listing.id} listing={{ ...listing, owner: seller }} />
          ))
        )}
      </div>
    </div>
  );
};

export default SellerProfilePage;

