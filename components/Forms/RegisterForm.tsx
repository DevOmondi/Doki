"use client";

import React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Form, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import SubmitButton from "../SubmitButton";
import FileUploader from "../FileUploader";
import { PatientFormValidation } from "@/lib/validation";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import {  registerPatient } from "@/lib/actions/patient.actions";
import {
  GenderOptions,
  Doctors,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
// import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "../ui/label";
import { SelectItem, Select } from "../ui/select";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
      //@ts-ignore
      const patient = await registerPatient(patientData);
      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-12 flex-1"
        >
          <section className=" space-y-6">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself. 🥳</p>
          </section>
          {/* -------Personal Information-------- */}
          <section className=" space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className=" sub-header">Personal Information</h2>
            </div>
          </section>
          {/* NAME */}
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            placeholder="Collins Omondi"
            label="Full name"
            iconAlt="User icon"
            iconSrc="/assets/icons/user.svg"
          />
          <div className="flex flex-col gap-6 lg:justify-between xl:flex-row">
            {/* EMAIL */}
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              placeholder="collinsomondi@janta.com"
              label="Email Address"
              iconAlt="Email icon"
              iconSrc="/assets/icons/email.svg"
            />
            {/* PHONE */}
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              placeholder="+254 796 *** ##7"
              label="Phone Number"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            {/* DATE OF BIRTH */}
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="birthDate"
              placeholder=""
              label="Date of Birth"
            />
            {/* GENDER */}
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions?.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label className="cursor-pointer" htmlFor={option}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          {/* ADDRESS */}
          <div className="flex flex-col gap-6 lg:justify-between xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14 street, Buru buru, NRB - 5101"
            />
            {/* OCCUPATION */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Occupation"
              placeholder=" Software Engineer"
            />
          </div>
          <div className="flex flex-col gap-6 lg:justify-between xl:flex-row">
            {/* EMERGENCY CONTACT NAME */}
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="emergencyContactName"
              placeholder="Guardian's name"
              label="Emergency contact name"
            />
            {/* EMERGENCY CONTACT NUMBER */}
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="emergencyContactNumber"
              placeholder="+254 796 *** ##7"
              label="Emergency contact number"
            />
          </div>
          {/* ---------Medical Information-------- */}
          <section className=" space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className=" sub-header">Medical Information</h2>
            </div>
          </section>
          {/* PRIMARY  PHYSICIAN */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="items-center flex cursor-pointer gap-2">
                  <Image
                    src={doctor.image}
                    className="border border-dark-500 rounded-full"
                    height={32}
                    width={32}
                    alt={`${doctor.name} image`}
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          {/* INSURANCE */}
          <div className="flex flex-col gap-6 lg:justify-between xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="Jubilee"
            />
            {/* POLICY NUMBER */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456789"
            />
          </div>
          {/* ALLERGIES */}
          <div className="flex flex-col gap-6 lg:justify-between xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen"
            />
            {/* CURRENT MEDICATIONS */}
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Current medications"
              placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
            />
          </div>
          {/* FAMILY MEDICATIONS */}
          <div className="flex flex-col gap-6 lg:justify-between xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label=" Family medical history (if relevant)"
              placeholder="Mother had brain cancer, Father has hypertension"
            />
            {/* PAST MEDICATIONS */}
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
            />
          </div>
          {/* ---------Identification and verification-------- */}
          <section className=" space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className=" sub-header">Identification and Verification</h2>
            </div>
          </section>
          {/* IDENTIFICATION */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type"
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem
                key={type + i}
                value={type}
                className="cursor-pointer"
              >
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
          {/* IDENTIFICATION NUMBER */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />
          {/* IDENTIFICATION DOC */}
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
          {/* ---------Consent and Privacy-------- */}
          <section className=" space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className=" sub-header">Consent and Privacy</h2>
            </div>
          </section>
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
          <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
