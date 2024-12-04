import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2,Upload,QrCodeIcon, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QRCodeSVG } from "qrcode.react";
import API from "@/services/API";
import { ToastContainer, toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import miracleLogo from '../assets/miracle.png'

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),   
  event: z.string().refine((val) => val !== "",{message : "Please select an event"}), 
  email: z.string().email("Invalid email address"), 
});

export default function QrGenerate() {
  const [formData, setFormData] = useState({
    name: "",
    event: "",
    email: "",
    image: "",
  });
  const [qrCodeData, setQRCodeData] = useState("");
  const fileInputRef = useRef(null);
  const [isLoading,setIsLoading] = useState(false)
  const [errors,setErrors] = useState({})
  const [showQr,setShowQr] = useState(false)
  const events = [
    "Hands-On with Google AI Studio: From Gemini Models to Advanced Prompting",
    "Integrating Gemini APIs with Python and Building a Chatbot App with Streamlit/Chainlit UI",
    "Building Conversational Chatbots with Dialogflow CX",
    "Building a Custom Search Engine with Google Programmable Search API",
    "Building a Real-Time Live Chat Application with Socket.IO and MERN Stack",
    "Custom Vision AI Object Detection for CAD Images using Azure Service",
    "Deploying Applications Using Jenkins CICD Pipelines",
    "Building a MERN Stack Web App: From CRUD APIs to React Integration"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors({...errors,[name] : null})
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setErrors({...errors,event : null})
    setFormData((prev) => ({ ...prev, event: value }));
  };


  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    console.log(file.type)
    if (file && file.type.includes("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
    else{
      toast.error("Select Image only")
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToValidate = {
      name: formData.name,
      event: formData.event,
      email: formData.email,
    };
    try {
      setErrors({})
      setIsLoading(true);
      registerSchema.parse(formDataToValidate);
      const result = await API.post.register(formData);
      console.log(result);
      let { image, ...rest } = formData;
      const dataString = JSON.stringify(rest);
      setQRCodeData(dataString);
      setFormData({
        name: "",
        event: "",
        email: "",
        image: "",
      })
      setShowQr(true);
    } catch (err) {
      if(err instanceof z.ZodError){
        const formattedErrors = err.errors.reduce((acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
  
        setErrors(formattedErrors);  
        console.error("Validation failed:", formattedErrors);
      }
      else if(err.response && err.response.status === 409){
        toast.error("User already registered");
      }
      else{
          toast.error("Failed to generate QR");
      }
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex md:items-center md:justify-center">
      <ToastContainer />
      <Card className={`w-full relative max-w-md rounded-xl h-full border-0 shadow-none overflow-hidden`}>
        <CardHeader className="text-white rounded-t-xl mt-3 p-2 md:mt-0">
          <div className="text-center mb-5 flex justify-center"><img src={miracleLogo} width={150} alt="miracle" /></div>
          
          <CardTitle className="text-2xl font-bold text-center text-miracle-darkBlue">
            Digital Summit 2024 Certificate Registration
          </CardTitle>
        </CardHeader>
        <div className={`flex transition-transform duration-500 ease-in-out min-w-full ${showQr ? "-translate-x-full" : "translate-x-0"}`}>
        <CardContent className={`md:px-4 p-2 min-w-full mt-5`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  
                  className="border-gray-300 focus:border-[#00aae7] focus:ring-[#00aae7]"
                />
                {errors.name && <p className="text-miracle-red text-sm">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-[#00aae7] focus:ring-[#00aae7]"
                />
                {errors.email && <p className="text-miracle-red text-sm">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo" className="text-gray-700">
                  Hands-On
                </Label>
                <Select
                  value={formData.event}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger
                    id="event"
                    className="border-gray-300 focus:border-[#00aae7] focus:ring-[#00aae7]"
                  >
                    <SelectValue placeholder="Select a Hands-On Session" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      events.map((event,indx) => <SelectItem key={indx} value={event}>{event}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
                {errors.event && <p className="text-miracle-red text-sm">{errors.event}</p>}
              </div>

              {
                isLoading
                ? <Button className="w-full bg-miracle-darkBlue hover:bg-miracle-darkBlue" disabled>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Generating...
                  </Button>
                : <Button
                    type="submit"
                    className="w-full bg-[#0d416b] hover:bg-miracle-darkBlue/90 text-white"
                  >
                    <QrCodeIcon className="h-5 w-5 font-bold" /> Generate QR Code
                  </Button>
              }
              
            </form>
        </CardContent>
        <CardContent className="md:px-4 p-2 min-w-full">
          {qrCodeData && (
            <div className="w-full h-[400px] flex flex-col justify-center items-center">
              <QRCodeSVG
                value={qrCodeData}
                size={200}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#232527"
              />
              <p className="text-center p-1 mt-2 text-miracle-darkGrey font-semibold text-sm">Please Save this QR code and get it scanned by the event coordinator to recieve the participation certificate.</p>
            </div>
          )}
          <div onClick={() => setShowQr(false)} className="flex justify-center items-center text-white bg-miracle-darkBlue w-[180px] py-1 px-2 rounded-lg mx-auto">
            <ArrowLeft className="mr-1 h-5 w-5" /> Back
          </div>
        </CardContent>
        </div>

        <div className="w-full flex items-center justify-center text-sm text-gray-500 absolute bottom-0">
          Made with ❤️ at Miracle Labs
        </div>
      </Card>
    </div>
  );
}
