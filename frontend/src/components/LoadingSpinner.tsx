const LoadingSpinner = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-500">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand.accent border-t-transparent" />
    <p className="mt-4 text-sm font-medium">{label}</p>
  </div>
);

export default LoadingSpinner;

