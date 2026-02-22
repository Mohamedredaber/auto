import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);

  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const authService = {
  register,
};

export default authService;