import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { loginSeller, registerSeller } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  whatsappNumber: z.string().min(6, "WhatsApp number must be at least 6 digits"),
});

type RegisterValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "", whatsappNumber: "" },
  });

  const isRegister = mode === "register";

  const handleLogin = async (values: LoginValues) => {
    try {
      const auth = await loginSeller(values);
      login(auth);
      toast.success(`Welcome back ${auth.user.name}! 👋`);
      const redirectTo =
        (location.state as { from?: { pathname?: string } })?.from?.pathname ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Unable to authenticate. Please try again.");
    }
  };

  const handleRegister = async (values: RegisterValues) => {
    try {
      const auth = await registerSeller(values);
      login(auth);
      toast.success("Account created! Let's add your first listing. 🎉");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Unable to create account. Please try again.");
    }
  };

  const switchMode = (nextMode: "login" | "register") => {
    setMode(nextMode);
    if (nextMode === "login") {
      loginForm.reset();
    } else {
      registerForm.reset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center px-4 py-8">
      <motion.div 
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Left Side - Brand Section */}
          <motion.div
            className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-12 text-white shadow-2xl flex flex-col justify-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-blue-100 font-semibold">
              ✨ StatusMarket
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-tight">
              Sell smarter with WhatsApp-native flows.
            </h2>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-semibold">Unlimited Listings</p>
                  <p className="text-blue-100 text-sm">Cloudinary hosting included</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="font-semibold">Admin Oversight</p>
                  <p className="text-blue-100 text-sm">Keep spam away from your marketplace</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-semibold">Fast & Reliable</p>
                  <p className="text-blue-100 text-sm">React Query powered dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm p-4">
              <p className="text-sm text-blue-50">
                💡 Join thousands of sellers already using StatusMarket to grow their business.
              </p>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Tab Switcher */}
            <div className="flex gap-2 rounded-full bg-slate-100 p-1.5 mb-8">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  mode === "login" 
                    ? "bg-white text-blue-600 shadow-md" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🔑 Login
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  mode === "register" 
                    ? "bg-white text-blue-600 shadow-md" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ✍️ Register
              </button>
            </div>

            {isRegister ? (
              <motion.form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    {...registerForm.register("name")}
                    placeholder="Jane Seller"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">
                      {registerForm.formState.errors.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">WhatsApp Number</label>
                  <input
                    {...registerForm.register("whatsappNumber")}
                    placeholder="+1 555 000 000"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                  {registerForm.formState.errors.whatsappNumber && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">
                      {registerForm.formState.errors.whatsappNumber?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    {...registerForm.register("email")}
                    type="email"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    placeholder="you@email.com"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">
                      {registerForm.formState.errors.email?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <input
                    {...registerForm.register("password")}
                    type="password"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    placeholder="••••••••"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">
                      {registerForm.formState.errors.password?.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={registerForm.formState.isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {registerForm.formState.isSubmitting ? "Creating account..." : "Create account"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form 
                onSubmit={loginForm.handleSubmit(handleLogin)} 
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    {...loginForm.register("email")}
                    type="email"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    placeholder="you@email.com"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">
                      {loginForm.formState.errors.email?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <input
                    {...loginForm.register("password")}
                    type="password"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    placeholder="••••••••"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">
                      {loginForm.formState.errors.password?.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loginForm.formState.isSubmitting ? "Logging in..." : "Login"}
                </motion.button>
              </motion.form>
            )}

            <p className="mt-6 text-center text-xs text-slate-500">
              By continuing, you agree to our Terms of Service
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;