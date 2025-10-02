import React from 'react'
import CreatableSelect from 'react-select/creatable'
import { Controller } from 'react-hook-form'

const InputSelectMultiple = ({
    register,
    disabled = false,
    required = true,
    errors,
    control,
    option,
    ...props
}) => {
    // Custom styles for the react-select
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            fontSize: 14,
            border: '2px solid rgba(255, 255, 255, 0.4)',
            backgroundColor: state.isSelected ? '#7ACEF9' : 'white',
            color: state.isSelected ? '#333333' : '#021D7E',
            '&:hover': {
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backgroundColor: '#90DFFF',
            },
            cursor: 'pointer',
        }),
        control: (base, state) => ({
            ...base,
            fontSize: 14,
            padding: 2,
            border: '1px solid #D3D3D3',
            borderRadius: 6,
            backgroundColor: errors ? '#FEE2E2;' : '#F9F9F9',
            color: state.isSelected ? '#EA871F' : '#003BC2',
            '&:focus': {
                border: '2px solid #D3D3D3',
            },
            boxShadow: 'none',
        }),
        placeholder: base => ({
            ...base,
            fontSize: 14,
            color: '#767676',
        }),
    }

    return (
        <>
            <Controller
                name={register?.name}
                control={control}
                rules={{ required: required }}
                render={({ field: { value, onChange } }) => {
                    return (
                        <CreatableSelect
                            formatCreateLabel={inputText =>
                                `Others: "${inputText}"`
                            }
                            isMulti
                            instanceId={props?.id}
                            options={option}
                            menuPlacement="auto"
                            placeholder={props?.label}
                            className='roboto'
                            onChange={onChange}
                            value={value}
                            isClearable={true}
                            classNamePrefix={`focus:ring focus:ring-0 focus:ring-opacity-50`}
                            styles={customStyles}
                            defaultValue={props?.defaultValue}
                            {...props}
                        />
                    )
                }}
            />
        </>
    )
}

export default InputSelectMultiple
