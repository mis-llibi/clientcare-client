"use client";
import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Controller } from "react-hook-form";

export default function FileUpload({
  control,
  name,
  required,
  multiple = false,
  className = "",
}) {
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
        required: required,
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const handleNewFiles = (newFiles) => {
          if (!newFiles) return;
          const newFilesArray = Array.from(newFiles);

          if (multiple) {
            // Cumulative logic: combine existing value (if any) with new files
            const existingFiles = Array.isArray(value)
              ? value
              : value
                ? Array.from(value)
                : [];
            onChange([...existingFiles, ...newFilesArray]);
          } else {
            // Single file logic: replace
            onChange(newFilesArray);
          }
        };

        return (
          <>
            <label
              htmlFor="file-upload"
              className={`w-full ${
                className || "max-w-md"
              } p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition cursor-pointer roboto ${
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
                  handleNewFiles(e.dataTransfer.files);
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
                multiple={multiple}
                accept="image/*,application/pdf"
                onChange={(e) => handleNewFiles(e.target.files)}
              />
            </label>

            {error && (
              <p className="text-red-800 text-sm font-semibold roboto">
                {error.message}
              </p>
            )}
          </>
        );
      }}
    />
  );
}
