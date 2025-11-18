import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { fetchAllListings, fetchAllUsers, removeListingAsAdmin, removeUser } from "@/services/adminService";
import { formatCurrency } from "@/utils/format";

const AdminPanelPage = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAllUsers,
  });

  const { data: listings = [], isLoading: loadingListings } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: fetchAllListings,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => removeUser(id),
    onSuccess: () => {
      toast.success("Utilisateur supprimé");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const deleteListingMutation = useMutation({
    mutationFn: (id: string) => removeListingAsAdmin(id),
    onSuccess: () => {
      toast.success("Annonce supprimée");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  if (loadingListings || loadingUsers) return <LoadingSpinner label="Chargement des données..." />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        
        {/* Header Section */}
        <motion.header
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">
            Administration
          </p>
          <h1 className="text-4xl font-bold text-white mt-3">Centre de contrôle</h1>
          <p className="text-slate-300 mt-2">Gérez les utilisateurs et les annonces de la plateforme</p>
        </motion.header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm font-semibold text-blue-100">Total utilisateurs</p>
            <p className="text-3xl font-bold mt-2">{users.length}</p>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 text-white shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-semibold text-amber-100">Annonces actives</p>
            <p className="text-3xl font-bold mt-2">{listings.length}</p>
          </motion.div>
        </div>

        {/* Users Table Section */}
        <motion.section
          className="mb-12 rounded-3xl bg-slate-800 border border-slate-700 p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Gestion des utilisateurs</h2>
              <p className="text-slate-400 text-sm mt-1">Surveillance et gestion de tous les comptes</p>
            </div>
            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              {users.length} comptes
            </span>
          </div>

          {users.length === 0 ? (
            <EmptyState title="Aucun utilisateur" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">Nom</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">Email</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">Rôle</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-slate-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.email === 'camarafamakan2@gmail.com' 
                            ? 'bg-red-600/20 text-red-300' 
                            : 'bg-slate-600/50 text-slate-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteUserMutation.mutate(user.id)}
                          disabled={deleteUserMutation.isPending}
                          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-50"
                        >
                          {deleteUserMutation.isPending ? "Suppression..." : "Supprimer"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

        {/* Listings Table Section */}
        <motion.section
          className="rounded-3xl bg-slate-800 border border-slate-700 p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Gestion des annonces</h2>
              <p className="text-slate-400 text-sm mt-1">Modération des annonces de la plateforme</p>
            </div>
            <span className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white">
              {listings.length} annonces
            </span>
          </div>

          {listings.length === 0 ? (
            <EmptyState title="Aucune annonce" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">Titre</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">Vendeur</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300">Prix</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing, index) => (
                    <motion.tr
                      key={listing.id}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 text-white font-medium max-w-xs truncate">{listing.title}</td>
                      <td className="px-6 py-4 text-slate-300">{listing.owner?.name || 'Inconnu'}</td>
                      <td className="px-6 py-4">
                        <span className="text-amber-400 font-semibold">
                          {formatCurrency(listing.price, listing.currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteListingMutation.mutate(listing.id)}
                          disabled={deleteListingMutation.isPending}
                          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-50"
                        >
                          {deleteListingMutation.isPending ? "Suppression..." : "Supprimer"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default AdminPanelPage;