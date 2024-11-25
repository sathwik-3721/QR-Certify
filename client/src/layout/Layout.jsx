import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import QRCodeReader from "@/components/QRCodeReader";
import LoginForm from "@/components/LoginForm";
import QrGenerate from "@/components/QrGenerate";
import CertificatePdf from "@/components/CertificatePdf";



function Layout({authenticated, setAuthenticated}) {
  return (
    <div className="h-full transition-all w-full">
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
  );
}

export default Layout;
