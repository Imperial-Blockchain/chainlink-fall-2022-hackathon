import { useRouter } from "next/router";

const PastContestCard = ({ id, name, imgUrl, description }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/past-contests/${id}`);
  };

  return (
    <div key={id} className="m-3 p-2">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure>
          <img className="w-72 h-auto" src={imgUrl} alt="Album" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <p>{description.substr(0, 200) + "..."}</p>
          <div className="card-actions justify-end">
            <button onClick={handleClick} className="btn btn-primary">
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastContestCard;
