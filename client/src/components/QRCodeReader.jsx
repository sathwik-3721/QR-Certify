import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Camera, AlertCircle, LogOut, Mail,Loader2, ArrowLeft,ScanLine } from "lucide-react";
import miracleLogo from '../assets/miracle.png'
import userLogo from '../assets/user.png'

import QrScanner from "qr-scanner";
import API from "@/services/API";
import { ToastContainer, toast } from "react-toastify";

export default function QRCodeReader({ setAuthenticated }) {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [fetchingState, setFetchingState] = useState("idle");
  const [showDetails,setShowDetails] = useState(false);
  // const initialState = {
  //   _id: "",
  //   name: "revanth",
  //   email: "revanth@gmail.com",
  //   event: "Hnads on with revanth revanth revanth revanth revanth revanth revanth revanth revanth",
  //   image: "",
  //   issued : false
  // }

  const initialState = {
    _id: "",
    name: "",
    email: "",
    event: "",
    image: "",
    issued : false
  }
  const [details, setDetails] = useState(initialState);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setAuthenticated(false);
    console.log("logged out")
  };

  const handleCancelMail = () => {
    setFetchingState("idle");
    setShowDetails(false);
    // setDetails(initialState)
  }


  const handlefetchingDetails = async (userData) => {
    console.log(userData);
    try {
      setFetchingState("fetching details...");
      const result = await API.get.getDetails(userData);
      setShowDetails(true);
      setDetails(result);
    } catch (err) {
      console.log(err);
      toast.error("Error while feching details"+err);
    }
    finally{
      setFetchingState("idle")
    }
  };

  const sendPDFToBackend = async () => {
    try {
        console.log("Valid Blob:", details.email);
        setFetchingState("sending mail")
        await API.post.sendCertificate(details);
        setShowDetails(false);
        // setDetails(initialState)
        toast.success("Mail sent successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to send mail");
    } finally {
      setFetchingState("idle");
    }
  };

  const startScanning = async () => {
    setError(null);
    setScannedData(null);
    setIsScanning(true);
    setDetails(initialState);

    try {
      if (!videoRef.current) return;

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          try {
            const parsedData = JSON.parse(result.data);
            handlefetchingDetails(parsedData);
            setScannedData(parsedData);
          } catch (err) {
            setError("Invalid QR code data format");
          }
          setIsScanning(false);
          scannerRef.current?.stop();
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: false,
          highlightCodeOutline: false,
        }
      );

      await scannerRef.current.start();
    } catch (err) {
      toast.error("Can't find Camera");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.destroy();
    }
    setIsScanning(false);
  };

  useEffect(() =>{
    console.log(fetchingState)
  },[fetchingState])

  return (
    <div className="h-full flex items-start justify-center px-2">
      <ToastContainer />
        <Card className="w-full relative max-w-md rounded-xl h-full border-0 shadow-none overflow-hidden">
          <CardHeader className="text-white mt-2 rounded-t-xl p-2">
            <div className="flex justify-between">
              
              <div className={`${showDetails ? "visible" : "invisible"} flex justify-center items-center  text-black rounded-full w-8 h-8`}>
                <ArrowLeft
                  onClick={handleCancelMail}
                  className="h-6 w-6 cursor-pointer"
                />
              </div>
              <div className="flex justify-center items-center bg-miracle-lightBlue text-white rounded-full w-8 h-8">
                <LogOut
                  onClick={handleLogout}
                  className="h-4 w-4 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex justify-center items-center"><img src={miracleLogo} width={150} alt="miracle" /></div>

            <CardTitle className="text-2xl font-bold text-center text-miracle-darkBlue">
              Scanner
            </CardTitle>
          </CardHeader>
        <div className={`flex transition-transform duration-500 ease-in-out min-w-full ${showDetails ? "-translate-x-full" : "translate-x-0"}`}>
          <CardContent className="space-y-4 p-0 min-w-full">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden h-[400px] w-full">
                <video ref={videoRef} className="w-full h-full object-cover" />
                {isScanning && <div className="absolute inset-0 flex items-center justify-center bg-miracle-lightBlue h-[2px] w-[93%] mx-auto animate-upDown"></div> }
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <Camera className="w-16 h-16 text-miracle-white opacity-50" />
                  </div>
                )}
              </div>
{/* 
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )} */}

                <Button
                  onClick={isScanning ? stopScanning : startScanning}
                  className="w-full bg-[#0d416b] hover:bg-[#0d416b]/90"
                  disabled={fetchingState !== "idle"}
                >
                  {isScanning
                    ? "Stop Scanning"
                    : fetchingState.includes("fetching")
                    ? <span className="flex items-center"><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Fetching Details...</span> 
                    : <span className="flex items-center"> <ScanLine className="h-5 w-5 inline mr-2" /> <span>Scan QR Code</span> </span>}
                </Button>
          </CardContent>

          <CardContent className="space-y-4 p-0 min-w-full">

              {details.email !== "" && (
                <div className="flex flex-col justify-center h-[400px]">
                  <div className="flex justify-center items-center">
                    <img
                      src={userLogo}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-[#00aae7]"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-center text-lg font-bold">{details.name.charAt(0).toLocaleUpperCase() + details.name.substring(1)}</p>
                    <p className="text-center mt-1">{details.email}</p>
                    {/* <p className="text-center mt-1">{details.email.substring(0,details.email.lastIndexOf('@')).length > 13 ? details.email.substring(0,5) + "***" + details.email.substring(details.email.lastIndexOf('@') - 5) : details.email}</p> */}
                    <p className="text-center mt-2 text-gray-400 font-bold">{details.event}</p>
                    {details.issued && <p className="text-green-700 font-semibold text-center mt-2">Certificate Issued</p>}
                    
                  </div>
                  
                </div>
              )}
                { !details.issued &&
                  <div className="px-2">
                {
                  fetchingState.includes("sending") ? 
                  <Button className="bg-miracle-darkBlue hover:bg-miracle-darkBlue w-full" disabled>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      sending...
                  </Button>
                  :
                  <Button 
                  onClick={sendPDFToBackend} 
                  className="bg-[#2368a0] hover:bg-[#1c5280] text-white w-full"
                  
                >
                  <Mail className="h-4 w-4" /> Send Mail
                </Button>
      
                }
              </div>
              }
          </CardContent>
        </div>

          <div className="absolute bottom-0 w-full flex items-center justify-center text-sm text-gray-500">
          Made with ❤️ at Miracle Labs
        </div>
        </Card>
    </div>
  );
}
