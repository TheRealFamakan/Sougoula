import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageCircle, Share2 } from "lucide-react";
import { fetchListing } from "@/services/listingService";
import { formatCurrency } from "@/utils/format";
import type { Listing } from "@/types";

const ListingDetailsPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) return;
    console.log("ListingDetailsPage id =", listingId);
    setLoading(true);
    setError(null);

    fetchListing(listingId)
      .then((data) => {
        console.log("fetchListing success:", data);
        setListing(data);
      })
      .catch((err) => {
        console.error("fetchListing error:", err);
        setError("Impossible de charger l'annonce.");
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  useEffect(() => {
    if (!listing) return;
    
    document.title = listing.title;
    document.querySelectorAll('meta[property^="og:"]').forEach(el => el.remove());
    
    const metaTags = [
      { property: "og:title", content: listing.title },
      { property: "og:description", content: listing.description.substring(0, 150) },
      { property: "og:image", content: listing.images?.[0] || "/placeholder.png" },
      { property: "og:url", content: window.location.href },
      { property: "og:type", content: "product" },
    ];
    
    metaTags.forEach(tag => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });
  }, [listing]);

  if (loading) return <div className="p-6">Chargement en cours...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!listing) return <div className="p-6">Annonce introuvable.</div>;

  const mainImage = listing.images?.[0] ?? "/placeholder.png";
  const priceLabel = formatCurrency(listing.price ?? 0, listing.currency ?? "DH");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link to="/" className="text-sm text-neutral-600 hover:underline">Retour à l'accueil</Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <img src={mainImage} alt={listing.title} className="w-full h-80 object-cover rounded-lg" />
          {listing.images && listing.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {listing.images.slice(1, 5).map((img, idx) => (
                <img key={idx} src={img} alt={`${listing.title}-${idx}`} className="h-16 w-16 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-2">{listing.title}</h1>
          <p className="text-xl text-brand-600 font-bold mb-3">{priceLabel}</p>

          <p className="text-sm text-neutral-600 mb-4">{listing.category} • {listing.location}</p>

          <div className="prose max-w-none text-neutral-800 mb-6">
            <p>{listing.description}</p>
          </div>

          {listing.owner && (
            <div className="border-t pt-4">
              <p className="text-sm text-neutral-600">Vendeur : <span className="font-medium">{listing.owner.name}</span></p>
              {listing.owner.whatsappNumber && (
                <div className="mt-4 flex gap-3 flex-col">
                  <a
                    href={`whatsapp://send?phone=${listing.owner.whatsappNumber}&text=${window.location.href}`}
                    className="flex items-center gap-2 rounded-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle size={20} />
                    Contacter le vendeur
                  </a>
                  
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: listing.title,
                          text: `Consultez cette annonce: ${listing.title} - ${listing.price} ${listing.currency}`,
                          url: window.location.href,
                        });
                      }
                    }}
                    className="flex items-center gap-2 rounded-full border-2 border-green-500 hover:bg-green-50 text-green-500 px-6 py-3 font-semibold transition-all"
                  >
                    <Share2 size={20} />
                    Partager l'annonce
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;

