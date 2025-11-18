import { useRef } from "react";
import { UploadCloud, X } from "lucide-react";

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

const ImageUploader = ({ images, onChange, max = 5 }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = max - images.length;
    const slice = Array.from(files).slice(0, remaining);
    const uploads = await Promise.all(slice.map(toBase64));
    onChange([...images, ...uploads]);
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, idx) => idx !== index);
    onChange(next);
  };

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Images ({images.length}/{max})
      </label>
      <div
        className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 py-8 text-center text-sm text-neutral-500 transition hover:border-brand.accent hover:text-brand.accent"
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud size={22} />
        <div>
          <p className="font-semibold">Upload product photos</p>
          <p className="text-xs text-neutral-400">PNG, JPG, WebP — max 5 images</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, idx) => (
            <div key={image} className="relative overflow-hidden rounded-2xl">
              <img src={image} alt={`Listing ${idx + 1}`} className="h-32 w-full object-cover" />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-neutral-600 shadow"
                onClick={() => removeImage(idx)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

