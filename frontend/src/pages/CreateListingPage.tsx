import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ListingForm, { type ListingFormValues } from "@/components/forms/ListingForm";
import { createListing } from "@/services/listingService";

const CreateListingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ListingFormValues) => createListing(payload),
    onSuccess: () => {
      toast.success("Annonce publiée avec succès!");
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      navigate("/dashboard", { replace: true });
    },
    onError: () => toast.error("Erreur lors de la création de l'annonce"),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand.primary">Créer une annonce</h1>
      <p className="text-neutral-500">Téléchargez jusqu'à 5 photos et décrivez votre produit en détail.</p>
      <div className="mt-8 rounded-[32px] border border-neutral-100 bg-white p-8 shadow-card shadow-black/5">
        <ListingForm onSubmit={(values) => mutation.mutate(values)} isSubmitting={mutation.isPending} />
      </div>
    </div>
  );
};

export default CreateListingPage;

