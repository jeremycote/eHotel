import { UseFormRegister } from 'react-hook-form/dist/types/form';

interface SimpleSelectProps {
  register: UseFormRegister<any>;
  name: string;
  label: string;
  array: { id: number | string; value: string }[];
}

const SimpleSelect = ({ register, name, label, array }: SimpleSelectProps) => {
  return (
    <div className='relative z-0 w-full mb-6 group'>
      <select
        id={name}
        {...register(name)}
        className='form-input peer'
        placeholder=' '
        required
      >
        {array.length &&
          array.map((k: { id: number | string; value: string }) => (
            <option key={k.id} value={k.id}>
              {k.value}
            </option>
          ))}
      </select>
      <label
        htmlFor={name}
        className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
      >
        {label}
      </label>
    </div>
  );
};

export default SimpleSelect;
