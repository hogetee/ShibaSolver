interface GuestContinueButtonProps {
  onClick: () => void;
  className?: string;
}

export default function GuestContinueButton({ onClick, className = "" }: GuestContinueButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-black cursor-pointer hover:text-grey-600 text-md underline transition-colors duration-200 ${className}`}
    >
      Continue as a guest
    </button>
  );
}
