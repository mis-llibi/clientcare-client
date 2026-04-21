import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const FilesCheckSummaryModal = ({
  open,
  onOpenChange,
  hasMissing,
  uploadedReqs,
  missingReqs,
  files,
  formDataToSubmit,
  onNext,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="sm:max-w-3xl w-full max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <DialogTitle className="text-[#1E3161] font-bold text-xl roboto pb-0 mb-0">
            Files Check Summary
          </DialogTitle>
          <DialogDescription className="sr-only">
            Summary of uploaded file requirements
          </DialogDescription>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto bg-gray-50/50 block">
          <div className="p-6 pt-5">
            <p className="text-gray-600 text-sm mb-6 roboto">
              {hasMissing
                ? "Some required documents are still missing. Review the uploaded files below and proceed only if you want to submit anyway."
                : "All requirement rows have uploaded files. Review the uploaded files below before submitting your claim."}
            </p>

            <div className="space-y-6">
              {uploadedReqs.length > 0 && (
                <div className="border border-blue-100 rounded-xl bg-white shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-blue-50/50">
                    <h4 className="font-bold text-[#1E3161] text-sm roboto">
                      Files Uploaded
                    </h4>
                  </div>
                  <div className="p-4">
                    {uploadedReqs.map((req, idx) => (
                      <div
                        key={idx}
                        className={
                          idx > 0 ? "pt-4 mt-4 border-t border-gray-100" : ""
                        }
                      >
                        <p className="font-bold text-gray-800 text-[13px] roboto mb-1">
                          {req}
                        </p>
                        {files[req].map((f, i) => (
                          <p
                            key={i}
                            className="text-gray-500 text-[13px] roboto"
                          >
                            {f.name}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasMissing && (
                <div className="border border-red-200 rounded-xl bg-white shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-red-50/50">
                    <h4 className="font-bold text-[#b91c1c] text-sm roboto">
                      Files Not Uploaded
                    </h4>
                  </div>
                  <div className="p-4">
                    {missingReqs.map((req, idx) => (
                      <div
                        key={idx}
                        className={
                          idx > 0 ? "pt-4 mt-4 border-t border-gray-100" : ""
                        }
                      >
                        <p className="font-bold text-gray-800 text-[13px] roboto">
                          {req}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-6 py-2.5 rounded-lg bg-[#1E3161] text-white font-bold hover:bg-blue-900 transition-all roboto cursor-pointer"
          >
            {hasMissing ? "Go Back" : "Cancel"}
          </button>
          <button
            onClick={() => {
              onOpenChange(false);
              onNext(formDataToSubmit);
            }}
            className="px-6 py-2.5 rounded-lg bg-[#1E3161] text-white font-bold hover:bg-blue-900 transition-all roboto cursor-pointer"
          >
            {hasMissing ? "Proceed Anyway" : "Submit"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilesCheckSummaryModal;
