import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

axios.defaults.baseURL =
  "https://m40hr4uqn9.execute-api.eu-central-1.amazonaws.com/dev/api/v1";

const http = axios.create({});

http.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("token");
    if (accessToken) {
      config.headers["authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
