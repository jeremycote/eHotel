import { HotelFilterAttribute } from '@/src/types/HotelFilter';
import { ChangeEvent, ReactElement } from 'react';

interface ResultFilterSelectProps {
  minWidth?: string;
  label: string;
  includeAny?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: ReactElement[];
}

const ResultFilterSelect = ({
  minWidth,
  label,
  onChange,
  includeAny = true,
  options,
}: ResultFilterSelectProps) => {
  return (
    <li className="flex items-center">
      <div className='border-l border-y px-2 h-8 text-sm rounded-l-lg flex items-center bg-gray-700 border-gray-600 placeholder-gray-400 text-white'>{label}</div>
      <select className="border-r border-y px-2 h-8 text-sm rounded-r-lg block bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" onChange={onChange}>
        {includeAny && (
          <option key={'Any'} value={'Any'}>
            Any
          </option>
        )}
        {options}
      </select>
    </li>
  );
};

export default ResultFilterSelect;
