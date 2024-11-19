import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import QRCodeReader from "@/components/QRCodeReader";
import LoginForm from "@/components/LoginForm";
import QrGenerate from "@/components/QrGenerate";
import CertificatePdf from "@/components/CertificatePdf";



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
          <Route path="/pdf" element={<CertificatePdf />} />
        </Routes>
      </div>
    </div>
  );
}

export default Layout;
