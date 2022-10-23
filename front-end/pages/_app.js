import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <main style={{ minHeight: "calc(100vh - 150px)" }}>
        <Navbar />
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
