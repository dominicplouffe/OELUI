import { useNavigate } from "react-router-dom";

const NewPing = () => {
  const navigate = useNavigate();

  navigate("/ping/0", { replace: true });

  return null;
};

const NewPong = () => {
  const navigate = useNavigate();

  navigate("/pong/0", { replace: true });

  return null;
};

export { NewPing, NewPong };
