import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  return (

    <div>

      <h1>Login</h1>

      <input placeholder="Usuario" />

      <input type="password" placeholder="Contraseña" />

      <br />

      <button>
        Iniciar sesión
      </button>

      <button onClick={() => navigate("/")}>
        Volver
      </button>

    </div>

  );

};

export default Login;