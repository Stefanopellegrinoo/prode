import { useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { X, Upload } from "lucide-react"

export default function UploadTeamLogo({ team, file, setFile }) {
    const [logoPreview, setLogoPreview] = useState(team?.logo || "");
 

    const handleLogoChange = (e) => {
        const newFile = e.target.files[0];
        if (!newFile) return;
      
        const allowedTypes = ["image/jpeg", "image/png"];
        const maxSizeMB = 2;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
      
        if (!allowedTypes.includes(newFile.type)) {
            alert("Solo se permiten imágenes JPG o PNG.");
          return;
        }
      
        if (newFile.size > maxSizeBytes) {
            alert(`La imagen no puede pesar más de ${maxSizeMB}MB.`);
          return;
        }
      
        const reader = new FileReader();
        reader.onload = () => {
          setLogoPreview(reader.result);
        };
        reader.readAsDataURL(newFile);
        setFile(newFile);
      };
      
  
    return (
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          {logoPreview ? (
            <img
              src={logoPreview || "/placeholder.svg"}
              alt="Logo Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <Upload className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
          <label
            htmlFor="logo"
            className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <Upload className="h-4 w-4 mr-2" />
            Subir Logo
          </label>
        </div>
      </div>
    );
  }
  