import { useNavigate } from "react-router-dom";

const Contacto = () => {

  const navigate = useNavigate();

  return (

    <div>

      <h1>Contacto</h1>

      <p>Email: info@andorra.com</p>

      <button onClick={() => navigate("/")}>
        Volver al inicio
      </button>

    </div>

  );

};

export default Contacto;