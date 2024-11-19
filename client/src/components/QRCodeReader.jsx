import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, AlertCircle, LogOut, Mail, XCircle,ScanLine } from "lucide-react";
import miracleLogo from '../assets/miracle.png'
import QrScanner from "qr-scanner";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import API from "@/services/API";
import { ToastContainer, toast } from "react-toastify";
import certificateImage from '../assets/certificate-bg.png'

const styles = StyleSheet.create({
  page: {
      backgroundColor: "#fff",
      position:"relative",
    },
    imageContainer : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '600',
        zIndex: -1, 
    },
    image : {
        width: '100%',
        height: '100%',
    },
    header: {
      textAlign: "center",
      fontSize: 50,
      marginTop:100,
      fontWeight:'bold',
    },
    header2 :{
      fontSize: 30,
      textAlign: "center",
    },
    section: {
      textAlign: "center",
      marginBottom: 20,
    },
  line : {
    border:"4px solid black",
    width:450,
    marginLeft:200,
    marginBottom:20,
    marginTop:5
  },
    certificateText : {
      textAlign:"center",
      marginBottom:8,
      fontFamily:"RobotoRegular"
      },
    details: {
      fontSize: 16,
      marginBottom: 10,
    },
    name: {
      textAlign:"center",
      fontSize: 30,
      marginTop: 200,
      fontStyle: "italic"
    },
    content: {
      marginTop: 20,
    },
    footer: {
      textAlign:"center",
      marginBottom:15,
      color:"gray"
    },
    year:{
      fontSize:20,
      fontFamily:"RobotoMedium"
    }
});

const MyDocument = ({data}) => (
  <Document>
  <Page size="A4" orientation="landscape" style={styles.page}>
    <View>
      <Text style={styles.name}>{data.name}</Text>
      <View style={styles.content}>
      <Text style={styles.certificateText}>
          Attended
      </Text>
          <Text style={styles.certificateText}>
           Integrating Gemini APIs with Python and Building a Chatbot App with Streamlit/Chainlit UI </Text>
          <Text style={styles.certificateText}>at <Text style={styles.year}>Digital Summit'24</Text> from <Text style={styles.year}>December 19-21st, 2024</Text> at Miracle valley</Text>
          <Text style={styles.certificateText}>
          Visakhapatnam(AP)
          </Text>
          <Text style={styles.footer}>
          "Cloud","Cognitive","Blockchain","IoT","Machine Learning"
          </Text>
      </View>
      
      <View style={styles.imageContainer}>
      <Image style={styles.image} src={certificateImage} />
      </View>
      </View>
    </Page>
  </Document>
)

