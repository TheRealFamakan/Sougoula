import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchMe, updateProfile } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";

interface SettingsValues {
  name: string;
  whatsappNumber: string;
  location?: string;
  avatarUrl?: string;
}

const SettingsPage = () => {
  const { setUser } = useAuth();
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  const mutation = useMutation({
    mutationFn: (values: SettingsValues) => updateProfile(values),
    onSuccess: (updated) => {
      toast.success("Profile updated");
      setUser(updated);
    },
    onError: () => toast.error("Could not update profile"),
  });

  const { register, handleSubmit, reset } = useForm<SettingsValues>({
    defaultValues: {
      name: "",
      whatsappNumber: "",
      location: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        whatsappNumber: user.whatsappNumber,
        location: user.location ?? "",
        avatarUrl: user.avatarUrl ?? "",
      });
    }
  }, [user, reset]);

  if (isLoading || !user) return <LoadingSpinner label="Loading settings..." />;

  const onSubmit = (values: SettingsValues) => mutation.mutate(values);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-brand.primary">Profile settings</h1>
          <p className="text-neutral-500">Keep your contact information up to date.</p>
        </div>
        <button
          onClick={() =>
            reset({
              name: user.name,
              whatsappNumber: user.whatsappNumber,
              location: user.location ?? "",
              avatarUrl: user.avatarUrl ?? "",
            })
          }
          className="text-sm font-semibold text-neutral-500 hover:text-brand.accent"
        >
          Reset
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5 rounded-[32px] border border-neutral-100 bg-white p-8 shadow-card shadow-black/5"
      >
        <div>
          <label className="text-sm font-semibold text-neutral-600">Name</label>
          <input
            {...register("name")}
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-600">WhatsApp number</label>
          <input
            {...register("whatsappNumber")}
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-600">Location</label>
          <input
            {...register("location")}
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-600">Avatar URL</label>
          <input
            {...register("avatarUrl")}
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus:border-brand.accent focus:ring-brand.accent"
            placeholder="https://"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-full bg-brand.primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand.accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;

