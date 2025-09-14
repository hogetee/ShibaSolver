import Image from "next/image";

export default function ShibaError({ message }: { message: string }) {
  return (
    <div className="w-full h-full m-[3rem] flex justify-center items-center gap-6">
        <Image src="/assets/ShibaSolverLogo.svg" className="hover:animate-spin ease-in-out" alt="Shiba Solver" width={160} height={160} />
      <span className="font-bold font-display text-3xl text-accent-600 m-[1rem] animate-pulse">{message}</span>
    </div>
  );
}