export default function QRCodeReader({ setAuthenticated }) {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [fetchingState, setFetchingState] = useState("idle");
  const initialState = {
    _id: "",
    name: "",
    email: "",
    event: "",
    image: "",
    issued : ""
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
    setDetails(initialState)
  }

  const generateAndSendPDF = async () => {
    try {
      setFetchingState("generating certificate");
      const pdfBlob = await pdf(<MyDocument data={details} />).toBlob(); // Generate PDF blob
      // setPdfBlob(pdfBlob); // Set the generated PDF blob
      await sendPDFToBackend(details, pdfBlob); // Send PDF to backend
    } catch (error) {
      toast.error("Error while generating certificate")
      console.log("Error generating PDF:", error);
    }
  };

  const handlefetchingDetails = async (userData) => {
    console.log(userData);
    try {
      setFetchingState("fetching details...");
      const result = await API.get.getDetails(userData);
      // await generateAndSendPDF(result);
      if(result.issued){
        setFetchingState("idle");
      }
      else{
        setFetchingState("fetched");
      }
      setDetails(result);
    } catch (err) {
      console.log(err);
      toast.error("Error while fechin details");
    }
  };

  const sendPDFToBackend = async (data, pdfBlob) => {
    try {
      if (pdfBlob instanceof Blob) {
        setFetchingState("sending certificate");
        console.log("Valid Blob:", pdfBlob, data.email);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("event", data.event);
        formData.append("email", data.email);
        formData.append("pdf", pdfBlob, "certificate.pdf");
        const response = await API.post.sendCertificate(formData);
        setDetails(initialState)
        toast.success("Mail sent successfully");
      }
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
      setError(
        "Failed to start camera. Please ensure you have given camera permissions."
      );
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
    <div className="min-h-screen bg-gray-100 flex flex-col md:justify-center">
      {/* <header className="bg-white shadow-md py-4 2xl:px-8 p-2 flex justify-end">
        <LogOut
          onClick={handleLogout}
          className="h-4 w-4 mr-2 cursor-pointer"
        />
      </header> */}
      <ToastContainer />
      <div className="px-2 md:items-center md:justify-center flex justify-center">
        <Card className="w-full max-w-md md:mt-0 mt-3 max-h-full rounded-xl p-2 pb-12 relative">
          <CardHeader className="text-white mt-7 rounded-t-xl p-2">
            <div className="mb-3 flex justify-between"><div className="invisible">efefe</div><img src={miracleLogo} width={100} alt="miracle" /> <div className="flex justify-center items-center bg-miracle-lightBlue text-white rounded-full w-8 h-8"><LogOut
          onClick={handleLogout}
          className="h-4 w-4 cursor-pointer"
        /></div></div>
            <CardTitle className="text-2xl font-bold text-center text-miracle-darkBlue">
              DS-2024 Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:px-4 p-2">
            {
              details.email === "" &&
              <div className="relative aspect-video bg-miracle-mediumBlue/50 rounded-lg overflow-hidden h-[300px] w-full md:w-full md:h-[400px]">
              <video ref={videoRef} className="w-full h-full object-cover" />
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Camera className="w-16 h-16 text-miracle-white opacity-50" />
                </div>
              )}
            </div>
            }

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}


            {details.email !== "" && (
              <div className="flex flex-col justify-between">
                <div className="flex justify-center items-center">
                  <img
                    src={details.image}
                    alt="Profile"
                    className="w-20 h-20 object-cover rounded-full border-4 border-[#00aae7]"
                  />
                </div>
                <div className="text-sm">
                  <h2 className="font-semibold">User Details</h2>
                  <p>Name: {details.name}</p>
                  <p>Email: {details.email.substring(0,details.email.lastIndexOf('@')).length > 13 ? details.email.substring(0,5) + "***" + details.email.substring(details.email.lastIndexOf('@') - 5) : details.email}</p>
                  <p>Demo: {details.event}</p>
                  {details.issued && <p><span className="text-green-700 font-semibold">Certificate Issued</span>  </p>}
                </div>
                
              </div>
            )}

            {fetchingState.includes("idle") || fetchingState.includes("fetching") || fetchingState.includes("sending") ? (
              <Button
                onClick={isScanning ? stopScanning : startScanning}
                className="w-full bg-[#0d416b] hover:bg-[#0d416b]/90"
                disabled={fetchingState !== "idle"}
              >
                {isScanning
                  ? "Stop Scanning"
                  : fetchingState.includes("fetching")
                  ? "Fetching Details..."
                  : fetchingState.includes("sending")
                  ? "Sending Mail..."
                  : <span> <ScanLine className="h-5 w-5 inline mr-2" /> Start Scanning</span>}
              </Button>
            ) : (
              // <div className="flex justify-between">
              //   <Button onClick={generateAndSendPDF} className="bg-miracle-mediumBlue">
              //     <Mail />
              //     Send Mail
              //   </Button>
              //   <Button variant="destructive" onClick={handleCancelMail} className="bg-miracle-red">
              //     <X />
              //     Cancel
              //   </Button>
              // </div>
              <div className="flex space-x-2">
              <Button 
                onClick={generateAndSendPDF} 
                className="flex-1 bg-[#2368a0] hover:bg-[#1c5280] text-white"
                
              >
                 Send Mail
                <Mail className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleCancelMail} 
                variant="outline" 
                className="flex-1 bg-miracle-red text-white"
              >
                Cancel
                <XCircle className=" h-4 w-4" />
              </Button>
            </div>
            )}

            {/* {scannedData && (
            <PDFDownloadLink
              document={<MyDocument data={scannedData} />}
              fileName="scanned_qr_data.pdf"
            >
              {({ blob, url, loading, error }) => (
                <Button 
                  className="w-full bg-[#2368a0] hover:bg-[#1c5280] text-white"
                  disabled={loading}
                >
                  {loading ? 'Generating PDF...' : 'Download PDF'}
                  <FileDown className="ml-2 h-4 w-4" />
                </Button>
              )}
            </PDFDownloadLink>
          )} */}

            {/* {details.image !== '' && (
            <PDFDownloadLink
              document={<MyDocument data={details} />}
              fileName="certificate.pdf"
            >
              {({ blob, url, loading, error }) => {
                if (!loading && blob) {
                  sendPDFToBackend(blob);
                }
              }}
            </PDFDownloadLink>
          )} */}

            {/* {fetchingState.includes("fetching") ? (
            <div className="text-blue-600 bg-blue-300 flex p-2 items-center justify-center rounded-md">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching
              details...
            </div>
          ) : null}
          {fetchingState.includes("sending") ? (
            <div className="text-blue-600 bg-blue-300 flex p-2 items-center justify-center rounded-md">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Mail...
            </div>
          ) : null} */}
          </CardContent>
          <CardFooter className="absolute bottom-0 p-2 w-full left-0"><div className="w-full flex items-center justify-center">
              Made with ❤️ at Miracle Labs
            </div>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
