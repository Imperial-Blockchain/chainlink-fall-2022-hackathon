import Card from "../Card";

import { useState, useEffect } from "react";

const TimeLeftCounter = () => {
  const deadlineTime = 1700000000000; // in milliseconds
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(deadlineTime - Date.now());
    });

    return () => {
      clearInterval(id);
    };
  });

  return (
    <>
      <h1 className="mt-3 mb-6 mx-auto text-center text-3xl font-semibold text-blue-600 underline">
        Current Contest
      </h1>
      <div className="container mx-auto max-w-lg w-auto bg-gray-800 text-gray-100 p-3 rounded-lg">
        <h3 className="mx-auto text-center text-lg">
          Time left till the end of the current contest:
        </h3>
        <div className="bg-white text-blue-600 mt-3 mb-2 p-3 rounded-lg text-center font-bold text-3xl">
          {getTimeLeftString(timeLeft)}
        </div>
      </div>

      <h2 className="mt-3 mb-6 mx-auto text-center text-2xl font-semibold text-gray-800">
        Projects:
      </h2>

      <div className="flex flex-wrap">
        <Card as="projectCard" />
        <Card as="projectCard" />
        <Card as="projectCard" />
      </div>
    </>
  );
};

const getTimeLeftString = (milliseconds) => {
  console.log("mill", milliseconds);
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
};

export default TimeLeftCounter;
