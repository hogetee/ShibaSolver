import PetsIcon from '@mui/icons-material/Pets';

type Props = { value: number };

export default function Shibameter({ value }: Props){
  return (
    <div className="flex items-center gap-2 bg-accent-600 rounded-[10px] px-3 py-1 shadow-sm">
      <PetsIcon className="text-white" fontSize="small" />
      <div className="text-[1rem] font-semibold text-white">{value} %</div>
    </div>
  );
}