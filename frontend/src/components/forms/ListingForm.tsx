import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUploader from "@/components/ImageUploader";

const listingSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  price: z.number().min(1, "Le prix doit être supérieur à zéro"),
  category: z.string().min(2, "Veuillez choisir une catégorie"),
  location: z.enum(["Mali", "Maroc"], "Veuillez choisir Mali ou Maroc"),
  images: z.array(z.string()).min(1, "Au moins une image est requise"),
  currency: z.enum(["DH", "FCFA"] as const, "Veuillez choisir une devise (DH ou FCFA)"),
});

export type ListingFormValues = z.infer<typeof listingSchema>;

interface ListingFormProps {
  defaultValues?: Partial<ListingFormValues>;
  onSubmit: (values: ListingFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const CATEGORIES = [
  "Vêtements",
  "Chaussures",
  "Accessoires",
  "Électronique",
  "Maison",
  "Véhicules",
  "Services",
  "Autre",
];

const LOCATIONS = ["Mali", "Maroc"];

const ListingForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Publier l'annonce",
}: ListingFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      category: defaultValues?.category ?? "",
      location: defaultValues?.location ?? ("Mali" as const),
      images: defaultValues?.images ?? [],
      currency: defaultValues?.currency ?? "DH",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title ?? "",
        description: defaultValues.description ?? "",
        price: defaultValues.price ?? 0,
        category: defaultValues.category ?? "",
        location: defaultValues.location ?? ("Mali" as const),
        images: defaultValues.images ?? [],
        currency: defaultValues.currency ?? "DH",
      });
    }
  }, [defaultValues, reset]);

  const images = watch("images");
  const category = watch("category");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="title" className="text-sm font-semibold text-neutral-600">
            Titre
          </label>
          <input
            id="title"
            {...register("title")}
            placeholder="Que vendez-vous ?"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="text-sm font-semibold text-neutral-600">
            Catégorie
          </label>
          <select
            id="category"
            {...register("category")}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "category-error" : undefined}
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
          >
            <option value="" disabled>
              Sélectionner une catégorie
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p id="category-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.category.message}
            </p>
          )}

          {category === "Autre" && (
            <input
              {...register("category")}
              placeholder="Précisez la catégorie"
              className="mt-3 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
            />
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="price" className="text-sm font-semibold text-neutral-600">
            Prix
          </label>
          <div className="relative mt-2 flex gap-3">
            <input
              id="price"
              type="number"
              min={1}
              {...register("price", { valueAsNumber: true })}
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? "price-error" : undefined}
              placeholder="ex: 5000"
              className="flex-1 rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
            />

            <select
              id="currency"
              {...register("currency")}
              aria-invalid={!!errors.currency}
              aria-describedby={errors.currency ? "currency-error" : undefined}
              className="w-28 rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
            >
              <option value="DH">DH</option>
              <option value="FCFA">FCFA</option>
            </select>
          </div>
          {errors.price && (
            <p id="price-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.price.message}
            </p>
          )}
          {errors.currency && (
            <p id="currency-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.currency.message}
            </p>
          )}
          <p className="mt-1 text-xs text-neutral-500">Saisissez le montant et sélectionnez la devise.</p>
        </div>

        <div>
          <label htmlFor="location" className="text-sm font-semibold text-neutral-600">
            Localisation
          </label>
          <select
            id="location"
            {...register("location")}
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? "location-error" : undefined}
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.location && (
            <p id="location-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-semibold text-neutral-600">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          {...register("description")}
          placeholder="Décrivez votre produit en détail..."
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
          className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-xs text-red-500" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <ImageUploader
        images={images}
        onChange={(next) => setValue("images", next, { shouldValidate: true })}
      />
      {errors.images && (
        <p className="text-xs text-red-500" role="alert" aria-live="polite">
          {errors.images.message}
        </p>
      )}

      <div className="mt-4 mb-6">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-60 z-10"
        >
          {isSubmitting ? "Enregistrement..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;