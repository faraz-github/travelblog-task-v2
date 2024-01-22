import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <div className="middleContainer">
        <Component {...pageProps} />
      </div>
      <Footer />
    </AuthProvider>
  );
}
