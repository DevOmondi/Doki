"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { Appointment } from "@/types/appwrite.types";

// CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
    try {
      const appointment = await databases.getDocument(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        appointmentId
      );
      return parseStringify(appointment);
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE APPOINTMENT
  export const updateAppointmentList = async ({
    appointmentId,
    userId,
    appointment,
    type,
  }: UpdateAppointmentParams) => {
    try {
      const updatedAppointment = await databases.updateDocument(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        appointmentId,
        appointment
      );
      if (!updatedAppointment) {
        throw new Error("Appointment not found");
      }
      //TODO SMS notification
      revalidatePath('/admin');
      return parseStringify(updatedAppointment);
    } catch (error) {
      console.log("Error when Updating appointment", error);
    }
  };