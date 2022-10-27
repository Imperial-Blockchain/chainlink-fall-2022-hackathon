import { Dialog } from "@headlessui/react";
import PropTypes from "prop-types";

const Modal = ({ isOpen = false, handleOpenAndClose }) => {
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
            <Dialog.Title calssName="w-full bg-white mt-1">Unicef</Dialog.Title>
            <Dialog.Description className="mb-2">
              Building school for children in Kongo
            </Dialog.Description>
            <img
              src="https://pbs.twimg.com/profile_images/808330362417979392/AdiQ86lk_400x400.jpg"
              className="w-56"
            />
            <p className="text-center">
              Are you sure you want to deactivate your account? All of your data
              will be permanently removed. This action cannot be undone. Are you
              sure you want to deactivate your account? All of your data will be
              permanently removed. This action cannot be undone.
            </p>
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
              onClick={() => handleOpenAndClose(false)}
            >
              Cancel
            </button>
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
