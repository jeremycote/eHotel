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
    <li style={{ minWidth }}>
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
