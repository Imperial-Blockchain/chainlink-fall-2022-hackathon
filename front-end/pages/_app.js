import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { MoralisProvider } from "react-moralis";
import { ToastContainer } from "react-toastify";
import { InMemoryCache, ApolloClient, ApolloProvider } from "@apollo/client";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/36905/chainlink-hackathon/v0.0.4",
});

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <main style={{ minHeight: "calc(100vh - 150px)" }}>
          <Navbar />
          <ToastContainer />
          <Component {...pageProps} />
        </main>
        <Footer />
      </ApolloProvider>
    </MoralisProvider>
  );
}

export default MyApp;
