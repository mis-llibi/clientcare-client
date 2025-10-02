"use client";
import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Controller } from "react-hook-form";

export default function FileUpload({ control, name, required }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required
      }}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <>
          <label
            htmlFor="file-upload"
            className={`w-full max-w-md p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition cursor-pointer roboto ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                onChange(e.dataTransfer.files); // push files into RHF
              }
            }}
          >
            <FaCloudUploadAlt className="w-10 h-10 text-blue-900 mb-3" />

            <p className="mb-3 text-gray-700 roboto">
              Drag and Drop some files here, or click to choose files
            </p>

            <span className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition roboto">
              Choose files
            </span>

            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => onChange(e.target.files)}
            />
          </label>

          {error && (
            <p className="text-red-800 text-sm font-semibold roboto">{error.message}</p>
          )}
        </>
      )}
    />
  );
}
