const Footer = () => (
  <footer className="border-t border-neutral-100 bg-gradient-to-r from-slate-50 to-blue-50">
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Main Content */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Brand */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-neutral-900">SOUGOULA</h3>
          <p className="text-sm text-neutral-600">
            La plateforme de commerce électronique pour le Mali et le Maroc.
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-900">Contact</h4>
          <ul className="space-y-2 text-sm text-neutral-600">
            <li>
              <a 
                href="mailto:camarafamakan2@gmail.com"
                className="transition hover:text-brand.accent"
              >
                📧 camarafamakan2@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="my-8 border-t border-neutral-200" />

      {/* Bottom */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-neutral-600">
          © {new Date().getFullYear()} SOUGOULA. Tous droits réservés.
        </p>
        <p className="text-sm text-neutral-600">
          Créé avec ❤️ pour le Mali et le Maroc
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

