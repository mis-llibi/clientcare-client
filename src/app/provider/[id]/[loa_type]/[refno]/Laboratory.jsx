'use client'
import React, { useEffect, useState } from 'react'

// Components
import Card from '@/components/ClientCare/Card'
import FileUpload from '@/components/Fileupload'
import Input from '@/components/Input';
import Label from '@/components/Label';
import { MoonLoader } from 'react-spinners';

// Hooks
import { useForm } from 'react-hook-form'
import { useClientRequest } from '@/hooks/useClientRequest'

// Icons
import { FaFileAlt } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import Link from 'next/link';
import { applink } from '@/lib/applink';
import Swal from 'sweetalert2';



function Laboratory({ patient, provider, refno, setIsSubmitted, provider_id }) {

  const [loading, setLoading] = useState(false)

  
  const { register, control, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      refno: refno,
      provider_id: provider_id
    }
  });


  const { submitClientRequestLaboratory } = useClientRequest()

  const uploadedFiles = watch("files");
  const fileArray = uploadedFiles ? Array.from(uploadedFiles) : []; // ✅ convert FileList to array


  function truncateFileName(name, maxLength = 20) {
    if (name.length <= maxLength) return name;

    const ext = name.includes(".") ? name.substring(name.lastIndexOf(".")) : "";
    const base = name.replace(ext, "");

    const charsToShow = maxLength - ext.length - 3; // 3 for "..."
    const start = base.substring(0, Math.ceil(charsToShow / 2));
    const end = base.substring(base.length - Math.floor(charsToShow / 2));

    return `${start}...${end}${ext}`;
  }

  const onSubmit = (data) => {

    const formData = new FormData()
    formData.append("contact", data.contact)
    formData.append("email", data.email)
    formData.append("hospital", data.hospital)
    formData.append("refno", data.refno)
    formData.append('provider_id', data.provider_id)

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
        submitClientRequestLaboratory({
            formData,
            setLoading,
            setIsSubmitted
        })
      }
    })


    


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


  return (
    <Card>
      <h1 className='mb-2 text-[10px] font-bold roboto'>
        Hi <span className='text-[#1E3161]'>{patient?.patient_first_name} {patient?.patient_last_name}</span>, Kindly answer the following:
      </h1>

      {/* RHF controlled file upload */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2'>
          <div>
            <Label label={"Attach your Doctor’s Request for Laboratory (with Diagnosis)"} />
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

          <div>
            <Label 
                label={"Hospital"}
                htmlFor={"hospital"}
            />
            <Input 
                type={"text"}
                {...register('hospital', {
                  value: provider
                })}
                className={"bg-[#F6F6F6] opacity-80 roboto"}
                disabled={true}
            />
          </div>

          <h1 className='text-[10px] font-bold roboto '>If you want to be notified on the status of your LOA Request, please provide either of the following: </h1>

          <div>
              <Label 
                  label={"Email (optional)"}
                  htmlFor={"email"}
              />
              <Input 
                  type="email"
                  {...register('email')}
                  className={'roboto'}
              />
          </div>

          <div>
              <Label 
                  label={"Contact # (optional)"}
                  htmlFor={"contact"}
              />
              <Input 
                  type="text"
                  {...register('contact')}
                  placeholder={"09"}
                  className={'roboto'}
              />
          </div>

          {loading ? (
              <div className='bg-[#1E3161] text-white py-2 rounded-r-4xl cursor-pointer rounded-bl-4xl flex items-center justify-center'>
                  <MoonLoader size={20} color='white' />
              </div>
          ) : (
              <>
              <button type="submit" className="bg-[#1E3161] text-white py-1 rounded-r-4xl cursor-pointer rounded-bl-4xl hover:scale-105 transition duration-300 hover:bg-blue-950 roboto">SUBMIT</button>
              <Link href={`${applink}/provider/${provider_id}/laboratory`} className="bg-red-700 text-white py-1 rounded-r-4xl cursor-pointer rounded-bl-4xl hover:scale-105 transition duration-300 hover:bg-red-800 text-center roboto">
                BACK
              </Link>
              </>
          )}
        </div>
      </form>
    </Card>
  )
}

export default Laboratory
