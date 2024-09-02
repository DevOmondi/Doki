import Image from "next/image";
// import { Button } from "@/components/ui/button";
import Logo from "../public/assets/icons/logo-full.svg";
import onboardingImage from "../public/assets/images/onboarding-img.png";
import PatientForm from "@/components/Forms/PatientForm";
import PassKeyModal from "@/components/PassKeyModal";
import Link from "next/link";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";
  const currentYear = new Date().getFullYear();
  return (
    <main className="flex h-screen max-h-screen ">
      {isAdmin && <PassKeyModal />}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src={Logo}
            height={1000}
            width={1000}
            alt="Doki app logo"
            quality={80}
            className="mb-12 h-10 w-fit"
          />
          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between ">
            <p className="justify-items-end text-dark-600 xl:text-left items-center">
              &copy; {currentYear} Doki
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src={onboardingImage}
        alt="Doctors"
        height={1000}
        width={1000}
        quality={80}
        className="side-img max-w-[50%]"
      />
    </main>
  );
}
