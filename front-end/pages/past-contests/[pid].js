import fs from "fs";
import { useRouter } from "next/router";

const PastContestDetails = ({
  amountNeeded,
  description,
  imgUrl,
  name,
  websiteUrl,
}) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(websiteUrl);
  };

  return (
    <>
      <h2 className="text-3xl text-blue-800 underline text-center">
        Contest winning project: {name}
      </h2>
      <h3 className="text-center text-xl text-gray-800 mb-3 font-bold">
        Ammout collected: {amountNeeded}$
      </h3>

      <img src={imgUrl} className="rounded-lg mx-auto" />

      <div className="p-3 mx-auto flex flex-column justify-center content-center flex-col mt-3 max-w-md ">
        <h3 className="text-center font-bold text-lg">
          About winning project:
        </h3>
        <p>{description}</p>

        <button
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
        >
          Website
        </button>
      </div>
    </>
  );
};

export function getServerSideProps(context) {
  const { pid } = context.query;

  const data = fs.readFileSync("SAMPLE_JSON_DATA/pastProjects.json");
  const dataArray = JSON.parse(data);

  const thisContest = dataArray.filter((project) => pid == project.id);
  const props = thisContest.length !== 0 ? thisContest[0] : {};

  return {
    props,
  };
}

export default PastContestDetails;
