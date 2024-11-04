import { Button } from "@/components/ui/button";
import { useState } from "react";
import Layout from "./layout/Layout";


function App() {
  const [authenticated, setAuthenticated] = useState(true);
  return (
    <>
      {authenticated ? (
        <div className=" h-full w-full">
          <Layout />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Button
            onClick={() => {
              setAuthenticated(true);
            }}
          >
            Login
          </Button>
        </div>
      )}
    </>
  );
}

export default App;
