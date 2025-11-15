import Image from "next/image";

interface ShibaIconProps {
  size?: number;
  className?: string;
}

export default function ShibaIcon({ size = 128, className = "text-gray-600" }: ShibaIconProps) {
  return (
    <div className="w-24 h-24 border-4 border-white rounded-full flex items-center justify-center bg-white">
      <Image src="/assets/ShibaSolverLogo.png" alt="Shiba Icon" width={size} height={size} className={className} />
    </div>
  );
}
