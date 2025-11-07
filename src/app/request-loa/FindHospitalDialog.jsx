import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { SyncLoader } from 'react-spinners'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ClientRequestDesktop } from '@/hooks/ClientRequestDesktop';
import Label from '@/components/Label'
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import Infographics from "@/assets/infographics-eloa.jpg"

function FindHospitalDialog({ setSelectedHospital, setSelectedDoctor }) {
  const [open, setOpen] = useState(false) // control dialog open/close
  const [showInfographics, setShowInfographics] = useState(true)

  const [timer, setTimer] = useState(null)
  const [search, setSearch] = useState("")
  const [hosploading, setHosploading] = useState(false)
  const [hospital, setHospital] = useState()
  const [isAcceptEloa, setIsAcceptEloa] = useState()
  const [docloading, setDocloading] = useState(false)
  const [doctor, setDoctor] = useState()

  const [selectedHospitalIndex, setSelectedHospitalIndex] = useState(null)
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(null)

  const { searcHospital, searchDoctor } = ClientRequestDesktop()

  const resetStates = () => {
    setTimer(null)
    setSearch("")
    setHosploading(false)
    setHospital(undefined)
    setIsAcceptEloa(undefined)
    setDocloading(false)
    setDoctor(undefined)
    setSelectedHospitalIndex(null)
    setSelectedDoctorIndex(null)
    // setShowInfographics(true)
  }

  const onSubmit = () => {
    const chosenHospital = hospital?.[selectedHospitalIndex] || null
    const chosenDoctor = doctor?.[selectedDoctorIndex] || null

    if (chosenHospital == null) {
      toast("Hospital or Clinic is required", {
        description: "You must choose a Hospital or Clinic to continue",
      })
      return
    }

    setSelectedHospital(chosenHospital)
    setSelectedDoctor(chosenDoctor)

    // ✅ close modal after submit
    setOpen(false)
    resetStates()
  }

  const onSearchHospital = (search) => {
    setSearch(search)
    setHosploading(true)

    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }

    setTimer(
      setTimeout(() => {
        if (search) searcHospital({ search, accepteloa: isAcceptEloa, setHospital, setHosploading })
      }, 1000),
    )
  }

  const handleEloaCheckbox = (e) => {
    setIsAcceptEloa(e.target.checked)
  }

  const onSearchDoctor = (search) => {
    setDocloading(true)
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setTimer(
      setTimeout(() => {
        if (search && selectedHospitalIndex !== null)
          searchDoctor({
            id: hospital?.[selectedHospitalIndex]?.id,
            search,
            setDoctor,
            setDocloading,
          })
      }, 1000),
    )
  }

  useEffect(() => {
    if (selectedHospitalIndex !== null) {
      setDocloading(true)
      searchDoctor({
        id: hospital?.[selectedHospitalIndex]?.id,
        search: '',
        setDoctor,
        setDocloading,
      })
    } else {
      setDoctor()
    }
  }, [selectedHospitalIndex])

  useEffect(() => {
    if (isAcceptEloa) {
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

  useEffect(() => {
    if (!open) {
      resetStates()  // ✅ reset everything when dialog closes
    }

    if(open == true){
        setShowInfographics(true)
    }
    
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='bg-[#1E3161] py-1 px-2 rounded-lg w-full md:max-w-72 cursor-pointer text-center'>
          <h1 className='text-white roboto text-sm'>Find and select your preferred provider</h1>
        </div>
      </DialogTrigger>

      <DialogContent className="w-full md:max-w-xl lg:max-w-3xl xl:max-w-5xl">
        {showInfographics ? (
            <>
            <DialogHeader>
                <DialogTitle>E-LOA</DialogTitle>
            </DialogHeader>
            <div className='w-full'>
                <Image 
                    src={Infographics}
                    width={1000}
                    alt='Infographics'
                />
            </div>
            <DialogFooter className={"flex justify-end roboto"}>
              {/* <DialogClose>
                <button className="px-4 py-1 rounded-lg bg-gray-300 text-sm">Cancel</button>
              </DialogClose> */}
              <button 
                onClick={() => setShowInfographics(false)} 
                className="px-4 py-1 rounded-lg bg-[#1E3161] text-white text-sm"
              >
                Okay
              </button>
            </DialogFooter>
            </>
        ) : (
            <>
            <DialogHeader className="text-start roboto">
                <DialogTitle className="text-sm">
                    Find your preferred accredited provider (Hospital / Clinic / Doctor)
                </DialogTitle>
            </DialogHeader>

            {/* Content */}
            <div className="overflow-x-auto lg:overflow-x-hidden">
                <p className="absolute top-0 right-2 text-xs text-gray-500 italic md:hidden">
                  ⇄ Swipe horizontally
                </p>
                <div className="flex gap-2 h-[450px] lg:h-[500px] min-w-[700px] lg:min-w-0">

                    {/* LEFT HOSPITAL */}
                    <div className="basis-1/2 min-w-[320px] lg:min-w-0">
                    <label className="text-[#1E3161] font-semibold text-sm roboto">
                        Hospital or Clinic
                    </label>
                    <input
                        type="text"
                        className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]"
                        onChange={(e) => onSearchHospital(e.target.value)}
                    />
                    <ScrollArea className="bg-[#F6F6F6] mt-2 rounded-lg p-2 h-[380px] lg:h-[420px]">
                        <div className={`min-w-[600px] lg:min-w-0 
                                    ${(!hospital || hosploading ) && 'flex items-center justify-center h-96 w-full'}`}>
                        {hosploading ? (
                            <SyncLoader color="#CDCDCD" margin={10} size={15} />
                        ) : hospital ? (
                            <div className="p-2">
                            {hospital?.map((row, index) => (
                                <div
                                key={index}
                                className="w-full border-b border-dashed min-h-8 py-2 px-1 flex items-center gap-2"
                                >
                                <input
                                    type="radio"
                                    name="hospital"
                                    checked={selectedHospitalIndex === index}
                                    onChange={() => setSelectedHospitalIndex(index)}
                                    className="w-3 h-3"
                                    id={`hospital-${index}`}
                                />
                                <Label 
                                    label={`${row.name} ${row.accept_eloa == 1 ? "⭐" : ""}`} 
                                    className={"text-sm cursor-pointer"}
                                    htmlFor={`hospital-${index}`}
                                />
                                </div>
                            ))}
                            </div>
                        ) : (
                            <span className="text-red-600 font-semibold text-sm">No hospital found</span>
                        )}
                        </div>
                        <ScrollBar orientation="horizontal" />
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                    </div>

                    {/* RIGHT DOCTOR */}
                    <div className="basis-1/2 min-w-[320px] lg:min-w-0">
                    <label className="text-[#1E3161] font-semibold text-sm roboto">
                        Doctor (optional)
                    </label>
                    <input
                        type="text"
                        className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]"
                        disabled={selectedHospitalIndex === null || hosploading}
                        onChange={(e) => onSearchDoctor(e.target.value)}
                    />
                    <ScrollArea className="bg-[#F6F6F6] mt-2 rounded-lg p-2 h-[380px] lg:h-[420px]">
                        <div className={`min-w-[600px] lg:min-w-0 
                                    ${(!doctor || docloading ) && 'flex items-center justify-center h-96 w-full'}`}>
                        {docloading ? (
                            <SyncLoader color="#CDCDCD" margin={10} size={15} />
                        ) : doctor ? (
                            <div className="p-2">
                            {doctor?.map((row, index) => (
                                <div
                                key={index}
                                className="w-full border-b border-dashed min-h-8 py-2 px-1 flex items-center gap-2"
                                >
                                <input
                                    type="radio"
                                    name="doctor"
                                    checked={selectedDoctorIndex === index}
                                    onChange={() => setSelectedDoctorIndex(index)}
                                    className="w-3 h-3"
                                    id={`doctor-${index}`}
                                />
                                <Label
                                    label={
                                    <>
                                        {row.last}, {row.first} <br />
                                        {row.specialization}
                                    </>
                                    }
                                    className="text-sm cursor-pointer"
                                    htmlFor={`doctor-${index}`}
                                />
                                </div>
                            ))}
                            </div>
                        ) : (
                            <span className="text-red-600 font-semibold text-sm">No doctor found</span>
                        )}
                        </div>
                        <ScrollBar orientation="horizontal" />
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <DialogFooter className="w-full mt-4 overflow-x-auto">
            <div className="flex items-center justify-between gap-4 min-w-[700px] lg:min-w-0 roboto">
                
                {/* left side */}
                <div className="text-sm text-[#1E3161] font-medium flex items-center gap-2 shrink-0">
                <input
                    type='checkbox'
                    id="accepting_eloa"
                    className='cursor-pointer'
                    checked={!!isAcceptEloa}
                    onChange={(e) => handleEloaCheckbox(e)}
                />
                <label htmlFor="accepting_eloa" className='font-bold px-2 py-2 text-xs cursor-pointer'>
                    SHOW ONLY PROVIDERS ACCEPTING E-LOA
                </label>
                </div>

                {/* legend */}
                <div className="flex flex-col items-center text-xs roboto shrink-0">
                <h1 className='font-bold'>LEGEND</h1>
                <h1 className='text-[#1E3161] font-bold '>⭐ - <span className='uppercase'>Accepts e-LOA</span></h1>
                </div>

                {/* buttons */}
                <div className="flex gap-3 shrink-0">
                <DialogClose>
                    <h1 className='px-4 py-1 rounded-lg bg-[#1E3161] text-white text-sm'>Cancel</h1>
                </DialogClose>
                <button 
                    type="button" 
                    onClick={onSubmit}
                    className="px-4 py-1 rounded-lg bg-[#1E3161] text-white text-sm"
                >
                    Submit
                </button>
                </div>
            </div>
            </DialogFooter>


            </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default FindHospitalDialog
