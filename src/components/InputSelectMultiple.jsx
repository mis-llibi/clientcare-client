import React, { useRef } from 'react'
import CreatableSelect from 'react-select/creatable'
import { Controller } from 'react-hook-form'
import Swal from 'sweetalert2'

const InputSelectMultiple = ({
  register,
  required = true,
  errors,
  control,
  option = [],
  setIsTyping,
  loadingComplaints,
  setGetText,
  setError,
  clearErrors,
  ...props
}) => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: 14,
      border: '2px solid rgba(255, 255, 255, 0.4)',
      backgroundColor: state.isSelected ? '#7ACEF9' : 'white',
      color: state.isSelected ? '#333333' : '#021D7E',
      '&:hover': { border: '1px solid rgba(255, 255, 255, 0.4)', backgroundColor: '#90DFFF' },
      cursor: 'pointer',
    }),
    control: (base) => ({
      ...base,
      fontSize: 14,
      padding: 2,
      border: '1px solid #D3D3D3',
      borderRadius: 6,
      backgroundColor: errors ? '#FEE2E2' : '#F9F9F9',
      boxShadow: 'none',
    }),
    placeholder: (base) => ({ ...base, fontSize: 14, color: '#767676' }),
  }

  const normalize = (s = '') => s.trim().replace(/\s+/g, ' ').toLowerCase()
  const isBlockedFollowUp = (s) => normalize(s).includes('follow up')
  const isBlockedCheckUp = (s) => normalize(s).includes('check up')
  const fieldName = register?.name

  const isBlocked = (text) => isBlockedFollowUp(text) || isBlockedCheckUp(text)

  // ✅ prevents swal from popping up every keypress
  const swalShownRef = useRef(false)
  const showSwalOnce = () => {
    if (swalShownRef.current) return
    swalShownRef.current = true

    Swal.fire({
      icon: 'warning',
      title: 'Invalid complaint',
      text: '"Follow up / Check up" is not allowed. Please specify the diagnosis/reason.',
      confirmButtonText: 'OK',
    })
  }
  const resetSwal = () => {
    swalShownRef.current = false
  }

  return (
    <div>
      <Controller
        name={fieldName}
        control={control}
        rules={{
          required,
          validate: (val) => {
            const arr = Array.isArray(val) ? val : []
            const hasBlocked = arr.some((v) =>
              isBlockedFollowUp(v?.label || v?.value || '') ||
              isBlockedCheckUp(v?.label || v?.value || '')
            )
            return hasBlocked ? '"Follow up / Check up" is not allowed.' : true
          },
        }}
        render={({ field: { value, onChange } }) => (
          <CreatableSelect
            isMulti
            instanceId={props?.id}
            options={option}
            menuPlacement="auto"
            placeholder={props?.label}
            className="roboto"
            value={value}
            onChange={(newValue) => {
              const arr = Array.isArray(newValue) ? newValue : []
              const hasBlocked = arr.some((v) =>
                isBlockedFollowUp(v?.label || v?.value || '') ||
                isBlockedCheckUp(v?.label || v?.value || '')
              )

              if (!hasBlocked && clearErrors && fieldName) clearErrors(fieldName)
              if (!hasBlocked) resetSwal()

              onChange(newValue)
            }}
            isClearable
            styles={customStyles}
            {...props}
            isLoading={loadingComplaints}
            formatCreateLabel={(inputValue) =>
              isBlockedFollowUp(inputValue)
                ? '"Follow up" is not allowed'
                : isBlockedCheckUp(inputValue)
                ? '"Check up" is not allowed'
                : `Add "${inputValue}"`
            }
            isValidNewOption={(inputValue) => {
              if (!inputValue || !inputValue.trim()) return false
              if (isBlockedFollowUp(inputValue)) return false
              if (isBlockedCheckUp(inputValue)) return false
              return true
            }}
            onInputChange={(inputValue, actionMeta) => {
              if (actionMeta.action === 'input-change') {
                setIsTyping?.(inputValue.trim() !== '')
                setGetText?.(inputValue)

                if (isBlocked(inputValue)) {
                  // ✅ show RHF error
                  if (setError && fieldName) {
                    setError(fieldName, {
                      type: 'manual',
                      message: '"Follow up / Check up" is not allowed. Please specify the diagnosis/reason.',
                    })
                  }
                  // ✅ show Swal popup
                  showSwalOnce()
                } else {
                  if (clearErrors && fieldName) clearErrors(fieldName)
                  resetSwal()
                }
              } else if (
                actionMeta.action === 'menu-close' ||
                actionMeta.action === 'input-blur' ||
                actionMeta.action === 'set-value'
              ) {
                setIsTyping?.(false)
              }
            }}
            noOptionsMessage={({ inputValue }) =>
              isBlockedFollowUp(inputValue)
                ? '"Follow up" is restricted'
                : isBlockedCheckUp(inputValue)
                ? '"Check up" is restricted'
                : 'No options'
            }
          />
        )}
      />

      {errors?.message && (
        <p className="mt-1 text-sm text-red-600 roboto">{errors.message}</p>
      )}
    </div>
  )
}

export default InputSelectMultiple
