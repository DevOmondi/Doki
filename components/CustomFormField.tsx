"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Image from "next/image";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

// Field to be rendered
const RenderField = ({ props, field }: { field: any; props: CustomProps }) => {
  const { placeholder, fieldType, iconAlt, iconSrc, name } = props;
  //   return <Input type={field} placeholder={placeholder} />;
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt || `${name} icon`}
              width={24}
              height={24}
              quality={80}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
          <FormControl>
            <PhoneInput
              defaultCountry="KE"
              placeholder={placeholder}
              withCountryCallingCode
              international
              value={field.value}
              onChange={field.onChange}
              className="input-phone"
            />
          </FormControl>
      );
      break;

    default:
      break;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {fieldType !== FormFieldType.CHECKBOX && label && (
              <FormLabel>{label}</FormLabel>
            )}
            <RenderField props={props} field={field} />
            <FormMessage className="shad-error" />
          </FormItem>
        )}
      />
    </>
  );
};

export default CustomFormField;
