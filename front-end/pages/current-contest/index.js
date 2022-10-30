import Card from "../../components/Card";
import TimeLeftCounter from "../../components/TimeLeftCounter";

import fs from "fs";

const CurrentContest = ({ deadline, projects }) => {
  return (
    <>
      <h1 className="mt-3 mb-6 mx-auto text-center text-3xl font-semibold text-blue-600 underline">
        Current Contest
      </h1>
      <TimeLeftCounter deadline={deadline} />
      <h2 className="mt-3 mb-6 mx-auto text-center text-2xl font-semibold text-gray-800">
        Projects:
      </h2>

      <div className="flex flex-wrap">
        {projects.map((props) => (
          <Card key={props.name} as="projectCard" cardProps={props} />
        ))}
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const data = fs.readFileSync("SAMPLE_JSON_DATA/currentProjects.json");

  const dataObject = JSON.parse(data);

  return {
    props: dataObject,
  };
}

export default CurrentContest;
