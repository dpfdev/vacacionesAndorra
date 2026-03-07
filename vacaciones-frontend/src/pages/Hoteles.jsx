import { useNavigate } from "react-router-dom";

const Hoteles = () => {

  const navigate = useNavigate();

  return (

    <div>

      <h1>Hoteles</h1>

      <ul>
        <li>Hotel Plaza Andorra</li>
        <li>Sport Hotel Hermitage</li>
        <li>Hotel Nordic</li>
      </ul>

      <button onClick={() => navigate("/")}>
        Volver al inicio
      </button>

    </div>

  );

};

export default Hoteles;