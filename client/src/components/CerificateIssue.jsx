import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2,MailIcon,ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
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
import * as z from "zod";
import miracleLogo from '../assets/miracle.png'
import UserQrCodeReader from "./UserQrCodeReader";
import { useToast } from "@/hooks/use-toast";
import userLogo from '../assets/user.png'
import API from "@/services/API";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),   
  event: z.string().refine((val) => val !== "",{message : "Please select an event"}), 
  email: z.string().email("Invalid email address"), 
});

export default function CerificateIssue() {
  const [formData, setFormData] = useState({
    name: "",
    event: "",
    email: "",
  });
  const [isLoading,setIsLoading] = useState(false)
  const [errors,setErrors] = useState({})
  const [showDetails,setShowDetails] = useState(false)
  const { toast } = useToast();

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

  const handleSelectChange = (value) => {
    setErrors({...errors,event : null})
    setFormData((prev) => ({ ...prev, event: value }));
  };

  const handleUserData = (data) => {
    setFormData((prev) => ({ ...prev, name: data.FirstName+" "+data.LastName,email : data.Email }))
  }

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
      setShowDetails(true);
    } catch (err) {
      if(err instanceof z.ZodError){
        const formattedErrors = err.errors.reduce((acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
  
        setErrors(formattedErrors);  
        console.error("Validation failed:", formattedErrors);
      }
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
        name: "",
        event: "",
        email: "",
      })
    setShowDetails(false)
  }

  const sendPDFToBackend = async () => {
    try {
        setIsLoading(true);
        console.log(formData)
        await API.post.sendCertificate(formData);
        toast({
            title: "Mail sent successfully",
            duration: 2000,
          });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Failed to send Mail",
        duration: 2000,
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    formData.name === ""
    ? <UserQrCodeReader handleUserData={handleUserData} />
    : <div className="h-full flex md:items-center md:justify-center">
      <Card className={`w-full relative max-w-md rounded-xl h-full border-0 shadow-none overflow-hidden`}>
        <CardHeader className="text-white rounded-t-xl mt-3 p-2 md:mt-0">
          <div className="text-center mb-5 flex justify-center"><img src={miracleLogo} width={150} alt="miracle" /></div>
          
          <CardTitle className="text-2xl font-bold text-center text-miracle-darkBlue">
            Digital Summit 2024 Certificate Registration
          </CardTitle>
        </CardHeader>
        <div className={`flex transition-transform duration-500 ease-in-out min-w-full ${showDetails ? "-translate-x-full" : "translate-x-0"}`}>
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
                  disabled
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
                  disabled
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
              
              <Button className="w-full bg-miracle-darkBlue hover:bg-miracle-darkBlue">
                    
                    Submit
              </Button>
              
            </form>
        </CardContent>
        <CardContent className="space-y-4 p-0 min-w-full">

            {formData.email !== "" && (
            <div className="flex flex-col justify-center h-[350px] px-1">
                <div className="flex justify-center items-center">
                <img
                    src={userLogo}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full border-4 border-[#00aae7]"
                />
                </div>
                <div className="mt-2">
                <p className="text-center text-lg font-bold">{formData.name.charAt(0).toLocaleUpperCase() + formData.name.substring(1)}</p>
                <p className="text-center mt-1">{formData.email}</p>
                {/* <p className="text-center mt-1">{details.email.substring(0,details.email.lastIndexOf('@')).length > 13 ? details.email.substring(0,5) + "***" + details.email.substring(details.email.lastIndexOf('@') - 5) : details.email}</p> */}
                <p className="text-center mt-2 text-gray-400 font-bold">{formData.event}</p>
                {/* {details.issued && <p className="text-green-700 font-semibold text-center mt-2">Certificate Issued</p>} */}
                
                </div>
                
            </div>
            )}
                <div className="px-2">
            {
                isLoading ? 
                <Button className="bg-miracle-darkBlue hover:bg-miracle-darkBlue w-full" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    sending...
                </Button>
                :
                <>
                <Button 
                onClick={sendPDFToBackend} 
                className="bg-[#2368a0] hover:bg-[#1c5280] text-white w-full mb-2"
                >
                    <MailIcon className="h-4 w-4" /> Send Mail
                </Button>

                <Button 
                onClick={handleClose}
                className="bg-miracle-red hover:bg-miracle-red/90 text-white w-full"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                </>
                

            }
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
