"use client";

export default function HrFilesModal({ row, attachments, onClose }) {


  const provider = row?.providerName?.split('++')
  const doctor = row?.doctorName?.split('++')


  const patientName = row.isDependent
    ? `${row.depLastName}, ${row.depFirstName}`
    : `${row.lastName}, ${row.firstName}`;
  const memberId = row.isDependent ? row.depMemberID : row.memberID;
  const dob = row.isDependent ? row.depDob : row.dob;

  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl flex flex-col"
        style={{ width: "90vw", height: "90vh", maxWidth: "1600px" }}
      >
        {/* Title bar */}
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="font-semibold text-md uppercase tracking-wide">
            {memberId} - {patientName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Laboratory attachments */}
          <div className="flex-1 overflow-y-auto p-6 border-r flex flex-col gap-4">
            <h3 className="text-center font-bold text-md tracking-widest">
              HEALTH ASSESSMENT (LABORATORY)
            </h3>

            <div>
              <p className="font-bold text-md mb-2">LABORATORY ATTACHMENT:</p>
              {attachments.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {attachments.map((file, i) => {
                    const isPdf = file.file_name
                      ?.toLowerCase()
                      .endsWith(".pdf");
                    return (
                      <a
                        key={i}
                        href={file.file_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center w-24 text-center"
                      >
                        {isPdf ? (
                          <div className="w-20 h-20 bg-black flex items-center justify-center rounded">
                            <svg
                              viewBox="0 0 24 24"
                              className="w-12 h-12 text-red-500"
                              fill="currentColor"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                              <text
                                x="6"
                                y="17"
                                fontSize="5"
                                fill="#ef4444"
                                fontWeight="bold"
                              >
                                PDF
                              </text>
                            </svg>
                          </div>
                        ) : (
                          <img
                            src={file.file_link}
                            alt={file.file_name}
                            className="w-20 h-20 object-cover rounded border"
                          />
                        )}
                        <span className="text-sm break-all mt-1 text-gray-700">
                          {file.file_name}
                        </span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-md text-center mt-10">
                  No attachments found.
                </p>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-[380px] shrink-0 overflow-y-auto p-4 text-md space-y-4">
            {/* Employee Details */}
            <div>
              <h3 className="text-center font-bold text-md mb-3 tracking-widest">
                EMPLOYEE DETAILS
              </h3>
              <p className="mb-1">
                <span className="font-bold">DATE/TIME CREATED: </span>
                <span className="text-blue-600">{row.createdAt}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">FULL NAME: </span>
                <span className="text-blue-600">{patientName}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">DATE OF BIRTH: </span>
                <span className="text-blue-600">{dob || "N/A"}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">MEMBER ID: </span>
                <span className="text-blue-600">{memberId || "N/A"}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">EMAIL: </span>
                <span className="text-blue-600">{row.email || "N/A"}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">ALT EMAIL: </span>
                <span className="text-blue-600">{row.altEmail || "N/A"}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">CONTACT #: </span>
                <span className="text-blue-600">{row.contact || "N/A"}</span>
              </p>
            </div>

            <hr />

            {/* Provider / Doctor */}
            <div>
              <h3 className="text-center font-bold text-md mb-3 tracking-widest">
                HEALTH ASSESSMENT (LABORATORY)
              </h3>
              <p className="mb-1">
                <span className="font-bold">HOSPITAL/CLINIC: </span>
                <span className="text-blue-600">{provider && provider[0] || "N/A"}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">ADDRESS: </span>
                <span className="text-blue-600">{provider && provider[1] || ""}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">CITY: </span>
                <span className="text-blue-600">{provider && provider[2] || ""}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">STATE: </span>
                <span className="text-blue-600">{provider && provider[3] || ""}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">DOCTOR NAME: </span>
                <span className="text-blue-600">{doctor && doctor[0] || ""}</span>
              </p>
              <p className="mb-1">
                <span className="font-bold">SPECIALIZATION: </span>
                <span className="text-blue-600">{doctor && doctor[1] || ""}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2">
          <button
            onClick={onClose}
            className="text-md font-bold text-gray-600 hover:text-gray-800 uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
