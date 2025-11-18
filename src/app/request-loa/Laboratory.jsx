import React, { useEffect, useState } from 'react'


import SelectComponent from '@/components/Select';
import Label from '@/components/Label';
import PhoneInputMask from '@/components/InputMask'
import { MoonLoader } from 'react-spinners';

// Hooks
import { useForm, Controller } from 'react-hook-form'
import FileUpload from '@/components/Fileupload';
import FindHospitalDialog from './FindHospitalDialog';
import { FaFileAlt } from 'react-icons/fa';
import { HiMiniXMark } from 'react-icons/hi2';
import { ClientRequestDesktop } from '@/hooks/ClientRequestDesktop';
import Swal from 'sweetalert2';

function Laboratory() {

    const [loading, setLoading] = useState(false)

    const [selectedHospital, setSelectedHospital] = useState()
    const [selectedDoctor, setSelectedDoctor] = useState()

    const { register, handleSubmit, watch, reset, control, formState: {errors}, setValue } = useForm({
        defaultValues: {
            patientType: "employee",
            verificationDetailsType: "personal",
            erCardNumber: "",
            patientLastName: "",
            patientFirstName: "",
            dob: "",
            loaType: "laboratory"
        }
    })

    const { submitRequestLaboratory } = ClientRequestDesktop()

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
  const uploadedFiles = watch("files");
  const fileArray = uploadedFiles ? Array.from(uploadedFiles) : []; // ✅ convert FileList to array

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

  function truncateFileName(name, maxLength = 20) {
    if (name.length <= maxLength) return name;

    const ext = name.includes(".") ? name.substring(name.lastIndexOf(".")) : "";
    const base = name.replace(ext, "");

    const charsToShow = maxLength - ext.length - 3; // 3 for "..."
    const start = base.substring(0, Math.ceil(charsToShow / 2));
    const end = base.substring(base.length - Math.floor(charsToShow / 2));

    return `${start}...${end}${ext}`;
  }

  const handleRemovePdf = (fileToRemove) => {
    const remaining = fileArray.filter((f) => f !== fileToRemove);

    if (remaining.length === 0) {
      // ✅ reset field completely if no files left
      setValue("files", null, { shouldValidate: true });
    } else {
      // ✅ directly set the remaining array of files
      setValue("files", remaining, { shouldValidate: true });
    }
  };

  const onSubmit = (data) => {
      // console.log(data)

      if(data.email == data.alt_email){
        Swal.fire({
          title: "Email duplicate",
          text: "Your email is duplicated, change the alternate email",
          icon: "warning"
        })
        return
      }
      if (data.contact) {
          const digits = data.contact.replace(/\D/g, ''); // remove all non-digits
          // ensure it starts with 0 (not +63)
          if (digits.startsWith('63')) {
          data.contact = '0' + digits.slice(2);
          } else if (!digits.startsWith('0')) {
          data.contact = '0' + digits;
          }
      }
      const formData = new FormData()
      formData.append('alt_email', data.alt_email)
      formData.append('contact', data.contact)
      formData.append('dob', data.dob)
      formData.append('email', data.email)
      formData.append('erCardNumber', data.erCardNumber)
      formData.append('loaType', data.loaType)
      formData.append('patientFirstName', data.patientFirstName)
      formData.append('patientLastName', data.patientLastName)
      formData.append('patientType', data.patientType)
      formData.append('provider', data.provider)
      formData.append('verificationDetailsType', data.verificationDetailsType)
      formData.append('employeeFirstName', data?.employeeFirstName)
      formData.append('employeeLastName', data?.employeeLastName)


      if (data.files && data.files.length > 0) {
        const files = Array.from(data.files); // ✅ convert FileList → Array<File>

        files.forEach((file) => {
          formData.append("files[]", file);
        });
      }

    Swal.fire({
      title: "Are you sure?",
      text: "Once you click Submit, you will not be able to make any further changes to your LOA request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm',
      customClass:{
        title: 'roboto',
        htmlContainer: 'roboto' // applies to text
        }
    })
    .then((result) => {
      if(result.isConfirmed){
        setLoading(true)
        submitRequestLaboratory({
            formData,
            setLoading,
            reset,
            setSelectedHospital,
        })
      }
    })
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
            className={"w-full border-2 roboto"}
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
                <label htmlFor="er_card" className="text-[#1E3161] font-semibold roboto">ER Card #</label>
                <input 
                  type="text" 
                  id="er_card" 
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto" 
                  {...register('erCardNumber', {
                    required: "ER Card # is required"
                  })}
                  />
                  {errors?.erCardNumber && <h1 className="text-red-800 text-sm font-semibold roboto">{errors?.erCardNumber?.message}</h1>}
              </div>
              <div>
                <label htmlFor="dob" className="text-[#1E3161] font-semibold roboto">Date of Birth</label>
                <input 
                  type="date" 
                  id="dob" 
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto bg-gray-100" 
                  {...register('dob', {
                    required: "Date of Birth is required"
                  })}
                  onKeyDown={(e) => e.preventDefault()}
                  />
                  {errors?.dob && <h1 className="text-red-800 text-sm font-semibold roboto">{errors?.dob?.message}</h1>}
              </div>
            </div>
            </>
          ) : (
            <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
              <div>
                <label htmlFor="last_name" className="text-[#1E3161] font-semibold roboto">Last Name</label>
                <input 
                  type="text" 
                  id="last_name" 
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto" 
                  {...register('patientLastName', {
                    required: "Last Name is required"
                  })}
                  />
                  {errors?.patientLastName && <h1 className="text-red-800 text-sm font-semibold roboto">{errors?.patientLastName?.message}</h1>}
              </div>
              <div>
                <label htmlFor="first_name" className="text-[#1E3161] font-semibold roboto">First Name</label>
                <input 
                  type="text" 
                  id="first_name" 
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto" 
                  {...register('patientFirstName', {
                    required: "First Name is required"
                  })}
                  />
                  {errors?.patientFirstName && <h1 className="text-red-800 text-sm font-semibold roboto">{errors?.patientFirstName?.message}</h1>}
              </div>
              <div>
                <label htmlFor="dob" className="text-[#1E3161] font-semibold roboto">Date of Birth</label>
                <input 
                  type="date" 
                  id="dob" 
                  className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto bg-gray-100" 
                  {...register('dob', {
                    required: "Date of Birth is required"
                  })}
                  onKeyDown={(e) => e.preventDefault()}
                  />
                  {errors?.dob && <h1 className="text-red-800 text-sm font-semibold roboto">{errors?.dob?.message}</h1>}
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
                  <label htmlFor="last_name" className="text-[#1E3161] font-semibold roboto">Last Name</label>
                  <input 
                    type="text" 
                    id="last_name" 
                    className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto" 
                    {...register('employeeLastName', {
                      required: "Last Name is required"
                    })}
                    />
                    {errors?.employeeLastName && <h1 className="text-red-800 text-sm font-semibold roboto">{errors?.employeeLastName?.message}</h1>}
                </div>
                <div>
                  <label htmlFor="first_name" className="text-[#1E3161] font-semibold roboto">First Name</label>
                  <input 
                    type="text" 
                    id="first_name" 
                    className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto" 
                    {...register('employeeFirstName', {
                      required: "First Name is required"
                    })}
                    />
                    {errors?.employeeFirstName && <h1 className="text-red-800 text-sm font-semibold roboto">{errors?.employeeFirstName?.message}</h1>}
                </div>
              </div>
          </div>
          
          </>
        )}
      </div>

      <div className='border-2 mt-5 bg-[#E7E7E7]'></div>

      <div className='mt-5 flex flex-col gap-3'>
        <h1 className='text-[#1E3161] font-bold roboto text-lg text-center'>FILL UP YOUR REQUEST</h1>

        <Label label={"Attach your Doctor’s Request for Laboratory (with Diagnosis)"} />
        <div className='flex flex-col items-center justify-center'>
          <FileUpload control={control} name="files" required={"Doctor's Request is required"} />
        </div>
          {fileArray.length > 0 && (
            <div>
              <Label label={"Uploaded Files"} />
              {fileArray.map((item, i) => (
                <div
                  className='mb-2 border border-black/30 w-full py-1 px-2 rounded-lg bg-[#F6F6F6] flex justify-between items-center'
                  key={i}
                >
                  <div className="flex gap-2 items-center min-w-0">
                    <div><FaFileAlt className='text-[#1E3161]' /></div>
                    <div className="truncate max-w-xs">
                      <h1 className="text-sm roboto">
                        {truncateFileName(item.name, 25)}
                      </h1>
                    </div>
                  </div>
                  <div>
                    <HiMiniXMark
                      className='text-red-800 text-lg cursor-pointer'
                      onClick={() => handleRemovePdf(item)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

        <Label 
          label={"Find your preferred accredited provider (Hospital / Clinic)"}
        />
        <FindHospitalDialog 
          setSelectedDoctor={setSelectedDoctor}
          setSelectedHospital={setSelectedHospital}
          loaType={"laboratory"}
        />
          <input
            type="hidden"
            {...register('provider', {
              required:
                'You must select Hospital or Clinic to complete the assessment',
            })}
          />
          {errors?.provider && <h1 className="text-red-800 text-sm font-semibold roboto">{errors?.provider?.message}</h1>}

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
        </div>
          </>
        )}

        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <div>
              <label htmlFor="email" className="text-[#1E3161] font-semibold roboto">Email <span className='text-red-700 text-sm'>(required)</span></label>
              <input 
                type="text" 
                id="email" 
                className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto" 
                {...register('email', {
                  required: "Email is required"
                })}
                />
                {errors?.email && <h1 className="text-red-800 text-sm font-semibold roboto">{errors?.email?.message}</h1>}
            </div>
            <div>
              <label htmlFor="alt_email" className="text-[#1E3161] font-semibold roboto">Alternate Email (optional)</label>
              <input 
                type="text" 
                id="alt_email" 
                className="border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] roboto" 
                {...register('alt_email')}
                />
                {/* {errors?.alt_email && <h1 className="text-red-800 text-sm font-semibold">{errors?.alt_email?.message}</h1>} */}
            </div>
            <div>
              <label htmlFor="contact" className="text-[#1E3161] font-semibold roboto">Contact #</label>
              <Controller
                  name="contact"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                      <PhoneInputMask
                      value={value || ''}
                      onChange={onChange}
                      placeholder="+63 (___)-___-____"
                      className="roboto"
                      />
              )}
              />
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
            <button type="submit" className="bg-[#1E3161] text-white py-1 rounded-r-4xl cursor-pointer rounded-bl-4xl hover:scale-105 transition duration-300 hover:bg-blue-950 roboto">SUBMIT</button>
            </>
        )}



      </div>
    </form>
    
    </>
  )
}

export default Laboratory
