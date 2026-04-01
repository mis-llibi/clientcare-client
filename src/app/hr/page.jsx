"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useHr } from "@/hooks/useHrRequest";
import { useHrAuth } from "@/hooks/useHrAuth";

import axios from "@/lib/axios";
import Swal from "sweetalert2";
import HrFilesModal from "@/app/hr/HrFilesModal";
import Link from "next/link";
import Header from "@/components/Hr/Header";

export default function HrPage() {
  const { user, logout } = useHrAuth({ middleware: "auth" });
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const [searchStatus, setSearchStatus] = useState();
  const [page, setPage] = useState(1);
  const [request, setRequest] = useState();
  const [timer, setTimer] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [filesModalData, setFilesModalData] = useState([]);
  const [filesModalRow, setFilesModalRow] = useState(null);

  const { clients, pagination, searchRequest, updateRequestApproval, viewBy } =
    useHr({
      name: name,
      status: searchStatus,
      page: page,
    });

  const statusOptions = [
    { value: "", label: "Default = Pending" },
    { value: 12, label: "Pending" },
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setLoading(true);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        setName(value);
        setPage(1);
      }, 1000),
    );
    setLoading(false);
  };

  const handleStatusChange = (e) => {
    setSearchStatus(e.target.value || undefined);
    setPage(1);
  };

  useEffect(() => {
    setLoading(true);
    searchRequest({
      setRequest,
      setLoading,
      name: name,
      status: searchStatus,
    });
    setLoading(false);
  }, [name, searchStatus]);

  const view = async (row) => {
    try {
      const response = await viewBy(row, "view");
      if (!response.status) return;
      setSelectedRow(row);
      setShowForm(true);
    } catch (error) {
      throw error;
    }
  };

  const handleHrApprove = (row) => {
    Swal.fire({
      title: "Approve this request?",
      text: "This will process the LOA based on the company's configuration.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Approve",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        Swal.fire({
          title: "Processing...",
          text: "Please wait while we process your request.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading(),
        });
        updateRequestApproval({
          setRequest: () => {},
          setClient: () => {},
          setLoading,
          id: row.id,
          status: 13,
        });
      }
    });
  };

  const handleHrDisapprove = (row) => {
    Swal.fire({
      title: "Disapprove this request?",
      text: "This will mark the request as disapproved and notify the patient.",
      icon: "warning",
      input: "textarea",
      inputPlaceholder: "Enter your remarks here...",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Disapprove",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        Swal.fire({
          title: "Processing...",
          text: "Please wait while we process the request.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading(),
        });
        updateRequestApproval({
          setRequest: () => {},
          setClient: () => {},
          setLoading,
          id: row.id,
          status: 14,
          disapproveRemarks: result.value || "",
        });
      }
    });
  };

  const handleViewFiles = async (row) => {
    try {
      const res = await axios.get(`/api/hr/get-files/${row.id}`);
      setFilesModalData(res.data.attachment || []);
      setFilesModalRow(row);
      setShowFilesModal(true);
    } catch (error) {
      throw error;
    }
  };

  const closeFilesModal = () => {
    setShowFilesModal(false);
    setFilesModalData([]);
    setFilesModalRow(null);
  };

  const formatMinutes = (minutes) => {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;

    let result = [];
    if (days > 0) result.push(`${days} ${days === 1 ? "day" : "days"}`);
    if (hours > 0) result.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    if (mins > 0 || result.length === 0)
      result.push(`${mins} ${mins === 1 ? "minute" : "minutes"}`);
    return result.join(" ");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 roboto">
      <div className="py-10">
        <div className="max-w-full mx-auto sm:px-6 lg:px-8">
          <div className="p-6 bg-white border-b border-gray-300 shadow-sm sm:rounded-lg">
            {/* Main Header — logo + title + clock + user dropdown */}
            <Header 
              logout={logout}
              user={user}
            />

            {/* Search Form */}
            <div className="flex gap-2 mb-4">
              <div className="basis-1/3">
                <label className="block text-blue-500 font-bold text-sm mb-1">
                  Patient Name / Member ID
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Search for patient's name or member ID"
                  onChange={handleSearch}
                />
              </div>
              <div className="basis-1/3">
                <label className="block text-blue-500 font-bold text-sm mb-1">
                  Request Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  onChange={handleStatusChange}
                >
                  {statusOptions.map((opt, i) => (
                    <option key={i} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="basis-1/3 flex items-center pl-5">
                {loading && (
                  <span className="text-blue-500 text-sm">Loading...</span>
                )}
              </div>
              <div className="flex basis-1/4 items-center justify-end">
                <a
                  className="text-blue-700 font-bold self-center capitalize  border border-gray-300 px-3 py-2 rounded-md text-xs"
                  href={"https://corporate.llibi.com"}
                  target='_blank'
                  >
                  Issue LOA
                </a>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
              <table className="table-auto w-full min-w-[800px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-center text-sm">
                      Patient&apos;s Name
                    </th>
                    <th className="border border-gray-300 p-2 text-center text-sm">
                      Chief Complaints
                    </th>
                    <th className="border border-gray-300 p-2 text-center text-sm">
                      Hospital
                    </th>
                    <th className="border border-gray-300 p-2 text-center text-sm">
                      LOA Type
                    </th>
                    <th className="border border-gray-300 p-2 text-center text-sm">
                      Status
                    </th>
                    <th className="border border-gray-300 p-2 text-center text-sm">
                      D/T Created
                    </th>
                    <th className="border border-gray-300 p-2 text-center text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {clients?.length > 0 ? (
                    clients?.map((row, i) => (
                      <tr
                        key={i}
                        className={`${row.status === 12 && "bg-orange-50"} ${
                          (row.follow_up_request_quantity === 1 &&
                            "ring-2 ring-inset ring-red-500/30 relative") ||
                          (row.follow_up_request_quantity === 2 &&
                            "ring-2 ring-inset ring-red-500/60 relative") ||
                          (row.follow_up_request_quantity >= 3 &&
                            "ring-2 ring-inset ring-red-500 relative") ||
                          ""
                        }`}
                      >
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {row.isDependent
                            ? `${row.depLastName}, ${row.depFirstName}`
                            : row.isDependent === null &&
                                row.lastName === null &&
                                row.firstName === null
                              ? "-"
                              : `${row.lastName}, ${row.firstName}`}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {row.complaint || "-"}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {row.providerName?.split("++")[0] || "-"}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {row.loaType?.toUpperCase() ?? "-"}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {row.status === 12 && "Pending"}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {row.createdAt}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          <div className="flex flex-col gap-2 h-full justify-center">
                            {row.status === 12 ? (
                              <>
                                {row.loaType === "laboratory" && (
                                  <button
                                    className="text-xs text-white px-2 py-1 rounded-sm cursor-pointer bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:outline-none"
                                    onClick={() => handleViewFiles(row)}
                                  >
                                    View Lab Request
                                  </button>
                                )}
                                <button
                                  className="text-xs text-white px-2 py-1 rounded-sm cursor-pointer bg-green-600 hover:bg-green-500 active:bg-green-700 focus:outline-none"
                                  onClick={() => handleHrApprove(row)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="text-xs text-white px-2 py-1 rounded-sm cursor-pointer bg-red-600 hover:bg-red-500 active:bg-red-700 focus:outline-none"
                                  onClick={() => handleHrDisapprove(row)}
                                >
                                  Disapprove
                                </button>
                              </>
                            ) : (
                              <button
                                className="relative text-xs text-white px-2 py-1 rounded-sm cursor-pointer bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none"
                                onClick={() => view(row)}
                              >
                                VIEW
                                {row.provider_remarks && (
                                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white z-10">
                                    !
                                  </span>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="text-center border bg-red-50 p-2 font-semibold"
                        colSpan={14}
                      >
                        No patient found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{pagination.from}</span>{" "}
                  to <span className="font-medium">{pagination.to}</span> of{" "}
                  <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="self-center px-2 text-gray-600 text-sm">
                    Page {page} of {pagination.last_page}
                  </span>
                  <button
                    type="button"
                    disabled={page === pagination.last_page}
                    onClick={() => setPage(page + 1)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      page === pagination.last_page
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Files Modal */}
      {showFilesModal && filesModalRow && (
        <HrFilesModal
          row={filesModalRow}
          attachments={filesModalData}
          onClose={closeFilesModal}
        />
      )}
    </div>
  );
}
