import { useRouter } from "next/navigation";
import { BsInstagram, BsTwitterX } from "react-icons/bs";

export default function AIFooter() {
  const date = new Date();
  const router = useRouter();
  const year = date.toLocaleDateString("en", {
    year: "numeric",
  });
  return (
    <div className="flex flex-1 h-full items-center justify-between px-[1.5rem]">
      <div className="text-[#636e7e] text-[0.8rem] flex gap-5">
        <span className="">&copy;{year} Soul Valley Agency</span>
        <span className="cursor-pointer" onClick={() => router.push("/privacy")}>Privacy</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center bg-[#f1f5f9] h-[40px] w-[40px] border border-[#636e7e] text-[#636e7e] rounded-full">
          <BsTwitterX size={15}/>
        </span>
        <span className="flex items-center justify-center bg-[#f1f5f9] h-[40px] w-[40px] border border-[#636e7e] text-[#636e7e] rounded-full">
          <BsInstagram size={15}/>
        </span>
      </div>
    </div>
  );
}
