import React from "react";
import Image from "next/image";
import Logo from "../../../../public/assets/icons/logo-full.svg";
import registerImg from "../../../../public/assets/images/register-img.png";
import Link from "next/link";
import RegisterForm from "@/components/Forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex h-screen max-h-screen ">
      <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src={Logo}
            height={1000}
            width={1000}
            alt="Doki app logo"
            quality={80}
            className="mb-12 h-10 w-fit"
          />
          <RegisterForm user={user} />
          <p className="copyright py-12">
            &copy; {currentYear} Doki
          </p>
        </div>
      </section>
      <Image
        src={registerImg}
        alt="Pills"
        height={1000}
        width={1000}
        quality={80}
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Register;
