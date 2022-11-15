import { createProject } from "../../utils";
import { useRef } from "react";
import { toast } from "react-toastify";

const CreateProjectForm = () => {
  const nameRef = useRef("");
  const descRef = useRef("");
  const websiteUrlRef = useRef("");
  const imgUrlRef = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.promise(
      createProject(
        nameRef.current.value,
        descRef.current.value,
        websiteUrlRef.current.value,
        imgUrlRef.current.value
      ),
      {
        pending: "Pending...",
        success: "Project added! Good Luck!",
        error: "Oops. Something went wrong!",
      }
    );
  };

  return (
    <form className="flex justify-center content-center flex-col w-full max-w-lg mx-auto">
      <div className="flex flex-wra flex-col justify-center content-center p -mx-3 mb-6">
        <div className="w-full  px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-first-name"
          >
            Project name
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
            type="text"
            ref={nameRef}
          />
        </div>
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-last-name"
          >
            Project Description
          </label>
          <textarea
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            rows="8"
            ref={descRef}
          />
        </div>
      </div>

      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-city"
          >
            Website Url
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            ref={websiteUrlRef}
          />
        </div>
      </div>

      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-city"
          >
            Image Url
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            ref={imgUrlRef}
          />
        </div>
      </div>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </form>
  );
};

export default CreateProjectForm;
