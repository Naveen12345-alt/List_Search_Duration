import API_URL from "../constants/get-info-url";

const getUserInfo = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
};

export default getUserInfo;
