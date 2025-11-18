import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import ListingDetailsPage from "@/pages/ListingDetailsPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateListingPage from "@/pages/CreateListingPage";
import EditListingPage from "@/pages/EditListingPage";
import SellerProfilePage from "@/pages/SellerProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import AdminPanelPage from "@/pages/AdminPanelPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { AdminRoute, ProtectedRoute } from "@/components/ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* Auth routes - Outside MainLayout */}
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/login" element={<AuthPage />} />
    <Route path="/register" element={<AuthPage />} />

    {/* Main app routes - Inside MainLayout */}
    <Route element={<MainLayout />}>
      <Route index path="/" element={<HomePage />} />
      <Route path="/listings/:listingId" element={<ListingDetailsPage />} />
      <Route path="/seller/:sellerId" element={<SellerProfilePage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/listings/new" element={<CreateListingPage />} />
        <Route path="/listings/:listingId/edit" element={<EditListingPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPanelPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;

