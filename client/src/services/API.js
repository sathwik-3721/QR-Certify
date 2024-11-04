import axios from "axios";
const URL = import.meta.env.VITE_URL;
export default {
  post: {
    register: async (data) => {
      try{
        const response = await axios.post(`${URL}/uploadData`, data,{
          headers : {
            'Content-Type': 'multipart/form-data',
          }
        });

        return response.data;
      }
      catch(err){
        throw err;
      } 
    },
  },
  get : {
    getDetails : async () => {
      try{
        const response = await axios.get(`${URL}/getCertificate?name=Rev&email=emauil`);
        return response.data;
      }
      catch(err){
        throw err;
      } 
    }
  }

};
