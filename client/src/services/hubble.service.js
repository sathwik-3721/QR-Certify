import axios from "axios";
import CryptoJS from "crypto-js";

const HUBBLE_SERVER_URL = import.meta.env.VITE_HUBBLE_SERVER_URL;
const VITE_HUBBLE_KEY = import.meta.env.VITE_HUBBLE_KEY;
const AUTH_HEADERS = {
    headers: {
      "Content-Type": "application/json",
    }
};

const encryptValue = (value) => {
    const key = CryptoJS.enc.Utf8.parse(VITE_HUBBLE_KEY);
    const iv = CryptoJS.enc.Utf8.parse(VITE_HUBBLE_KEY);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  };

export default {
  post: {
    authHubbleLogin: async (data) => {
      try {
        const response = await axios.post(`${HUBBLE_SERVER_URL}/employee/login`,
            {
                loginId: encryptValue(data.username),
                password: encryptValue(data.password),
            },
            AUTH_HEADERS );
        console.log(response)
        return response;
      } catch (err) {
        throw err;
      }
    },
  }
}