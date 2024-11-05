import axios from "axios";
// const URL = import.meta.env.VITE_URL;
const URL = "http://localhost:8000/v1/api"
console.log(URL)
export default {
  post: {
    register: async (data) => {
      try{
        const response = await axios.post(`${URL}/uploadData`, data);
        return response.data;
      }
      catch(err){
        throw err;
      } 
    },
    sendCertificate : async (data) => {
      try{
        const response = await axios.post(`${URL}/sendCerificate`, data);
        return response.data;
      }
      catch(err){
        throw err;
      } 
    }
  },
  get : {
    getDetails : async (userData) => {
      try{
        const response = await axios.get(`${URL}/getDetails?name=${userData.name}&email=${userData.email}&event=${userData.event}`);
        return response.data;
      }
      catch(err){
        throw err;
      } 
    }
  }

};
