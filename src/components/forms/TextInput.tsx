import {UseFormRegister} from "react-hook-form/dist/types/form";

interface TextInputProps {
    register: UseFormRegister<any>;
    name: string;
    label: string;
    type?: string;
    min?: number;
    max?: number;
}

const TextInput = ({register, name, label, type = 'text', min, max}: TextInputProps) => {
    return (
        <div className='relative z-0 w-full mb-6 group'>
            <input
                type={type}
                id={name}
                {...register(name)}
                className='form-input peer'
                placeholder=' '
                required
                min={min}
                max={max}
            />
            <label
                htmlFor={label}
                className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
                { label }
            </label>
        </div>
    )
}

export default TextInput;