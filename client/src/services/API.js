import axios from "axios";
// const URL = import.meta.env.VITE_URL;
const URL = window.origin;
console.log(URL)
export default {
  post: {
    register: async (data) => {
      try{
        const response = await axios.post(`${URL}/v1/api/uploadData`, data);
        return response.data;
      }
      catch(err){
        throw err;
      } 
    },
    sendCertificate : async (data) => {
      try{
        const response = await axios.post(`${URL}/v1/api/sendCertificate`, data);
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
        // const response = await axios.get(`${URL}/getDetails?name=Revanth&email=revathipathilanka347@gmail.com&event=Demos`);
        const response = await axios.get(`${URL}/v1/api/getDetails?name=${userData.name}&email=${userData.email}&event=${userData.event}`);
        return response.data;
      }
      catch(err){
        throw err;
      } 
    }
  }

};
