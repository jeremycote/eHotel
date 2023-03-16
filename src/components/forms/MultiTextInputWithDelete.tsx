import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UseFormRegister } from 'react-hook-form/dist/types/form';
import { useState } from 'react';

interface MultiTextInputWithDelete {
  register: UseFormRegister<any>;
  setValue: (name: string, array: string[]) => void;
  name: string;
  label: string;
  array: string[];
}

const MultiTextInputWithDelete = ({
  register,
  setValue,
  name,
  label,
  array,
}: MultiTextInputWithDelete) => {
  const [arrayState, setArrayState] = useState(array);

  return (
    <div className='mb-6'>
      {arrayState?.map((val, i) => (
        <div key={i} className='relative z-0 w-full mb-4 group'>
          <div className='flex'>
            <div className='flex-grow'>
              <input
                type='text'
                {...register(`${name}.${i}`)}
                id={`${name}-${i}`}
                className='form-input peer'
                placeholder=' '
                required
              />
              <label
                htmlFor={`${name}-${i}`}
                className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                {label}
              </label>
            </div>
            <div className='ml-2'>
              <button
                onClick={() => {
                  const newArray = arrayState.filter((value) => val != value);
                  setArrayState(newArray);
                  setValue(name, newArray);
                }}
                type='button'
                className='button-danger'
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          const newArray = [...(arrayState ?? []), ''];
          setArrayState(newArray);
          setValue(name, newArray);
        }}
        type='button'
        className='button-dark'
      >
        <FontAwesomeIcon icon={faPlus} /> Add a new {label}
      </button>
    </div>
  );
};

export default MultiTextInputWithDelete;
