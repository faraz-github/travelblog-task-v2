import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Navbar />
        <div className="middleContainer">
          <Component {...pageProps} />
        </div>
        <Toaster />
        <Footer />
      </LoadingProvider>
    </AuthProvider>
  );
}
