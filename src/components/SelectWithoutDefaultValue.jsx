"use client"

import React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
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
        <div className="relative w-full">
          {/* The SelectTrigger */}
          <Select
            onValueChange={(val) => field.onChange(val)}
            value={field.value ? String(field.value) : ""}
          >
            <SelectTrigger className="w-full border-2 pr-8">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className={"w-2/3 ml-1"}>
              <SelectGroup>
                {itemList.length > 0 ? (
                  <>
                  {itemList.map((item) => (
                    <SelectItem key={item.value} value={String(item.value)}>
                      {item.name}
                    </SelectItem>
                  ))}
                  </>
                ) : (
                  <>
                  <SelectLabel>
                    No Doctors found in this hospital
                  </SelectLabel>
                  </>
                )}

                {/* {itemList.map((item) => (
                  <SelectItem key={item.value} value={String(item.value)}>
                    {item.name}
                  </SelectItem>
                ))} */}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Clear button: absolutely positioned, outside the trigger */}
          {field.value && (
            <div
              role="button"
              tabIndex={0}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full cursor-pointer"
              onClick={() => field.onChange("")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  field.onChange("")
                }
              }}
            >
              <X className="w-4 h-4" />
            </div>
          )}
        </div>
      )}
    />
  )
}

export default SelectWithoutDefaultValue
