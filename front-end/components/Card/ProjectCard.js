import Modal from "../Modal";
import { useState } from "react";

const ProjectCard = ({
  amountNeeded,
  description,
  imgUrl,
  name,
  websiteUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenModal = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="max-w-lg mx-auto my-3 lg:flex w-auto">
        <div
          className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden bg-center"
          style={{
            backgroundImage:
              "url('https://pbs.twimg.com/profile_images/808330362417979392/AdiQ86lk_400x400.jpg')",
          }}
          title="unicef"
        ></div>
        <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <div className="text-gray-900 font-bold text-xl mb-2">{name}</div>
            <p className="text-gray-700 text-base">
              {description.substring(0, 100) + "..."}
            </p>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
            onClick={handleOpenModal}
          >
            See more
          </button>
        </div>
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          handleOpenAndClose={handleOpenModal}
          title={name}
          description={description}
          amount={amountNeeded}
          websiteUrl={websiteUrl}
          imgUrl={imgUrl}
        />
      )}
    </>
  );
};

export default ProjectCard;
