import { useNavigate } from "react-router-dom";

const NewPing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>New Ping</h1>
      <p>You are being redirected to create a new ping...</p>
      {navigate("/ping/0", { replace: true })}
    </div>
  );
};

const NewPong = () => {

  const navigate = useNavigate();
  return (
    <div>
      <h1>New Ping</h1>
      <p>You are being redirected to create a new ping...</p>
      {navigate("/pong/0", { replace: true })}
    </div>
  );
};

export { NewPing, NewPong };
