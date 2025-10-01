import React, { useEffect, useState } from 'react'


import SelectComponent from '@/components/Select';
import Label from '@/components/Label';
import InputSelectMultiple from '@/components/InputSelectMultiple';
import { MoonLoader } from 'react-spinners';

// Hooks
import { useForm } from 'react-hook-form'

function Laboratory() {

    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, watch, reset, control, formState: {errors} } = useForm({
        defaultValues: {
            patientType: "employee",
            verificationDetailsType: "insurance",
            erCardNumber: "",
            patientLastName: "",
            patientFirstName: "",
            dob: "",
            loaType: "laboratory"
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
      loaType: "laboratory"
    });
  }, [verificationDetailsType, typeOfPatient, reset]);

  const onSubmit = (data) => {
      console.log(data)
  }


  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col items-center my-2'>
        <h1 className='text-[#1E3161] font-bold roboto text-lg'>LABORATORY</h1>
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
        </div>

        <div>
          <h1 className='font-bold roboto'>Patient Information</h1>
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
            <h1 className="font-bold roboto">Employee Information</h1>
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

      <div className='border-2 mt-5 bg-[#E7E7E7]'></div>

      <div className='mt-5 flex flex-col gap-3'>
        <h1 className='text-[#1E3161] font-bold roboto text-lg text-center'>FILL UP YOUR REQUEST</h1>

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

export default Laboratory
