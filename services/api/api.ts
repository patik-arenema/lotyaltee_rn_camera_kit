import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleRequest } from "../middleware/handleRequest";
import http from "../middleware/http";

export const userLogin = (data:any) =>
  handleRequest(() => http.post("/auth/login", data));

export const userRegister = (data:any) =>
  handleRequest(() => http.post("/auth/register/store-admin", data));

export const sendRegisterCustumerOtp = (data:any) =>
  handleRequest(() => http.post("/auth/send-registration-otp", data));

export const verifyRegisterCustumerOtp = (data:any) =>
  handleRequest(() => http.post("/auth/verify-registration-otp", data));

export const sendForgotPasswordOtp = (data:any) =>
  handleRequest(() => http.post("/auth/send-forgot-otp", data));

export const verifyForgotPasswordOtp = (data:any) =>
  handleRequest(() => http.post("/auth/verify-forgot-otp", data));

export const resetUserPassword = (data:any) =>
  handleRequest(() => http.post("/auth/reset-password", data));

export const changeCustumerPassword = (data:any) =>
  handleRequest(() => http.post("/auth/change-password", data));

export const getStampMark = (data:any) =>
  handleRequest(() => http.post("/stamps/mark", data));

export const getUserStoreList = () =>
  handleRequest(() => http.get("/stores/list"));

export const getStoreById = (id:string) =>
  handleRequest(() => http.get(`/stores/${id}`));

export const getStoreDetails = (data:any) =>
  handleRequest(() => http.post(`/stores/select-store`, data));

export const getStampCardDetails = (userId:string, storeId:string) =>
  handleRequest(() =>
    http.get(`/card/info?user_id=${userId}&store_id=${storeId}`)
  );

export const generateStampMarks = (data:any) =>
  handleRequest(() => http.post(`/stamps/mark`, data));

export const downloadStampCard = (card_uuid:string) =>
  handleRequest(() => http.post(`/card/download?card_uuid=${card_uuid}`));

export const getUserStampsHistory = async () => {
  const userId = await localStorage.getItem("userId");
  return handleRequest(() => http.post(`/stamps/history?user_id=${userId}`));
};

export const updateStampCard = (data:any) =>
  handleRequest(() => http.post(`/card/update`, data));

export const getCardDetailsById = (id:string) =>
  handleRequest(() => http.get(`/card/user-details?card_uuid=${id}`));

export const redeemStampCard = (data:any) =>
  handleRequest(() => http.post(`/card/redeem`, data));

export const updateStampMarks = (data:any) =>
  handleRequest(() => http.post(`/stamps/mark`, data));

export const customerOnboardedData = async (data: any) =>{
    let storeId = await AsyncStorage.getItem("storeId")
  return handleRequest(() => http.post(`/store-admin/customer-onboarded/count?store_id=${storeId}`, data))};

export const coffeeRedeemedData = async (data: any) => {
    let storeId = await AsyncStorage.getItem("storeId")
  return handleRequest(() => http.post(`/store-admin/coffee-redeemed/count?store_id=${storeId}`, data))};

export const cardsGeneratedData = async (data: any) => {
  let storeId = await AsyncStorage.getItem("storeId")
  return handleRequest(() => http.post(`/store-admin/card-generated/count?store_id=${storeId}`, data))};  


