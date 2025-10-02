import React, { useEffect, useState } from 'react'


// Component
import SelectComponent from '@/components/Select';
import Label from '@/components/Label';
import InputSelectMultiple from '@/components/InputSelectMultiple';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Toaster } from '@/components/ui/sonner';

// Hooks
import { useForm } from 'react-hook-form'
import { ClientRequestDesktop } from '@/hooks/ClientRequestDesktop';
import FindHospitalDialog from './FindHospitalDialog';
import Swal from 'sweetalert2';
import { MoonLoader } from 'react-spinners';

function Consultation() {

    const [loading, setLoading] = useState(false)

    const [selectedHospital, setSelectedHospital] = useState()
    const [selectedDoctor, setSelectedDoctor] = useState()

    const { submitRequestConsultation } = ClientRequestDesktop()


    const { register, handleSubmit, watch, reset, control, formState: {errors}, setValue } = useForm({
        defaultValues: {
            patientType: "employee",
            verificationDetailsType: "personal",
            erCardNumber: "",
            patientLastName: "",
            patientFirstName: "",
            dob: "",
            loaType: "consultation"
        }
    })
    

  const patientType = [
    {
      name: "Patient is Employee",
      value: "employee",
    },
    {
      name: "Patient is Dependent",
      value: "dependent",
    },
  ];

  const complaints = [
    { value: 0, label: 'Back Pain / Body Pain' },
    { value: 1, label: 'Chest Pain' },
    { value: 2, label: 'Cough' },
    { value: 3, label: 'Cold, Flu-like symtoms' },
    { value: 4, label: 'Headache' },
    { value: 5, label: 'Urinary Complaints' },
    { value: 6, label: 'Ear Pain' },
    { value: 7, label: 'Highblood pressure' },
    { value: 8, label: 'Nausea' },
    { value: 9, label: 'Diarrhea' },
    { value: 10, label: 'Sore Throat' },
    { value: 11, label: 'Eye Conditions' },
    { value: 12, label: 'Skin Conditions' },
    { value: 13, label: 'Menstrual Pain' },
    { value: 14, label: 'Abdominal Pain' },
    { value: 15, label: 'Joint Pain' },
    { value: 16, label: 'Mass / Lump' },
    { value: 17, label: 'Pre and Post natal consultation' },
    { value: 18, label: 'Allergies' },
    { value: 19, label: 'Dizziness' },
    { value: 20, label: 'Fever' },
  ]

  const verificationDetailsType = watch("verificationDetailsType");
  const typeOfPatient = watch("patientType");

  useEffect(() => {
    reset({
      patientType: typeOfPatient, // keep current patient type
      verificationDetailsType, // keep selected type
      erCardNumber: "",
      patientLastName: "",
      patientFirstName: "",
      dob: "",
      loaType: "consultation",
      complaint: []
    });
  }, [verificationDetailsType, typeOfPatient, reset]);

  useEffect(() => {
    if (selectedHospital)
      setValue(
        'provider',
        `${selectedHospital?.id}||${selectedHospital?.name}++${
          selectedHospital?.address
        }++${selectedHospital?.city}++${selectedHospital?.state}++${
          selectedHospital?.email1
        }--${selectedDoctor?.id || 0}||${selectedDoctor?.last || ''}, ${
          selectedDoctor?.first || ''
        }++${selectedDoctor?.specialization || ''}`,
      )
    setValue('providerEmail2', selectedHospital?.email2)
  }, [selectedHospital, selectedDoctor])

  const onSubmit = (data) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Once you click Submit, you will not be able to make any further changes to your LOA request.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, confirm',
      })
      .then((result) => {
        if(result.isConfirmed){
          setLoading(true)
          submitRequestConsultation({
            ...data,
            setLoading,
            reset,
            setSelectedHospital,
            setSelectedDoctor
          })
        }
      })
  }








  return (
    <>
    <Toaster position="top-center" richColors />
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col items-center my-2'>
        <h1 className='text-[#1E3161] font-bold roboto text-lg'>CONSULTATION</h1>
      </div>

      <div className='flex flex-col gap-3'>
        <div>
          <SelectComponent 
            defaultValue={"employee"}
            itemList={patientType}
            className={"w-full border-2"}
            control={control}
            name={"patientType"}
          />
        </div>

        <div className="flex">

          <div className="basis-1/2 flex items-center gap-1">
            <input
              type="radio"
              id="personal_details"
              value="personal" // 👈 added value
              {...register("verificationDetailsType")} // 👈 register here too
              className="w-4 h-4 accent-[#1E3161]"
            />
            <label
              htmlFor="personal_details"
              className="text-[11px] roboto font-bold text-[#1E3161]"
            >
              Use Personal Details
            </label>
          </div>

          <div className="basis-1/2 flex items-center gap-1">
            <input
              type="radio"
              id="insurance_details"
              value="insurance" // 👈 added value
              {...register("verificationDetailsType")} // 👈 register here
              className="w-4 h-4 accent-[#1E3161]"
            />
            <label
              htmlFor="insurance_details"
              className="text-[11px] roboto font-bold text-[#1E3161]"
            >
              Use Insurance Details
            </label>
          </div>
        </div>

        <div>
          <h1 className='font-bold roboto'>Patient Information (as shown in Emergency Room card)</h1>
          {verificationDetailsType === "insurance" ? (
            <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 '>
              <div>
                <label htmlFor="er_card" className="text-[#1E3161] font-semibold">ER Card #</label>
                <input 
                  type="text" 
                  id="er_card" 
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                  {...register('erCardNumber', {
                    required: "ER Card # is required"
                  })}
                  />
                  {errors?.erCardNumber && <h1 className="text-red-800 text-sm font-semibold">{errors?.erCardNumber?.message}</h1>}
              </div>
              <div>
                <label htmlFor="dob" className="text-[#1E3161] font-semibold">Date of Birth</label>
                <input 
                  type="date" 
                  id="dob" 
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                  {...register('dob', {
                    required: "Date of Birth is required"
                  })}
                  />
                  {errors?.dob && <h1 className="text-red-800 text-sm font-semibold">{errors?.dob?.message}</h1>}
              </div>
            </div>
            </>
          ) : (
            <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
              <div>
                <label htmlFor="last_name" className="text-[#1E3161] font-semibold">Last Name</label>
                <input 
                  type="text" 
                  id="last_name" 
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                  {...register('patientLastName', {
                    required: "Last Name is required"
                  })}
                  />
                  {errors?.patientLastName && <h1 className="text-red-800 text-sm font-semibold">{errors?.patientLastName?.message}</h1>}
              </div>
              <div>
                <label htmlFor="first_name" className="text-[#1E3161] font-semibold">First Name</label>
                <input 
                  type="text" 
                  id="first_name" 
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                  {...register('patientFirstName', {
                    required: "First Name is required"
                  })}
                  />
                  {errors?.patientFirstName && <h1 className="text-red-800 text-sm font-semibold">{errors?.patientFirstName?.message}</h1>}
              </div>
              <div>
                <label htmlFor="dob" className="text-[#1E3161] font-semibold">Date of Birth</label>
                <input 
                  type="date" 
                  id="dob" 
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                  {...register('dob', {
                    required: "Date of Birth is required"
                  })}
                  />
                  {errors?.dob && <h1 className="text-red-800 text-sm font-semibold">{errors?.dob?.message}</h1>}
              </div>
            </div>
            </>
          )}
        </div>  

        {typeOfPatient == "dependent" && (
          <>
          <div>
            <h1 className="font-bold roboto">Principal Information</h1>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <div>
                  <label htmlFor="last_name" className="text-[#1E3161] font-semibold">Last Name</label>
                  <input 
                    type="text" 
                    id="last_name" 
                    className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                    {...register('employeeLastName', {
                      required: "Last Name is required"
                    })}
                    />
                    {errors?.employeeLastName && <h1 className="text-red-800 text-sm font-semibold">{errors?.employeeLastName?.message}</h1>}
                </div>
                <div>
                  <label htmlFor="first_name" className="text-[#1E3161] font-semibold">First Name</label>
                  <input 
                    type="text" 
                    id="first_name" 
                    className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                    {...register('employeeFirstName', {
                      required: "First Name is required"
                    })}
                    />
                    {errors?.employeeFirstName && <h1 className="text-red-800 text-sm font-semibold">{errors?.employeeFirstName?.message}</h1>}
                </div>
              </div>
          </div>
          
          </>
        )}
      </div>

      <div className='border-2 mt-5 border-[#1E3161]'></div>

      <div className='mt-5 flex flex-col gap-3'>
        <h1 className='text-[#1E3161] font-bold roboto text-lg text-center'>FILL UP YOUR REQUEST</h1>

        <div>
            <Label 
                label={"Chief Complaint"}
                htmlFor={"complaint"}
            />
            <InputSelectMultiple
            id="complaint"
            label="Select or type complaint"
            register={register('complaint')}
            required={true}
            errors={errors?.complaint}
            control={control}
            option={
                complaints.sort(function (a, b) {
                var textA = a.label.toUpperCase()
                var textB = b.label.toUpperCase()
                return textA < textB ? -1 : textA > textB ? 1 : 0
                }) || []
            }
            />
        </div>

        <div className='flex flex-col w-full'>
          <Label 
            label={"Find your preferred accredited provider (Hospital / Clinic)"}
          />
          <FindHospitalDialog 
            setSelectedDoctor={setSelectedDoctor}
            setSelectedHospital={setSelectedHospital}
          />
          <input
            type="hidden"
            {...register('provider', {
              required:
                'You must select Hospital or Clinic to complete the assessment',
            })}
          />
          {errors?.provider && <h1 className="text-red-800 text-sm font-semibold">{errors?.provider?.message}</h1>}
        </div>

        {selectedHospital && (
          <>
       <div
          className={`flex flex-col md:flex-row p-2 border border-gray-400 border-dashed bg-gray-100 roboto`}>
          <div className="basis-1/2 text-sm">
            <p className="font-bold mb-1">
              Hospital / Clinic:{' '}
              <span className="font-normal">
                {selectedHospital.name}
              </span>
            </p>
            <p className="font-bold mb-1">
              Address:{' '}
              <span className="font-normal">
                {selectedHospital.address}
              </span>
            </p>
            <p className="font-bold mb-1">
              City:{' '}
              <span className="font-normal">
                {selectedHospital.city}
              </span>
            </p>
            <p className="font-bold mb-1">
              State:{' '}
              <span className="font-normal">
                {selectedHospital.state}
              </span>
            </p>
          </div>
          <div
            className={`basis-1/2 text-sm md:pl-2 flex items-center ${!selectedDoctor && 'justify-center'}`}>
            <div
              className={`text-red-600 font-semibold ${selectedDoctor && 'hidden'}`}>
              No doctor selected
            </div>
            <div className={`capitalize ${!selectedDoctor && 'hidden'}`}>
              <p className="font-bold mb-1">
                Doctor:{' '}
                <span className="font-normal">
                  {selectedDoctor?.last}, {selectedDoctor?.first}
                </span>
              </p>
              <p className="font-bold mb-1">
                Specialization:{' '}
                <span className="font-normal">
                  {selectedDoctor?.specialization}
                </span>
              </p>
            </div>
          </div>
        </div>
          </>
        )}

        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <div>
              <label htmlFor="email" className="text-[#1E3161] font-semibold">Email <span className='text-red-700 text-sm'>(required)</span></label>
              <input 
                type="text" 
                id="email" 
                className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                {...register('email', {
                  required: "Email is required"
                })}
                />
                {errors?.email && <h1 className="text-red-800 text-sm font-semibold">{errors?.email?.message}</h1>}
            </div>
            <div>
              <label htmlFor="alt_email" className="text-[#1E3161] font-semibold">Alternate Email (optional)</label>
              <input 
                type="text" 
                id="alt_email" 
                className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                {...register('alt_email')}
                />
                {/* {errors?.alt_email && <h1 className="text-red-800 text-sm font-semibold">{errors?.alt_email?.message}</h1>} */}
            </div>
            <div>
              <label htmlFor="contact" className="text-[#1E3161] font-semibold">Contact #</label>
              <input 
                type="number" 
                id="contact" 
                className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161]" 
                {...register('contact')}
                />
                {/* {errors?.alt_email && <h1 className="text-red-800 text-sm font-semibold">{errors?.alt_email?.message}</h1>} */}
            </div>
          </div>
        </div>


        {loading ? (
            <>
            <div className='bg-[#1E3161] text-white py-2 rounded-r-4xl cursor-pointer rounded-bl-4xl flex items-center justify-center'>
                <MoonLoader size={20} color='white' />
            </div>
            </>
        ) : (
            <>
            <button type="submit" className="bg-[#1E3161] text-white py-1 rounded-r-4xl cursor-pointer rounded-bl-4xl hover:scale-105 transition duration-300 hover:bg-blue-950">SUBMIT</button>
            </>
        )}



      </div>
    </form>
    
    </>
  )
}

export default Consultation
