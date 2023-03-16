import User from '@/src/types/User';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import TextInput from '../forms/TextInput';

interface UserAccountFormProps {
  user: User;
  onSubmit: () => void;
}

const UserAccountForm = ({ user, onSubmit }: UserAccountFormProps) => {
  const { register, handleSubmit, reset } = useForm<User>({
    defaultValues: user,
  });

  const onSubmitForm = handleSubmit((data) => {
    fetch('/api/auth/account', {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          toast.error(
            'Sorry... An error occurred, the account was not updated.',
          );
        } else {
          reset();
          toast.success('Account updated successfully!');
          onSubmit();
        }
      })
      .catch(() => {
        toast.error('Sorry... An error occurred, the account was not updated.');
      });
  });

  return (
    <>
      <div className='p-3'>
        <h1 className='text-2xl font-bold'>Sign Up</h1>
        <div className='my-2'>
          <form className='py-3' onSubmit={onSubmitForm}>
            <section className='px-4 py-3 bg-slate-50 rounded'>
              <TextInput register={register} name={'name'} label='Full name' />
              <TextInput register={register} name={'address'} label='address' />
              {/* <TextInput register={register} name={'email'} label='email' /> */}
              <TextInput register={register} name={'nas'} label='nas' />
              <TextInput
                register={register}
                name={'phone_number'}
                label='Phone Number'
              />
              <button
                type='submit'
                className='hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800'
              >
                Submit
              </button>
            </section>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UserAccountForm;
