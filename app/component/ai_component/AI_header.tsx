"use client";

import Image from "next/image";
import logo from "@/public/images/soul_valley_logo.png";
import { useRouter } from "next/navigation";
export default function AIHeader() {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center px-[1.5rem] py-[1rem] justify-between">
        <Image
          src={logo}
          alt="Logo"
          onClick={() => router.push("/")}
          className="h-auto lg:w-[15%] w-[20%] cursor-pointer"
        />
        <div className="">
          <span
            className="cursor-pointer font-body bg-[#f1f5f9] px-[1rem] py-[0.9rem] rounded-full text-[#636e7e] border text-[0.8rem] border-[#636e7e]/10"
            onClick={() => router.push("/")}
          >
            Our Work
          </span>
        </div>
      </div>
    </div>
  );
}
