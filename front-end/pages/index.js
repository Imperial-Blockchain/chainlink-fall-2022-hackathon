import BuyTokensSection from "../components/BuyTokensSection";
import Link from "next/link";

const HomePage = () => {
  return (
    <>
      <h1 className="text-3xl text-blue-700 font-bold p-2 mx-auto underline text-center">
        Welcome to CryptoCare!
      </h1>
      <section className="px-3 mt-8 flex justify-center items-center w-full flex-wrap">
        <img
          className="w-80 h-auto"
          src="/images/mainPageImg1.png"
          alt="CryptoCare"
        />
        <div className="max-w-md ml-7">
          <h2 className="text-gray-900 font-bold text-lg">
            What do we do and how you can help?
          </h2>
          <p className="text-gray-700 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae
            libero tortor. Donec semper mollis condimentum. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Curabitur quis ligula sed justo facilisis finibus eu
            ac felis. Quisque augue sapien, interdum sit amet arcu et, egestas
            tincidunt purus. Morbi sodales augue sed tortor varius, ac pulvinar
            erat mollis. Mauris justo est, porttitor et commodo non, lacinia
            quis odio.
          </p>
        </div>
      </section>

      <section className="px-3 mt-8 flex justify-center items-center w-full flex-wrap">
        <div className="max-w-md ml-7">
          <h2 className="text-gray-900 font-bold text-lg">
            What do we do and how you can help?
          </h2>
          <p className="text-gray-700 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae
            libero tortor. Donec semper mollis condimentum. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Curabitur quis ligula sed justo facilisis finibus eu
            ac felis. Quisque augue sapien, interdum sit amet arcu et, egestas
            tincidunt purus. Morbi sodales augue sed tortor varius, ac pulvinar
            erat mollis. Mauris justo est, porttitor et commodo non, lacinia
            quis odio.
          </p>
        </div>

        <img
          className="w-80 h-auto"
          src="/images/mainPageImg2.png"
          alt="CryptoCare"
        />
      </section>

      <img className="w-80 mx-auto" />
      <h2 className="text-gray-900 text-center mt-7 font-bold text-lg">
        Buy voting tokens and help others!
      </h2>

      <BuyTokensSection />

      <h2 className="text-gray-900 text-center mt-7 font-bold text-lg">
        Want to raise money to help?
      </h2>

      <div className="mx-auto w-fit mt-7">
        <Link href="/create-project">
          <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded">
            Create a project!
          </a>
        </Link>
      </div>
    </>
  );
};

export default HomePage;
