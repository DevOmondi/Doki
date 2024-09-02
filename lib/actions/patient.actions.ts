"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { Appointment } from "@/types/appwrite.types";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
  messaging,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { formatDateTime } from "../utils";
import { revalidatePath } from "next/cache";
// import {InputFile} from "node-appwrite/file"
// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET APPWRITE USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error: any) {
    console.log("Error getting user:", error);
  }
};

// CREATE PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      );
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.log("Error adding file to storage:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    console.log("This is the patients document", patients.documents[0]);
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

// GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    // const scheduledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "scheduled");

    // const pendingAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "pending");

    // const cancelledAppointments = (
    //   appointments.documents as Appointment[]
    // ).filter((appointment) => appointment.status === "cancelled");

    // const data = {
    //   totalCount: appointments.total,
    //   scheduledCount: scheduledAppointments.length,
    //   pendingCount: pendingAppointments.length,
    //   cancelledCount: cancelledAppointments.length,
    //   documents: appointments.documents,
    // };

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

// SEND SMS NOTIFICATION
export const sendSmsNotification = async (userId: string, content: string) => {
  try {
    const message = messaging.createSms(ID.unique(), content, [], [userId]);
  } catch (error) {
    console.log("Error sending sms:", error);
  }
};

// UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    const smsMessage = `Greetings from CarePulse. ${
      type === "schedule"
        ? `Your appointment is confirmed for ${
            formatDateTime(appointment.schedule!).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform that your appointment for ${
            formatDateTime(appointment.schedule!).dateTime
          } is cancelled. Reason:  ${appointment.cancellationReason}`
    }.`;
    await sendSmsNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};
