'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { SyncLoader } from 'react-spinners';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ClientRequestDesktop } from '@/hooks/ClientRequestDesktop';
import Label from '@/components/Label';
import { toast } from 'sonner';
import Infographics from "@/assets/infographics-eloa.jpg";

function FindProviderDialog({ loaType, setSelectedHospital, setSelectedDoctor }) {
  const [open, setOpen] = useState(false);
  const [showInfographics, setShowInfographics] = useState(true);
  const [step, setStep] = useState(1); // 1 = hospital, 2 = doctor
  const [search, setSearch] = useState("");
  const [hosploading, setHosploading] = useState(false);
  const [hospital, setHospital] = useState([]);
  const [selectedHospitalIndex, setSelectedHospitalIndex] = useState(null);
  const [isAcceptEloa, setIsAcceptEloa] = useState(false);
  const [doctor, setDoctor] = useState([]);
  const [docloading, setDocloading] = useState(false);
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(null);
  const [timer, setTimer] = useState(null);

  const { searcHospital, searchDoctor } = ClientRequestDesktop();

  const resetStates = () => {
    setSearch("");
    setHosploading(false);
    setHospital([]);
    setSelectedHospitalIndex(null);
    setIsAcceptEloa(false);
    setDoctor([]);
    setDocloading(false);
    setSelectedDoctorIndex(null);
    setStep(1);
    setTimer(null);
  };

  const onSubmitHospital = () => {
    const chosenHospital = hospital?.[selectedHospitalIndex];
    if (!chosenHospital) {
      toast("Hospital or Clinic is required", { description: "You must choose a Hospital or Clinic to continue" });
      return;
    }
    setSelectedHospital(chosenHospital);

    if (loaType === "consultation") {
      // proceed to doctor selection
      setStep(2);
      setSearch("");
      setDoctor([]);
      setSelectedDoctorIndex(null);
    } else {
      // finish
      setOpen(false);
      resetStates();
    }
  };

  const onSubmitDoctor = () => {
    const chosenDoctor = doctor?.[selectedDoctorIndex] || null;
    setSelectedDoctor(chosenDoctor);
    setOpen(false);
    resetStates();
  };

  const handleEloaCheckbox = (e) => setIsAcceptEloa(e.target.checked);

  const onSearchHospital = (search) => {
    setSearch(search)
    setHosploading(true)
    if (timer) clearTimeout(timer)

    setTimer(
      setTimeout(() => {
        if (search)
          searcHospital({ search, accepteloa: isAcceptEloa, setHospital, setHosploading })
      }, 1000)
    )
  }

  const onSearchDoctor = (value) => {
    setDocloading(true);
    setSearch(value)
    if (timer) clearTimeout(timer);

    setTimer(
      setTimeout(() => {
        if (value && hospital[selectedHospitalIndex]?.id) {
          searchDoctor({ id: hospital[selectedHospitalIndex].id, search: value, setDoctor, setDocloading });
        } else setDoctor([]);
      }, 500)
    );
  };

  // load doctors when step 2 opens and hospital is selected
  useEffect(() => {
    if (step === 2 && selectedHospitalIndex !== null) {
      setDocloading(true);
      searchDoctor({
        id: hospital[selectedHospitalIndex].id,
        search: "",
        setDoctor,
        setDocloading,
      });
    }
  }, [step, selectedHospitalIndex]);

  useEffect(() => {
    if (!open) resetStates();
    if (open) setShowInfographics(true);
  }, [open]);


  useEffect(() => {
    if (isAcceptEloa && step === 1) {
      clearTimeout(timer)
      setTimer(null)
      setHosploading(true)

      setTimer(
        setTimeout(() => {
          searcHospital({
            search: search,
            accepteloa: isAcceptEloa,
            setHospital,
            setHosploading
          })
        }, 500)
      )
    }
  }, [isAcceptEloa])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="bg-[#1E3161] py-1 px-2 rounded-lg w-full md:max-w-72 cursor-pointer text-center">
          <h1 className="text-white roboto text-sm">
            Find and select your preferred provider
          </h1>
        </div>
      </DialogTrigger>


        {showInfographics ? (
          <>
          <DialogContent className="w-full max-w-3xl sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>E-LOA</DialogTitle>
            </DialogHeader>
            <div className="">
              <Image src={Infographics} width={800} height={400} alt="Infographics" className="w-full h-auto object-contain" />
            </div>
            <DialogFooter className="flex justify-end">
              <button
                className="px-4 py-1 rounded-lg bg-[#1E3161] text-white text-sm"
                onClick={() => setShowInfographics(false)} // just hide infographic, keep dialog open
              >
                Okay
              </button>
            </DialogFooter>
          </DialogContent>
          </>
        ) : (
          <>
          <DialogContent className="w-full max-w-lg sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-sm roboto">
                {step === 1
                  ? "Find your preferred accredited provider (Hospital / Clinic)"
                  : "Select your preferred doctor (Optional)"}
              </DialogTitle>
            </DialogHeader>

            {step === 1 ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search hospital..."
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto"
                  value={search}
                  onChange={(e) => onSearchHospital(e.target.value)}
                />
                <div className="h-[300px] overflow-auto mt-2 bg-[#F6F6F6] rounded-lg p-2">
                  {hosploading ? (
                    <div className="flex items-center justify-center h-full">
                      <SyncLoader color="#CDCDCD" margin={10} size={15} />
                    </div>
                  ) : hospital.length > 0 ? (
                    hospital.map((row, index) => (
                      <div key={index} className="flex items-center gap-2 border-b border-dashed py-2 px-1">
                        <input
                          type="radio"
                          name="hospital"
                          id={`hospital-${index}`}
                          checked={selectedHospitalIndex === index}
                          onChange={() => setSelectedHospitalIndex(index)}
                          className="w-3 h-3"
                        />
                        <Label
                          label={`${row.name} ${row.accept_eloa === 1 ? '⭐' : ''}`}
                          htmlFor={`hospital-${index}`}
                          className="text-sm cursor-pointer "
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-red-600 text-sm text-center mt-20 roboto">No hospital found</p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="accepting_eloa"
                    checked={!!isAcceptEloa}
                    onChange={handleEloaCheckbox}
                    className="cursor-pointer"
                  />
                  <label htmlFor="accepting_eloa" className="text-xs cursor-pointer font-bold roboto">
                    SHOW ONLY PROVIDERS ACCEPTING E-LOA
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Search doctor..."
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]"
                  value={search}
                  onChange={(e) => onSearchDoctor(e.target.value)}
                />
                <div className="h-[300px] overflow-auto mt-2 bg-[#F6F6F6] rounded-lg p-2">
                  {docloading ? (
                    <div className="flex items-center justify-center h-full">
                      <SyncLoader color="#CDCDCD" margin={10} size={15} />
                    </div>
                  ) : doctor.length > 0 ? (
                    doctor.map((row, index) => (
                      <div key={index} className="flex items-center gap-2 border-b border-dashed py-2 px-1">
                        <input
                          type="radio"
                          name="doctor"
                          id={`doctor-${index}`}
                          checked={selectedDoctorIndex === index}
                          onChange={() => setSelectedDoctorIndex(index)}
                          className="w-3 h-3"
                        />
                        <Label
                          label={`${row.last}, ${row.first} (${row.specialization})`}
                          htmlFor={`doctor-${index}`}
                          className="text-sm cursor-pointer"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-red-600 text-sm text-center mt-20 roboto">No doctor found</p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="flex gap-2 mt-4 justify-end">
              <DialogClose asChild>
                <button className="px-4 py-1 roboto rounded-lg bg-gray-300 text-black text-sm">Cancel</button>
              </DialogClose>
              <button
                type="button"
                className="px-4 py-1 rounded-lg bg-[#1E3161] text-white text-sm roboto"
                onClick={step === 1 ? onSubmitHospital : onSubmitDoctor}
              >
                {step === 1 ? (loaType === "consultation" ? "Next" : "Submit") : "Submit"}
              </button>
            </DialogFooter>
          </DialogContent>
          </>
        )}
    </Dialog>
  );
}

export default FindProviderDialog;
