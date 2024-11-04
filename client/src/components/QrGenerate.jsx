import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button'; 
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeSVG } from 'qrcode.react';

export default function QrGenerate() {
  const [formData, setFormData] = useState({
    name: '',
    demo: 'demo1',
    email: '',
    profilePicture: null,
  });
  const [qrCodeData, setQRCodeData] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, demo: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let { profilePicture, ...rest } = formData;
    const dataString = JSON.stringify(rest);
    setQRCodeData(dataString);
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
                value={formData.demo} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="demo" className="border-gray-300 focus:border-[#00aae7] focus:ring-[#00aae7]">
                  <SelectValue placeholder="Select a demo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo1">Demo 1</SelectItem>
                  <SelectItem value="demo2">Demo 2</SelectItem>
                  <SelectItem value="demo3">Demo 3</SelectItem>
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
              {formData.profilePicture && (
                <div className="mt-2 flex justify-center">
                  <img 
                    src={formData.profilePicture} 
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
        </CardFooter>
      </Card>
    </div>
  );
}
