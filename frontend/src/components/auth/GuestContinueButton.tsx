interface GuestContinueButtonProps {
  onClick: () => void;
  className?: string;
}

export default function GuestContinueButton({ onClick, className = "" }: GuestContinueButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-black cursor-pointer text-md hover:underline transition-colors duration-200 ${className}`}
    >
      Continue as a guest
    </button>
  );
}
