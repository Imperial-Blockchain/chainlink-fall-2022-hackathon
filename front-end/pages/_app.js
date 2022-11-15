import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { MoralisProvider } from "react-moralis";
import { ToastContainer } from "react-toastify";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <main style={{ minHeight: "calc(100vh - 150px)" }}>
        <Navbar />
        <ToastContainer />
        <Component {...pageProps} />
      </main>
      <Footer />
    </MoralisProvider>
  );
}

export default MyApp;
