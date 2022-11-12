import fs from "fs";
import Card from "../../components/Card";

const PastContests = ({ pastProjects }) => {
  return (
    <div>
      <h1 className="text-center font-bold text-3xl text-blue-800 underline">
        Our Past Contest Winners
      </h1>

      <div className="flex flex-wrap">
        {pastProjects.map((pastProject) => (
          <Card
            key={pastProject.id}
            as="pastContestCard"
            cardProps={pastProject}
          />
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const data = fs.readFileSync("SAMPLE_JSON_DATA/pastProjects.json");

  const dataObject = JSON.parse(data);

  return {
    props: { pastProjects: dataObject },
  };
}

export default PastContests;
