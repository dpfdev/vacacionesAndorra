import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const getHoteles = () => api.get("/hoteles");
export const getHotel = (id) => api.get(`/hoteles/${id}`);