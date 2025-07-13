import { useNavigate } from "react-router-dom";

const NewPing = () => {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/ping/0", { replace: true });
  }, 100); // Redirect after 1 second

  return (
    <div>
      <h1>New Ping</h1>
      <p>You are being redirected to create a new ping...</p>
    </div>
  );
};

const NewPong = () => {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/pong/0", { replace: true });
  }, 100);

  return (
    <div>
      <h1>New Ping</h1>
      <p>You are being redirected to create a new ping...</p>
    </div>
  );
};

export { NewPing, NewPong };
