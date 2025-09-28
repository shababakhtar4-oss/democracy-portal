import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, UploadCloud } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { apiRequest } from "@/lib/utils";

const fieldOptions = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "gender", label: "gender" },
  { key: "boothAddress", label: "Booth Address" },
  { key: "houseNo", label: "House Number" },
  { key: "mobileNumber", label: "Mobile Number" },
  { key: "relatedTo", label: "Related To" },
  { key: "partNo", label: "PartNo" },
  { key: "city", label: "City" },
  { key: "voterIdNumber", label: "Voter Id" },
];

const SettingsPage = () => {
  const [checkedFields, setCheckedFields] = useState<Record<string, boolean>>(
    () =>
      fieldOptions.reduce((acc, field) => {
        acc[field.key] = true; // default: all checked
        return acc;
      }, {} as Record<string, boolean>)
  );
  const [image, setImage] = useState<string | null>(null);

  const handleCheckboxChange = (key: string) => {
    setCheckedFields((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
   localStorage.setItem("visibleFields", JSON.stringify(checkedFields));
  try {
    const userData = localStorage.getItem("user");
    const token = userData ? JSON.parse(userData).token : null;
    const activationCode = userData ? JSON.parse(userData).activationCode : "";

    // Get the image file if present
    const fileInput = document.getElementById("profile-image-upload") as HTMLInputElement;
    const imageFile = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

    const formData = new FormData();
    if (imageFile) {
      formData.append("file", imageFile);
    }
    formData.append("activationCode", activationCode);
    formData.append("config", JSON.stringify(checkedFields));

    await fetch(
      "https://pollingservice-addeehfvcxafffb5.centralindia-01.azurewebsites.net/api/config",
      {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              // Do not set Content-Type for FormData
            }
          : undefined,
        body: formData,
      }
    );
    alert("Settings saved and sent to server!");
  } catch (error) {
    alert("Failed to save settings to server.");
  }
};


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DetailPageLayout title="Settings">
      <div className="space-y-6">
        {/* Upload Image Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-civic-primary">
              <UploadCloud className="h-5 w-5 mr-2" />
              Upload Banner Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                id="profile-image-upload"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Button
                type="button"
                onClick={() =>
                  document.getElementById("profile-image-upload")?.click()
                }
                variant="outline"
              >
                Choose Image
              </Button>
              {image && (
                <img
                  src={image}
                  alt="Banner Preview"
                  className="h-24 w-auto rounded border"
                  style={{ objectFit: "contain", background: "#f3f3f3" }}
                 />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="shadow-card">
           <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center text-civic-primary">
        <Globe className="h-5 w-5 mr-2" />
        Display Settings
      </CardTitle>
      <Button
        type="button"
        className="ml-auto"
        onClick={handleSave}
        variant="default"
      >
        Save Settings
      </Button>
    </div>
  </CardHeader>
          <CardContent>
    <form className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {fieldOptions.map((field) => (
          <div
            key={field.key}
            className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-gray-50 border border-gray-200"
          >
            <Checkbox
              id={field.key}
              checked={checkedFields[field.key]}
              onCheckedChange={() => handleCheckboxChange(field.key)}
              className="w-6 h-6 rounded-sm border-gray-400 data-[state=checked]:bg-civic-primary"
            />
            <Label htmlFor={field.key} className="text-center text-sm font-medium">
              {field.label}
            </Label>
          </div>
        ))}
      </div>
    </form>
  </CardContent>
        </Card>
      </div>
    </DetailPageLayout>
  );
};

export default SettingsPage;
