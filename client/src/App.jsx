import { Button } from "@/components/ui/button";
import { useState,useEffect } from "react";
import Layout from "./layout/Layout";
import 'react-toastify/dist/ReactToastify.css';
import QrGenerate from "./components/QrGenerate";


function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("userData");
    if(user) setAuthenticated(true);
  },[authenticated])

  return (
    <>
        <div className="h-full w-full">
          <Layout authenticated={authenticated} setAuthenticated={setAuthenticated} />
        </div>
    </>
  );
}

export default App;
