import PropTypes from "prop-types";
import PastContestCard from "./PastContestCard";
import ProjectCard from "./ProjectCard";

const Card = ({ as, cardProps }) => {
  if (as == "pastContestCard") {
    return <PastContestCard {...cardProps} />;
  }

  if (as == "projectCard") {
    return <ProjectCard {...cardProps} />;
  }

  return null;
};

Card.propTypes = {
  type: PropTypes.string,
  cardProps: PropTypes.object,
};

export default Card;
