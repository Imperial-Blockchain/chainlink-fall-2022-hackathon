import PropTypes from "prop-types";
import PastContestCard from "./PastContestCard";
import ProjectCard from "./ProjectCard";

const Card = ({ as }) => {
  if (as == "pastContestCard") {
    return <PastContestCard />;
  }

  if (as == "projectCard") {
    return <ProjectCard />;
  }

  return null;
};

Card.PropTypes = {
  type: PropTypes.string,
};

export default Card;
