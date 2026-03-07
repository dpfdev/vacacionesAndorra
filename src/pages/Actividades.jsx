import { useNavigate } from "react-router-dom";

const Actividades = () => {

  const navigate = useNavigate();

  return (

    <div>

      <h1>Actividades</h1>

      <p>Esquí, senderismo, spa y mucho más.</p>

      <button onClick={() => navigate("/")}>
        Volver al inicio
      </button>

    </div>

  );

};

export default Actividades;