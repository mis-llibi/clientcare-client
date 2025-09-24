"use client"

import React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Controller } from "react-hook-form"

function SelectWithoutDefaultValue({
  control,
  name,
  itemList = [],
  placeholder = "Select an option",
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          onValueChange={(val) => field.onChange(val)} // ensure val is stored as string
          value={field.value ? String(field.value) : ""} // force string
        >
          <SelectTrigger className="w-full border-2">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {itemList.map((item) => (
                <SelectItem key={item.value} value={String(item.value)}>
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

export default SelectWithoutDefaultValue
