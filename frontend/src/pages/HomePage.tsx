import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ListingFilterBar from "@/components/ListingFilters";
import ListingCard from "@/components/ListingCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { fetchListings } from "@/services/listingService";
import type { ListingFilters as FilterType } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

const HomePage = () => {
  const [filters, setFilters] = useState<FilterType>({});
  const debouncedFilters = useDebounce(filters, 400);

  const {
    data: listings = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["listings", debouncedFilters],
    queryFn: () => fetchListings(debouncedFilters),
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Hero Section */}
        <motion.section
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-4 -top-4 h-48 w-48 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-4 -right-4 h-48 w-48 rounded-full bg-purple-300 blur-3xl" />
          </div>

          <div className="relative px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between gap-8">
              {/* Left Column - Content */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <motion.h1
                  className="text-3xl font-black leading-tight text-white sm:text-4xl"
                >
                  Bienvenue sur{" "}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    SOUGOULA
                  </span>
                </motion.h1>

                <motion.p
                  className="mt-3 max-w-xl text-base leading-relaxed text-blue-50"
                >
                  Créez, gérez et vendez instantanément via WhatsApp.
                </motion.p>

                <motion.div
                  className="mt-5 flex flex-wrap gap-2"
                >
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-md border border-white/20">
                    <span className="text-xs font-semibold text-white">
                      Annonces illimitées
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-md border border-white/20">
                    <span className="text-xs font-semibold text-white">
                      Images de qualité
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-md border border-white/20">
                    <span className="text-xs font-semibold text-white">
                      Sécurisé
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Emoji */}
              <motion.div
                className="flex-shrink-0 hidden md:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="text-9xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🛍️
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Listings Section */}
        <div className="mt-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-slate-900">
              Parcourez les annonces
            </h2>

            <ListingFilterBar filters={filters} onChange={setFilters} />
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-20"
            >
              <LoadingSpinner label="Chargement des annonces..." />
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && listings.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <EmptyState
                title="Aucune annonce disponible"
                description="Ajustez vos filtres ou revenez plus tard pour découvrir de nouvelles offres."
              />
            </motion.div>
          )}

          {/* Listings Grid */}
          {!isLoading && listings.length > 0 && (
            <div className="space-y-4">
              {isFetching && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>Mise à jour en cours...</span>
                </div>
              )}

              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {listings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    variants={itemVariants}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    <ListingCard listing={listing} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;