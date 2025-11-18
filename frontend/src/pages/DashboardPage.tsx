import React, { useEffect, useState } from "react";
import { fetchMyListings, deleteListing } from "@/services/listingService";
import { formatCurrency } from "@/utils/format";
import type { Listing } from "@/types";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import welcomeImg from "@/assets/images/shop.png"; 

const WelcomeDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <img
        src={welcomeImg}
        alt="Tableau de bord"
        className="mx-auto w-80 rounded-2xl shadow-lg"
      />
      <h2 className="mt-6 text-3xl font-bold text-brand.primary">
        Bienvenue sur votre espace vendeur
      </h2>
      <p className="mt-2 max-w-md text-neutral-500">
        Gérez vos annonces, vos produits et vos ventes de façon simple et efficace.
      </p>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyListings();
      setListings(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger vos annonces.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;
    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression de l'annonce.");
    }
  };

  if (loading) return <LoadingSpinner label="Chargement de votre espace..." />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Espace personnel
          </p>
          <h1 className="text-3xl font-semibold text-brand.primary">
            Mes annonces
          </h1>
        </div>
        <Link
          to="/listings/new"
          className="rounded-full bg-brand.primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand.accent"
        >
          Nouvelle annonce
        </Link>
      </div>

      {/* Si aucune annonce */}
      {listings.length === 0 ? (
        <div className="mt-10">
          <WelcomeDashboard />
          <EmptyState
            title="Aucune annonce pour le moment"
            description="Publiez votre première annonce pour commencer à vendre."
            action={
              <Link
                to="/listings/new"
                className="rounded-full bg-brand.primary px-4 py-2 text-sm font-semibold text-white"
              >
                Créer une annonce
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-5 rounded-3xl border border-neutral-100 bg-white p-5 shadow-card shadow-black/5 md:flex-row md:items-center"
            >
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="h-32 w-full rounded-2xl object-cover md:w-48"
              />
              <div className="flex-1">
                <p className="text-sm uppercase tracking-wide text-neutral-400">
                  {listing.category}
                </p>
                <h3 className="text-xl font-semibold text-brand.primary">
                  {listing.title}
                </h3>
                <p className="text-sm text-neutral-500">{listing.location}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-brand.accent">
                  {formatCurrency(listing.price, listing.currency)}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/listings/${listing.id}/edit`}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-brand.primary transition hover:border-brand.accent hover:text-brand.accent"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
