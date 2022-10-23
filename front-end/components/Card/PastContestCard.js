import React from "react";

const PastContestCard = () => {
  return (
    <div className="max-w-sm pt-2 my-3 mx-auto bg-gray-800 rounded-lg shadow-xl flex flex-col items-center justify-center">
      <div className="flex-shrink-0 w-auto flex justify-center">
        <img
          className="h-auto w-3/4"
          src="https://pbs.twimg.com/profile_images/808330362417979392/AdiQ86lk_400x400.jpg"
          alt=""
        />
      </div>
      <div className="flex flex-col justify-center bg-white p-6 rounded-lg mt-2 w-full">
        <h3 className="text-2xl text-gray-900 underline text-center">
          Contest #1
        </h3>
        <h5 className="text-xl text-gray-900">Date: 23.10.2022</h5>
        <h5 className="text-xl text-gray-900"> Winner: Unicef</h5>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded">
          See more
        </button>
      </div>
    </div>
  );
};

export default PastContestCard;
