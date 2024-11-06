import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Aside from "./aside/Aside";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import QRCodeReader from "@/components/QRCodeReader";
import LoginForm from "@/components/LoginForm";
import QrGenerate from "@/components/QrGenerate";



function Layout({authenticated, setAuthenticated}) {
  return (
    <div className="h-full w-full flex transition-all">
      {/* <Header/> */}
      <div className={` h-full w-full `}>
        <Routes>
          {authenticated ? (
            <Route path="/scanner" element={<QRCodeReader setAuthenticated={setAuthenticated} />} />
          ) : (
            <Route path="/scanner" element={<LoginForm setAuthenticated={setAuthenticated} />} />
          )}

          <Route path="/" element={<QrGenerate />} />
        </Routes>
      </div>
    </div>
  );
}

export default Layout;
