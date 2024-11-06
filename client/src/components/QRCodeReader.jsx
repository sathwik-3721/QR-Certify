import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, AlertCircle, LogOut, Mail, X } from "lucide-react";
import pic from "../assets/react.svg";
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

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 50,
  },
  header: {
    textAlign: "center",
    fontSize: 30,
    marginBottom: 20,
    fontWeight: "bold",
  },
  certificateText: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 40,
    fontStyle: "italic",
  },
  section: {
    textAlign: "center",
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    marginBottom: 5,
  },
  imageContainer: {
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    margin: "0 auto",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 30,
    borderTop: "1px solid #000",
    paddingTop: 10,
  },
});

const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.header}>Certificate of Participation</Text>
        <Text style={styles.certificateText}>This is to certify that</Text>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.certificateText}>
          has successfully participated in the event "{data.event}"
        </Text>

        <View style={styles.imageContainer}>
          {data.image ? (
            <Image style={styles.image} src={data.image} />
          ) : (
            <Text>No image available</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.details}>Email: {data.email}</Text>
          <Text style={styles.details}>Event: {data.event}</Text>
          <Text style={styles.details}>
            Date: {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your participation!</Text>
          <Text>Organization Name</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default function QRCodeReader({ setAuthenticated }) {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [fetchingState, setFetchingState] = useState("idle");
  const [details, setDetails] = useState({
    _id: "",
    name: "",
    email: "",
    event: "",
    image: "",
  });

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
  };

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
      setDetails(result);
    } catch (err) {
      console.log(err);
      toast.error("Error while fechin details");
    }
    finally{
      setFetchingState("fetched");
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
        toast.success("Mail sent successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to send mail");
    } finally {
      setFetchingState("");
    }
  };

  const startScanning = async () => {
    setError(null);
    setScannedData(null);
    setIsScanning(true);
    setFetchingState("");
    setDetails({
      _id: "",
      name: "",
      email: "",
      event: "",
      image: "",
    });

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
          highlightScanRegion: true,
          highlightCodeOutline: true,
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md py-4 2xl:px-8 p-2 flex justify-end">
        <LogOut
          onClick={handleLogout}
          className="h-4 w-4 mr-2 cursor-pointer"
        />
      </header>
      <ToastContainer />
      <div className="px-2 md:items-center md:justify-center flex justify-center">
        <Card className="w-full max-w-md mt-5 h-fit pb-2 md:pb-0 rounded-xl">
          <CardHeader className="bg-[#00aae7] text-white rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-center">
              QR Code Reader
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:p-4 p-2">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden h-[300px] w-full md:w-full md:h-[400px]">
              <video ref={videoRef} className="w-full h-full object-cover" />
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Camera className="w-16 h-16 text-white opacity-50" />
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}


            {details.email != "" && (
              <div className="flex justify-between">
                <div className="text-sm">
                  <h2 className="font-semibold">User Details</h2>
                  <p>Name: Revanth</p>
                  <p>Email: revanth@gmail.com</p>
                  <p>Demo: demo</p>
                </div>
                <div className="flex justify-center">
                  <img
                    src={details.image}
                    alt="Profile"
                    className="w-20 h-20 object-cover rounded-full border-4 border-[#00aae7]"
                  />
                </div>
              </div>
            )}

            {fetchingState.includes() ? (
              <Button
                onClick={isScanning ? stopScanning : startScanning}
                className="w-full bg-[#00aae7] hover:bg-[#0088b9] text-white"
                disabled={fetchingState !== ""}
              >
                {isScanning
                  ? "Stop Scanning"
                  : fetchingState.includes("fetching")
                  ? "Fetching Details..."
                  : fetchingState.includes("sending")
                  ? "Sending Mail..."
                  : "Start Scanning"}
              </Button>
            ) : (
              <div className="flex justify-between">
                <Button className="bg-green-600">
                  <Mail onClick={generateAndSendPDF}/>
                  Send Mail
                </Button>
                <Button variant="destructive" className="">
                  <X />
                  Cancel
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
        </Card>
      </div>
    </div>
  );
}
