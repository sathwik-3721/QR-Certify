import React,{useState} from 'react'
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    PDFViewer,
    Font
  } from "@react-pdf/renderer";
  import certificateImage from '../assets/certificate-bg2.png'
  import RobotoMedium from '../fonts/Roboto-Medium.ttf'
  import RobotoRegular from '../fonts/Roboto-Regular.ttf'

  Font.register({
    family: 'RobotoMedium',
    src : RobotoMedium
  })

  Font.register({
    family: 'RobotoRegular',
    src : RobotoRegular
  })
 
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
  
  // Create Document Component
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

export default function CertificatePdf() {
    const initialState = {
        _id: "1",
        name: "Revathipathi Lanka",
        email: "Revanth@gmail.com",
        event: "Hands on",
        image: "",
        issued : "yes"
      }
      const [details, setDetails] = useState(initialState);
  return (
    <div className='border border-black'>

        <PDFViewer className='h-screen w-screen' >
                <MyDocument data={details} />
        </PDFViewer>
    </div>
  )
}
