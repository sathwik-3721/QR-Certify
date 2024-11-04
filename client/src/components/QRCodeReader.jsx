import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, AlertCircle, FileDown } from "lucide-react"
import QrScanner from 'qr-scanner'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  content: {
    fontSize: 12,
    marginBottom: 5,
  },
});

// PDF Document component
const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Scanned QR Code Data</Text>
        <Text style={styles.content}>Name: {data.name}</Text>
        <Text style={styles.content}>Email: {data.email}</Text>
        <Text style={styles.content}>Demo: {data.demo}</Text>
      </View>
    </Page>
  </Document>
);

export default function QRCodeReader() {
  const [scannedData, setScannedData] = useState(null)
  const [error, setError] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy()
      }
    }
  }, [])

  const startScanning = async () => {
    setError(null)
    setScannedData(null)
    setIsScanning(true)

    try {
      if (!videoRef.current) return

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          try {
            const parsedData = JSON.parse(result.data)
            setScannedData(parsedData)
          } catch (err) {
            setError('Invalid QR code data format')
          }
          setIsScanning(false)
          scannerRef.current?.stop()
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      )

      await scannerRef.current.start()
    } catch (err) {
      setError('Failed to start camera. Please ensure you have given camera permissions.')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop()
    }
    setIsScanning(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-[#00aae7] text-white">
          <CardTitle className="text-2xl font-bold text-center">QR Code Reader</CardTitle>
        </CardHeader>
        <CardContent className="mt-6 space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
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

          {scannedData && (
            <Alert>
              <AlertTitle>Scanned Data</AlertTitle>
              <AlertDescription>
                <p>Name: {scannedData.name}</p>
                <p>Email: {scannedData.email}</p>
                <p>Demo: {scannedData.demo}</p>
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={isScanning ? stopScanning : startScanning} 
            className="w-full bg-[#00aae7] hover:bg-[#0088b9] text-white"
          >
            {isScanning ? 'Stop Scanning' : 'Start Scanning'}
          </Button>

          {scannedData && (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}