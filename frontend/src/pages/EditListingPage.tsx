import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ListingForm, { type ListingFormValues } from "@/components/forms/ListingForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchListing, updateListing } from "@/services/listingService";

const EditListingPage = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: listing, isLoading, error } = useQuery({
    enabled: Boolean(listingId),
    queryKey: ["listing", listingId],
    queryFn: () => fetchListing(listingId!),
  });

  const mutation = useMutation({
    mutationFn: (values: ListingFormValues) => updateListing(listingId!, values),
    onSuccess: () => {
      toast.success("Annonce modifiée avec succès!");
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      navigate("/dashboard", { replace: true });
    },
    onError: () => toast.error("Erreur lors de la modification de l'annonce"),
  });

  if (isLoading) return <LoadingSpinner label="Chargement de l'annonce..." />;
  
  if (error) return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-red-600 text-center">Impossible de charger l'annonce</p>
    </div>
  );
  
  if (!listing) return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-neutral-600 text-center">Annonce introuvable</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand.primary">Modifier l'annonce</h1>
      <div className="mt-8 rounded-[32px] border border-neutral-100 bg-white p-8 shadow-card shadow-black/5">
        <ListingForm
          defaultValues={{
            title: listing.title,
            description: listing.description,
            price: listing.price,
            category: listing.category,
            location: (listing.location as "Mali" | "Maroc") || "Mali",
            images: listing.images,
            currency: listing.currency as "DH" | "FCFA",
          }}
          onSubmit={(values) => mutation.mutate(values)}
          isSubmitting={mutation.isPending}
          submitLabel="Enregistrer les modifications"
        />
      </div>
    </div>
  );
};

export default EditListingPage;

