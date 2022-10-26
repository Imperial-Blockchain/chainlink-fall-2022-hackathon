import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <>
        <main style={{ minHeight: "calc(100vh - 150px)" }}>
          <Navbar></Navbar>
          <Component {...pageProps} />
        </main>
        <Footer />
      </>
    </MoralisProvider>
  );
}

export default MyApp;
