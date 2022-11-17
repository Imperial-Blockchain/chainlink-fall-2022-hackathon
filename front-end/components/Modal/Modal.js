import { Dialog } from "@headlessui/react";
import { submitVoteTokens } from "../../utils";

import PropTypes from "prop-types";

const Modal = ({
  isOpen = false,
  handleOpenAndClose,
  title,
  description,
  amount,
  websiteUrl,
  imgUrl,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => handleOpenAndClose(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-800 text-gray-100 rounded-lg p-4 w-auto max-w-md flex flex-col justify-center items-center">
            <Dialog.Title className="w-full text-center mt-1 text-2xl font-bold">
              {title}
            </Dialog.Title>
            <img src={imgUrl} alt="Logo" className="w-56" />
            <p className="text-center">{description}</p>
            <a className="font-bold underline" target="blank" href={websiteUrl}>
              More information about the project
            </a>
            <div className="flex w-full justify-evenly">
              <button
                className="bg-blue-600 hover:bg-blue-300 text-white font-bold py-2 px-4 mt-2 rounded"
                onClick={submitVoteTokens}
              >
                Vote
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 mt-2 rounded"
                onClick={() => handleOpenAndClose(false)}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  handleOpenAndClose: PropTypes.func,
};

export default Modal;
