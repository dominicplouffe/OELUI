import { useHistory } from "react-router-dom";

const NewPing = () => {
  const history = useHistory();

  history.push("/ping/0");

  return null;
};

export default NewPing;
