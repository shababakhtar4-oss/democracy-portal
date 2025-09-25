import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, UploadCloud } from "lucide-react";
import { useState, ChangeEvent } from "react";

const fieldOptions = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "sex", label: "Sex" },
  { key: "boothAddress", label: "Booth Address" },
  { key: "houseNumber", label: "House Number" },
  { key: "mobileNumber", label: "Mobile Number" },
  { key: "relatedTo", label: "Related To" },
  { key: "area", label: "Area" },
  { key: "city", label: "City" },
  { key: "epicNumber", label: "EPIC Number" },
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

  const handleSave = () => {
    localStorage.setItem("visibleFields", JSON.stringify(checkedFields));
    alert("Settings saved!");
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
              Upload Profile Image
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
                  alt="Profile Preview"
                  className="h-16 w-16 rounded-full object-cover border"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-civic-primary">
              <Globe className="h-5 w-5 mr-2" />
              Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {fieldOptions.map((field) => (
                  <div key={field.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.key}
                      checked={checkedFields[field.key]}
                      onCheckedChange={() => handleCheckboxChange(field.key)}
                    />
                    <Label htmlFor={field.key}>{field.label}</Label>
                  </div>
                ))}
              </div>
              <Button type="button" className="mt-4" onClick={handleSave}>
                Save Settings
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DetailPageLayout>
  );
};

export default SettingsPage;