import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">404</p>
    <h1 className="mt-4 text-4xl font-semibold text-brand.primary">Page not found</h1>
    <p className="mt-2 text-neutral-500">The page you are looking for does not exist.</p>
    <Link
      to="/"
      className="mt-6 rounded-full bg-brand.primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand.accent"
    >
      Back home
    </Link>
  </div>
);

export default NotFoundPage;

