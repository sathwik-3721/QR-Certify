import axios from "axios";
const URL = import.meta.env.VITE_URL;
const QR_URL=import.meta.env.VITE_QR_URL;
// const URL = window.origin;
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
    },
    getUserDetails : async (qrId) => {
      try {
        const response = await axios.get(`${QR_URL}/${qrId}`);
        
        return response.data.data[0];
      } catch (err) {
        throw err;
      }
    }
  }

};
