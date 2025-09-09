import Chip from '@mui/material/Chip';
type Props = { subjects: string[] };

export default function TopSubject({ subjects }: Props) {
  return (
    <div className="flex flex-col items-center m-[0.5rem]">
      <div className="text-[1.5rem] font-bold text-neutral-900 mb-3 ">
        Top Subjects
      </div>
      <div className="flex flex-col items-center gap-2">
        {/* First row - single subject */}
        <div className="flex justify-center">
          {subjects[0] && (
            // <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-[12px]">
            //   {subjects[0]}
            // </span>
            <Chip 
              label={subjects[0]} 
              sx={{ 
                backgroundColor: '#bbf7d0', // green-200
                color: '#14532d', // green-900
                fontSize: '1rem',
                fontFamily: 'inherit',
                textAlign: 'center'
              }} 
            />
          )}
        </div>
        {/* Second row - two subjects */}
        <div className="flex items-center gap-3">
          {subjects[1] && (
            <Chip 
              label={subjects[1]} 
              sx={{ 
                backgroundColor: '#fecaca', // red-200
                color: '#7f1d1d', // red-900
                fontSize: '1rem',
                fontFamily: 'inherit',
                textAlign: 'center'
              }} 
            />
          )}
          {subjects[2] && (
            <Chip 
              label={subjects[2]} 
              sx={{ 
                backgroundColor: '#e9d5ff', // purple-200
                color: '#581c87', // purple-900
                fontSize: '1rem',
                fontFamily: 'inherit',
                textAlign: 'center'
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
