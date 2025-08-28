import axios from "axios";

const API_URL = 'http://localhost:8080/api/foods'
const PROVINCE_API_URL = "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json";

 export const fetchFoodList = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch food list:", error);
    }
}

export const fetchFoodDetails = async (id) => {
    try {
        const response = await axios.get(API_URL+"/"+id);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch food details:", error);
    }
}


export const fetchThaiProvinces = async () => {
  try {
    const response = await axios.get(PROVINCE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch provinces:", error);
  }
};