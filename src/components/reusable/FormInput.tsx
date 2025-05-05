import { nanoid } from "nanoid";
import React, { HTMLProps } from "react";

interface FormInputProps extends HTMLProps<HTMLInputElement> {
  label: string;
  errors?: string[];
}

export default function FormInput({ label, errors, ...props }: FormInputProps) {
  return (
    <div>
      <label className="flex flex-col">
        <span className="text-sm">{label}</span>
        <input
          {...props}
          className="border-black/40 border-[1px] text-sm rounded-sm p-2"
        />
      </label>
      <div className="text-xs mt-1">
        {errors?.map((error) => (
          <p className="text-red-500" key={nanoid()}>
            {error}
          </p>
        ))}
      </div>
    </div>
  );
}
