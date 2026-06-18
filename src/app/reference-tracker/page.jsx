"use client";

import React, { useState } from "react";
import { Search, FileText, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import axios from "@/lib/axios";

export default function Page() {
  const [referenceNo, setReferenceNo] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const handleSearch = async () => {
    if (!referenceNo.trim()) return;

    setLoading(true);
    setSearched(false);
    setResults([]);

    const normalizedReferenceNo = referenceNo.trim().toLowerCase();

    try {
      await csrf();

      const res = await axios.post("/api/reference-tracker", {
        reference: normalizedReferenceNo,
      });

      if (res.status === 200) {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setResults(data);
      }
    } catch (error) {
      console.log(error);
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const getStatusStyle = (status) => {
    const value = Number(status);

    if (value === 3 || value === 13) {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (value === 2 || value === 12) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    if (value === 4 || value === 14) {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusText = (status) => {
    const value = Number(status);

    if (value === 3 || value === 13) return "APPROVED";
    if (value === 4 || value === 14) return "DISAPPROVED";
    if (value === 2 || value === 12) return "PENDING";

    return "AUTO LOA";
  };

  const normalizedString = (str) => {
    if (!str) return "-";

    return String(str).split("++")[0] || "-";
  };

  const getFullName = (firstName, lastName) => {
    const first = firstName ? String(firstName).toUpperCase() : "";
    const last = lastName ? String(lastName).toUpperCase() : "";

    return `${first} ${last}`.trim() || "-";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E3161] to-[#2f4b8a] p-5 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">
                Search Reference
              </p>

              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Reference Number Tracker
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                Enter a reference number to view employee details, patient
                details, LOA number, hospital, company, and current status.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <FileText className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Enter reference number"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#1E3161] focus:ring-4 focus:ring-[#1E3161]/10"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || referenceNo.trim() === ""}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1E3161] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17264d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Search Result
              </h2>
              <p className="text-sm text-slate-500">
                Reference information will appear below.
              </p>
            </div>

            {searched && (
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Desktop / Tablet Table */}
          <div className="hidden md:block">
            <div className="max-h-[65vh] overflow-auto">
              <table className="min-w-[1100px] w-full text-left text-sm">
                <thead className="sticky top-0 z-10 bg-slate-100 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="whitespace-nowrap px-6 py-4">
                      Employee Name
                    </th>
                    <th className="whitespace-nowrap px-6 py-4">
                      Patient Name
                    </th>
                    <th className="whitespace-nowrap px-6 py-4">
                      LOA Number
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-center">
                      Status
                    </th>
                    <th className="whitespace-nowrap px-6 py-4">Hospital</th>
                    <th className="whitespace-nowrap px-6 py-4">Company</th>
                    <th className="whitespace-nowrap px-6 py-4">
                      Date Created
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {results.length > 0 ? (
                    results.map((item, index) => {
                      const clientRequest = item?.client_request;
                      const masterlist = clientRequest?.masterlist;

                      return (
                        <tr
                          key={index}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {getFullName(item?.first_name, item?.last_name)}
                          </td>

                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {item?.is_dependent
                              ? getFullName(
                                  item?.dependent_first_name,
                                  item?.dependent_last_name
                                )
                              : getFullName(item?.first_name, item?.last_name)}
                          </td>

                          <td className="px-6 py-4 font-medium text-slate-700">
                            {clientRequest?.loa_number || "-"}
                          </td>

                          <td className="px-6 py-4 text-center font-medium">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                item?.status
                              )}`}
                            >
                              {getStatusText(item?.status)}
                            </span>
                          </td>

                          <td className="px-6 py-4 font-medium text-slate-700">
                            {normalizedString(clientRequest?.provider)}
                          </td>

                          <td className="px-6 py-4 font-medium text-slate-700">
                            {masterlist?.company_name || "-"}
                          </td>

                          <td className="px-6 py-4 font-medium text-slate-700">
                            {clientRequest?.created_at
                              ? dayjs(clientRequest.created_at).format(
                                  "MMM D, YYYY h:mm:ss A"
                                )
                              : "-"}
                          </td>
                        </tr>
                      );
                    })
                  ) : searched ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No reference number found.
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        Search a reference number to view details.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 p-4 md:hidden">
            {results.length > 0 ? (
              results.map((item, index) => {
                const clientRequest = item?.client_request;
                const masterlist = clientRequest?.masterlist;

                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500">
                          Reference Number
                        </p>
                        <h3 className="break-words text-base font-bold text-slate-800">
                          {item?.reference_number || "-"}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          item?.status
                        )}`}
                      >
                        {getStatusText(item?.status)}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <InfoRow
                        label="Employee"
                        value={getFullName(item?.first_name, item?.last_name)}
                      />

                      <InfoRow
                        label="Patient"
                        value={
                          item?.is_dependent
                            ? getFullName(
                                item?.dependent_first_name,
                                item?.dependent_last_name
                              )
                            : getFullName(item?.first_name, item?.last_name)
                        }
                      />

                      <InfoRow
                        label="LOA Number"
                        value={clientRequest?.loa_number || "-"}
                      />

                      <InfoRow
                        label="Hospital"
                        value={normalizedString(clientRequest?.provider)}
                      />

                      <InfoRow
                        label="Company"
                        value={masterlist?.company_name || "-"}
                      />

                      <InfoRow
                        label="Date Created"
                        value={
                          clientRequest?.created_at
                            ? dayjs(clientRequest.created_at).format(
                                "MMM D, YYYY h:mm:ss A"
                              )
                            : "-"
                        }
                      />
                    </div>
                  </div>
                );
              })
            ) : searched ? (
              <EmptyState text="No reference number found." />
            ) : (
              <EmptyState text="Search a reference number to view details." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="break-words text-right font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}