import { useNavigate } from "react-router-dom";

const Destinos = () => {

  const navigate = useNavigate();

  return (

    <div>

      <h1>Destinos de Andorra</h1>

      <p>Explora los mejores lugares del país.</p>

      <button onClick={() => navigate("/")}>
        Volver al inicio
      </button>

    </div>

  );

};

export default Destinos;