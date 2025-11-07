'use client'
import React, { useState } from 'react'
import Link from 'next/link'

// Components
import Card from '@/components/ClientCare/Card'
import InputSelectMultiple from '@/components/InputSelectMultiple'
import SelectWithoutDefaultValue from '@/components/SelectWithoutDefaultValue'
import Label from '@/components/Label'
import Input from '@/components/Input'
import { MoonLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import PhoneInputMask from '@/components/InputMask'

// Hooks
import { useForm, Controller } from 'react-hook-form'
import { useClientRequest } from '@/hooks/useClientRequest'

// Helpers
import { applink } from '@/lib/applink'

function Consultation({patient, doctors, provider, refno, setIsSubmitted, provider_id}) {


    const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, reset, control, formState: {errors} } = useForm({
    defaultValues: {
        refno: refno,
        provider_id: provider_id
    }
  })

  const { submitClientRequestConsultation } = useClientRequest()

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

  const onSubmit = (data) => {
    if (data.contact) {
        const digits = data.contact.replace(/\D/g, ''); // remove all non-digits
        // ensure it starts with 0 (not +63)
        if (digits.startsWith('63')) {
        data.contact = '0' + digits.slice(2);
        } else if (!digits.startsWith('0')) {
        data.contact = '0' + digits;
        }
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
          submitClientRequestConsultation({
              ...data,
              setLoading,
              setIsSubmitted
          })
      }
    })
  }


  return (
    <>
    <Card>
        <h1 className='text-[10px] font-bold roboto '>Hi <span className='text-[#1E3161]'>{patient?.patient_first_name} {patient?.patient_last_name}</span>, Kindly answer the following: </h1>

        <div className='mt-2'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-2'> 
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

                    <div>
                        <Label 
                            label={"Doctor (Optional)"}
                            htmlFor={"doctor"}
                        />
                        <SelectWithoutDefaultValue 
                            control={control}
                            name={"doctor"}
                            itemList={doctors}
                            placeholder='Select a doctor'
                        />
                    </div>

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

                {loading ? (
                    <>
                    <div className='bg-[#1E3161] text-white py-2 rounded-r-4xl cursor-pointer rounded-bl-4xl flex items-center justify-center'>
                        <MoonLoader size={20} color='white' />
                    </div>
                    </>
                ) : (
                    <>
                    <button type="submit" className="bg-[#1E3161] text-white py-1 rounded-r-4xl cursor-pointer rounded-bl-4xl hover:scale-105 transition duration-300 hover:bg-blue-950">SUBMIT</button>
                    <Link href={`${applink}/provider/${provider_id}/consultation`} className="bg-red-700 text-white py-1 rounded-r-4xl cursor-pointer rounded-bl-4xl hover:scale-105 transition duration-300 hover:bg-red-800 text-center">
                      BACK
                    </Link>
                    </>
                )}




                </div>
            </form>
        </div>

    </Card>
    
    </>
  )
}

export default Consultation
