import React, { useState } from 'react'

import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    pdf,
    PDFViewer 
  } from "@react-pdf/renderer";


  import bgImg from '../assets/pdf-bg.jpg'
const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      position:"relative",

    },
    // imageContainer : {
    //     position: 'absolute',
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     bottom: 0,
    //     width: '100%',
    //     height: '700px',
    //     zIndex: -1, // Ensures it stays behind the text
    // },
    // image : {
    //     width: '100%',
    //     height: '100%',
    // },
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
              <Image style={styles.image} src={bgImg} />
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

export default function PdfTest() {
    const initialState = {
        _id: "1",
        name: "Revanth",
        email: "Revanth@gmail.com",
        event: "Hands on",
        image: "",
        issued : "yes"
      }
      const [details, setDetails] = useState(initialState);
  return (
    <div className='border border-black'>
        fhihi
        {/* <PDFViewer >
                <MyDocument data={details} />
        </PDFViewer> */}
    </div>
            

  )
}
