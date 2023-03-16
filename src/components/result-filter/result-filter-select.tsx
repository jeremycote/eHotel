import HotelFilter, { HotelFilterAttribute } from '@/src/types/HotelFilter';
import { ChangeEvent, ReactElement } from 'react';

interface ResultFilterSelectProps {
  label: string;
  includeAny?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: ReactElement[];
}

const ResultFilterSelect = ({
  label,
  onChange,
  includeAny = true,
  options,
}: ResultFilterSelectProps) => {
  return (
    <li>
      <p>{label}</p>
      <select onChange={onChange}>
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
