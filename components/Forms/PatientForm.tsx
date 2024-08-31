"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import SubmitButton from "../SubmitButton";
import { userFormValidation } from "@/lib/validation";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { createUser } from "@/lib/actions/patient.actions";

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define form.
  const form = useForm<z.infer<typeof userFormValidation>>({
    resolver: zodResolver(userFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof userFormValidation>) {
    setIsLoading(true);
    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);

      if (newUser) router.push(`/patients/${newUser.$id}/register`);
      // console.log("User details:", user);
    } catch (error) {
      console.log("Error submitting:", error);
    }
    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi There. 👋</h1>
          <p className="text-dark-700">Schedule your first appointment. 📋</p>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          placeholder="Collins Omondi"
          label="Full name"
          iconAlt="User icon"
          iconSrc="/assets/icons/user.svg"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          placeholder="collinsomondi@janta.com"
          label="Email Address"
          iconAlt="Email icon"
          iconSrc="/assets/icons/email.svg"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="phone"
          placeholder="+254 796 *** ##7"
          label="Phone Number"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
