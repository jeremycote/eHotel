import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useRoles from '@/src/hooks/use-roles';
import useUser from '@/src/hooks/use-user';
import { AsyncStateStates } from '@/src/types/AsyncState';
import UserRole from '@/src/types/UserRole';
import useCollapse from 'react-collapsed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretUp,
  faMinus,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import FullHotelChain from '@/src/types/HotelChain';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextInput from '@/src/components/forms/TextInput';
import MultiTextInputWithDelete from '@/src/components/forms/MultiTextInputWithDelete';

interface HotelChainCollapseProps {
  newChain?: boolean;
  hotelChain?: FullHotelChain;
}

export default function HotelChains() {
  const router = useRouter();
  const roles = useRoles();

  if (
    roles.status === AsyncStateStates.Success &&
    !roles.data.includes(UserRole.Employee)
  ) {
    router.push('/');
  }

  const user = useUser();

  const [hotelChains, setHotelChains] = useState<FullHotelChain[]>([]);
  const [isLoading, setLoading] = useState(false);

  const refreshData = () => {
    setLoading(true);
    fetch(`/api/admin/hotel-chains`)
      .then((res) => res.json())
      .then((data) => {
        setHotelChains(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const HotelChainCollapse = ({
    newChain,
    hotelChain,
  }: HotelChainCollapseProps) => {
    const { getToggleProps, getCollapseProps, isExpanded } = useCollapse();
    const { register, handleSubmit, reset, setValue } = useForm<FullHotelChain>(
      { defaultValues: hotelChain },
    );

    const [phoneNumbers, setPhoneNumbers] = useState<string[]>(
      hotelChain?.phone_numbers ?? [''],
    );
    const [emails, setEmails] = useState<string[]>(hotelChain?.emails ?? ['']);

    const deleteChain = (chain_id: number) => {
      fetch('/api/admin/hotel-chains', {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify({
          chain_id: chain_id,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            toast.error(
              'Sorry... An error occurred, the Hotel Chain has not been deleted.',
            );
          } else {
            reset();
            toast.success('The Hotel Chain has been deleted successfully!');
            refreshData();
          }
        })
        .catch(() => {
          toast.error(
            'Sorry... An error occurred, the Hotel Chain has not been deleted.',
          );
        });
    };

    const onSubmit = handleSubmit((data) => {
      fetch('/api/admin/hotel-chains', {
        method: hotelChain?.chain_id ? 'PUT' : 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify({
          ...(hotelChain?.chain_id && { chain_id: hotelChain.chain_id }),
          name: data.name,
          address: data.address,
          phone_numbers: data.phone_numbers?.filter((p) => p),
          emails: data.emails?.filter((e) => e),
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            toast.error(
              'Sorry... An error occurred, the Hotel Chain has not been saved.',
            );
          } else {
            reset();
            toast.success('The Hotel Chain has been saved successfully!');
            refreshData();
          }
        })
        .catch(() => {
          toast.error(
            'Sorry... An error occurred, the Hotel Chain has not been saved.',
          );
        });
    });

    return isLoading ? (
      <div>Loading...</div>
    ) : (
      <div className='my-2'>
        <button className='w-full' {...getToggleProps()}>
          <div className='border rounded p-3 my-1 flex items-center'>
            <div className='mr-5'>
              <FontAwesomeIcon
                icon={
                  newChain
                    ? isExpanded
                      ? faMinus
                      : faPlus
                    : isExpanded
                    ? faCaretUp
                    : faCaretDown
                }
              />
            </div>
            <div className='text-left'>
              <h2 className='text-xl'>
                {hotelChain?.name ?? 'New Hotel Chain'}
              </h2>
            </div>
          </div>
        </button>
        <section
          className='px-4 py-3 bg-slate-50 rounded'
          {...getCollapseProps()}
        >
          <form className='py-3' onSubmit={onSubmit}>
            <TextInput register={register} name={'name'} label={'Chain Name'} />
            <TextInput register={register} name={'address'} label={'Address'} />
            <div className='grid md:grid-cols-2 md:gap-6 mb-6'>
              <MultiTextInputWithDelete
                register={register}
                /* @ts-ignore */
                setValue={(n, a) => setValue(n, a)}
                name={'phone_numbers'}
                label={'Phone Number'}
                array={phoneNumbers}
              />
              <MultiTextInputWithDelete
                register={register}
                /* @ts-ignore */
                setValue={(n, a) => setValue(n, a)}
                name={'emails'}
                label={'Email Address'}
                array={emails}
              />
            </div>
            <div className='flex justify-end gap-2'>
              {hotelChain?.chain_id && (
                <button
                  type='button'
                  onClick={() => deleteChain(hotelChain?.chain_id)}
                  className='hover:bg-slate-300 focus:ring-4 focus:outline-none focus:bg-slate-200 bg-slate-50 text-red-600 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'
                >
                  Delete
                </button>
              )}
              <button
                type='submit'
                className='hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800'
              >
                Save
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  };

  return (
    <>
      <div className='p-3'>
        <h1 className='text-2xl font-bold'>Edit Hotel Chains</h1>
        <div>
          {hotelChains.length &&
            hotelChains.map((hc) => (
              <HotelChainCollapse key={hc.chain_id} hotelChain={hc} />
            ))}
          <HotelChainCollapse newChain={true} />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
