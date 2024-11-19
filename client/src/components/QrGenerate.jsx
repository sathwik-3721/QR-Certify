import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2,Upload,QrCodeIcon } from "lucide-react"
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, event: value }));
  };

  const handleConfirmMail = () => {
    
  }

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
      setIsLoading(true);
      registerSchema.parse(formDataToValidate);
      const result = await API.post.register(formData);
      console.log(result);
      let { image, ...rest } = formData;
      const dataString = JSON.stringify(rest);
      setQRCodeData(dataString);
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
    <div className="min-h-screen bg-gray-100 flex md:items-center md:justify-center">
      <ToastContainer />
      <Card className={`w-full max-w-md rounded-xl min-h-[630px] max-h-full md:min-h-full md:h-fit mt-3 mx-2 p-2`}>
        <CardHeader className="text-white rounded-t-xl p-2 mt-7 md:mt-0">
          <div className="text-center mb-5 flex justify-center"><img src={miracleLogo} width={100} alt="miracle" /></div>
         
          <CardTitle className="text-2xl font-bold text-center text-miracle-darkBlue">
            {qrCodeData ? "Save Generated QR Code" : "DS-2024 Certificate Registration" }
          </CardTitle>
        </CardHeader>
        <CardContent className="md:px-4 p-2">
          {qrCodeData ? (
            <div className="w-full h-[400px] flex justify-center items-center">
              <QRCodeSVG
                value={qrCodeData}
                size={200}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#232527"
              />
            </div>
          ) : (
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
                <Label htmlFor="confirm-email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="confirm-email"
                  name="confirm-email"
                  type="confirm-email"
                  value={formData.email}
                  onChange={handleConfirmMail}
                  className="border-gray-300 focus:border-[#00aae7] focus:ring-[#00aae7]"
                />
                {errors.email && <p className="text-miracle-red text-sm">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo" className="text-gray-700">
                  Event
                </Label>
                <Select
                  value={formData.event}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger
                    id="event"
                    className="border-gray-300 focus:border-[#00aae7] focus:ring-[#00aae7]"
                  >
                    <SelectValue placeholder="Select a event" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      events.map((event,indx) => <SelectItem key={indx} value={event}>{event}</SelectItem>)
                    }
                    {/* <SelectItem value="Tech Talks">Tech Talks</SelectItem>
                    <SelectItem value="Hands on">Hands on</SelectItem>
                    <SelectItem value="Demos">Demos</SelectItem>
                    <SelectItem value="Quiz">Quiz</SelectItem> */}
                  </SelectContent>
                </Select>
                {errors.event && <p className="text-miracle-red text-sm">{errors.event}</p>}
              </div>
              <div className="space-y-2">
                
                <Label htmlFor="image" className="text-gray-700">
                  Image
                </Label>
                {formData.image !== "" && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={formData.image}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-[#00aae7]"
                    />
                  </div>
                )}
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#ffffff] border border-gray-300 hover:bg-slate-100 text-black"
                >
                  <Upload className="h-5 w-5" />Upload Image
                </Button>
                {errors.image && <p className="text-miracle-red text-sm">{errors.image}</p>}
   
              </div>
              {
                isLoading
                ? <Button className="w-full bg-[#00aae7]" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                : <Button
                    type="submit"
                    className="w-full bg-[#0d416b] hover:bg-[#0d416b]/90 text-white"
                  >
                    <QrCodeIcon className="h-5 w-5 font-bold" /> Generate QR Code
                  </Button>
              }
              
            </form>
          )}
        </CardContent>
        <CardFooter className="pt-3">
        <div className="w-full flex items-center justify-center sm:mt-2">
          Made with ❤️ at Miracle Labs
        </div>
        </CardFooter>
      </Card>
    </div>
  );
}
