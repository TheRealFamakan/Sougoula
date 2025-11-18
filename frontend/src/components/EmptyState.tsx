const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-card shadow-black/5">
    <h3 className="text-xl font-semibold text-brand.primary">{title}</h3>
    {description && <p className="mt-2 text-neutral-500">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;

