import fs from "fs";

export async function getServerSideProps() {
  const data = fs.readFileSync("SAMPLE_JSON_DATA/pastProjects.json");

  const dataObject = JSON.parse(data);

  return {
    props: { pastProjects: dataObject },
  };
}
const PastContests = ({ pastProjects }) => {
  return (
    <div>
      <h1 className="text-center font-bold text-3xl">Our Past Projects</h1>
      {pastProjects.map((pastProject) => (
        <div key={pastProject.id}>
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <figure>
              <img src={pastProject.imgUrl} alt="Album" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{pastProject.name}</h2>
              <p>{pastProject.description}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Read More</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastContests;
