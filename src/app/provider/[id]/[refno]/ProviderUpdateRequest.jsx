'use client'
import React from 'react'

// Components
import Card from '@/components/ClientCare/Card'
import InputSelectMultiple from '@/components/InputSelectMultiple'

import { useForm } from 'react-hook-form'
import { Select } from '@/components/ui/select'
import SelectComponent from '@/components/Select'
import SelectWithoutDefaultValue from '@/components/SelectWithoutDefaultValue'



function ProviderUpdateRequest({patient, doctors}) {



  const { register, handleSubmit, watch, reset, control, formState: {errors} } = useForm()

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
    console.log(data)
  }

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


  return (
    <>
    <Card>
        <h1 className='text-[10px] font-bold roboto '>Hi <span className='text-[#1E3161]'>{patient?.patient_first_name} {patient?.patient_last_name}</span>, Kindly answer the following: </h1>

        <div className='mt-2'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-2'>

                    <div>
                        <label htmlFor="complaint" className='text-[#1E3161] font-semibold'>Chief Complaint</label>
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
                        <label htmlFor="doctor" className='text-[#1E3161] font-semibold'>Doctor</label>
                        <SelectWithoutDefaultValue 
                            control={control}
                            name={"doctor"}
                            itemList={doctors}
                            placeholder='Select a doctor'
                        />
                    </div>

                    <div>
                        <button type='submit'>Submit</button>
                    </div>



                </div>
            </form>
        </div>

    </Card>
    
    </>
  )
}

export default ProviderUpdateRequest
