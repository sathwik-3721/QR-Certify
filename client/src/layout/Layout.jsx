import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Aside from "./aside/Aside";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import QrGenerate from "@/components/QrGenerate";
import QRCodeReader from "@/components/QRCodeReader";



function Layout() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="h-full w-full flex transition-all">
        {/* <Header/> */}
        <div className={` h-full w-full `}>
          <Routes>
            <Route
              path="/"
              element={
                <QrGenerate />
              }
            />
            <Route
              path="/scanner"
              element={
                <QRCodeReader />
              }
            />
            <Route path="/other" element={<div>other</div>} />
          </Routes>
        </div>
    </div>
  );
}

export default Layout;
