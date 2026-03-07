import { Route, Routes } from "react-router-dom";

import HotelesModal from "./components/HotelesModal";
import Actividades from "./pages/Actividades";
import Contacto from "./pages/Contacto";
import Destinos from "./pages/Destinos";
import Home from "./pages/Home";
import Hoteles from "./pages/Hoteles";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/destinos" element={<Destinos />} />
      <Route path="/actividades" element={<Actividades />} />
      <Route path="/hoteles" element={<Hoteles />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/login" element={<Login />} />
              <Route path="/hoteles" element={<HotelesModal />} />
    </Routes>
  );
}

export default App;