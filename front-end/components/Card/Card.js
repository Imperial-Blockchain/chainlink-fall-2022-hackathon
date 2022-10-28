import PropTypes from "prop-types";
import PastContestCard from "./PastContestCard";
import ProjectCard from "./ProjectCard";

const Card = ({ as, cardProps }) => {
  if (as == "pastContestCard") {
    return <PastContestCard />;
  }

  if (as == "projectCard") {
    return <ProjectCard {...cardProps} />;
  }

  return null;
};

Card.PropTypes = {
  type: PropTypes.string,
  cardProps: PropTypes.object,
};

export default Card;
