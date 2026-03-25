"use client"

import React from "react"
import { Controller } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SelectComponent({
  defaultValue,
  placeholder,
  itemList,
  className,
  control,
  name,
  rules,
  ...props
}) {
  if (control && name) {
    // ✅ When used inside RHF
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue || ""} // 👈 ensure default is not undefined
        render={({ field }) => (
          <Select
            onValueChange={(val) => field.onChange(val)}
            value={field.value || ""} // 👈 ensure value is always defined
            {...props}
          >
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {itemList?.map((item, i) => (
                  <SelectItem value={item.value} key={i} className={"roboto"}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    )
  }

  // ✅ Standalone usage (not controlled by RHF)
  return (
    <Select defaultValue={defaultValue} {...props}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {itemList?.map((item, i) => (
            <SelectItem value={item.value} key={i}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectComponent
