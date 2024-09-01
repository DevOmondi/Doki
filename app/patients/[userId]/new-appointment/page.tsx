import Image from "next/image";
import AppointmentForm from "@/components/Forms/AppointmentForm";
import Logo from "../../../../public/assets/icons/logo-full.svg";
import appointmentImage from "../../../../public/assets/images/appointment-img.png";
import Link from "next/link";
import { getPatient } from "@/lib/actions/patient.actions";

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const currentYear = new Date().getFullYear();
  const patient = await getPatient(userId);
  return (
    <main className="flex h-screen max-h-screen ">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src={Logo}
            height={1000}
            width={1000}
            alt="Doki app logo"
            quality={80}
            className="mb-12 h-10 w-fit"
          />
          {/* <PatientForm /> */}
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.$id}
          />
          <p className="copyright mt-10 py-12">
            &copy; {currentYear} Doki
          </p>
        </div>
      </section>
      <Image
        src={appointmentImage}
        alt="Appointment"
        height={1000}
        width={1000}
        quality={80}
        className="side-img max-w-[390px] bg-bottom"
      />
    </main>
  );
};

export default NewAppointment;
