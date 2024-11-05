import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button'; 
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeSVG } from 'qrcode.react';
import API from '@/services/API';

export default function QrGenerate() {
  const [formData, setFormData] = useState({
    name: '',
    event: '',
    email: '',
    image: '',
  });
  const [qrCodeData, setQRCodeData] = useState('');
  const fileInputRef = useRef(null);
  const [error,setError] = useState(null);
  const [uploadedImage,setUploadedImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, event: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      // const data = createFormData();
      console.log(formData)
      const result = await API.post.register(formData);
      console.log(result)
      setUploadedImage(result.newQr.image);
      // setImgUrl(result.newQr.image.data)
      let { image, ...rest } = formData;
      const dataString = JSON.stringify(rest);
      setQRCodeData(dataString);
    }
    catch(err){
      setError(err)
      console.log(err)
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-[#00aae7] text-white">
          <CardTitle className="text-2xl font-bold text-center">QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                className="border-gray-300 focus:border-[#00aae7] focus:ring-[#00aae7]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo" className="text-gray-700">Demo</Label>
              <Select 
                value={formData.event} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="event" className="border-gray-300 focus:border-[#00aae7] focus:ring-[#00aae7]">
                  <SelectValue placeholder="Select a event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tech Talks">Tech Talks</SelectItem>
                  <SelectItem value="Hands on">Hands on</SelectItem>
                  <SelectItem value="Demos">Demos</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                className="border-gray-300 focus:border-[#00aae7] focus:ring-[#00aae7]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePicture" className="text-gray-700">Profile Picture</Label>
              <Input 
                id="profilePicture" 
                name="profilePicture" 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <Button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[#2368a0] hover:bg-[#1c5280] text-white"
              >
                Upload Profile Picture
              </Button>
              {formData.image !== '' && (
                <div className="mt-2 flex justify-center">
                  <img 
                    src={formData.image} 
                    alt="Profile" 
                    className="w-32 h-32 object-cover rounded-full border-4 border-[#00aae7]"
                  />
                </div>
              )}
            </div>
            <Button type="submit" className="w-full bg-[#00aae7] hover:bg-[#0088b9] text-white">
              Generate QR Code
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {qrCodeData && (
            <div className="mt-4">
              <QRCodeSVG 
                value={qrCodeData} 
                size={200} 
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#00aae7"
              />
            </div>
          )}
          {
            error && <p className='text-red-500'>Error sending data</p>
          }
        </CardFooter>
      </Card>
    </div>
  );
}
