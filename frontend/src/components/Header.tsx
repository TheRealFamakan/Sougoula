import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Marché", to: "/" },
  { label: "Tableau de bord", to: "/dashboard", protected: true },
  { label: "Administration", to: "/admin", adminOnly: true },
];

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const filteredNav = navItems.filter((item) => {
    if (item.adminOnly) {
      return isAdmin;
    }
    if (item.protected) {
      return Boolean(user);
    }
    return true;
  });

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <img src="src/assets/images/slogo.png" alt="Sougoula Logo" className="w-6 h-6" />
          </div>
          <span className="text-lg font-black text-slate-900">SOUGOULA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-300 relative ${
                  isActive 
                    ? "text-blue-600" 
                    : "text-slate-600 hover:text-blue-600"
                } group`
              }
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300`} />
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/listings/new"
                  className="flex items-center gap-2 rounded-full border-2 border-blue-600 px-5 py-2 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50"
                >
                  <span>➕</span> Nouvelle annonce
                </Link>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all"
              >
                Déconnexion
              </motion.button>
            </>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/auth"
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all"
              >
                Se Connecter
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 md:hidden hover:bg-slate-100 transition-colors"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden md:hidden border-t border-slate-200 bg-white"
      >
        <div className="px-4 py-6 space-y-4">
          {/* Mobile Nav Items */}
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Mobile Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            {user ? (
              <>
                <Link
                  to="/listings/new"
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-lg border-2 border-blue-600 px-4 py-2 text-center text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  ➕ Nouvelle annonce
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-bold text-white hover:shadow-lg transition-all"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-center text-sm font-bold text-white hover:shadow-lg transition-all"
              >
                Se Connecter
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
};



export default Header;