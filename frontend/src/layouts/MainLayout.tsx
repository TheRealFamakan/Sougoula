import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-neutral-50">
    <Header />
    <main className="flex-1 bg-neutral-50">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;

