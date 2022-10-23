import React from "react";

const ProjectCard = () => {
  return (
    <div className="max-w-lg mx-auto my-3 lg:flex w-auto">
      <div
        className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://pbs.twimg.com/profile_images/808330362417979392/AdiQ86lk_400x400.jpg')",
        }}
        title="unicef"
      ></div>
      <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <div className="text-gray-900 font-bold text-xl mb-2">
            Helping refugess from Africa
          </div>
          <p className="text-gray-700 text-base">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptatibus quia, nulla! Maiores et perferendis eaque,
            exercitationem praesentium nihil.
          </p>
        </div>

        <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded">
          See more
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
