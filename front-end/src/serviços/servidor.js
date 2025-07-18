import axios from "axios";
const servidor = axios.create({ baseURL: process.env.REACT_APP_API_URL });
export default servidor;
