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
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Hotel } from '@/src/types/Hotel';
import HotelChain from '@/src/types/HotelChain';

interface HotelCollapseProps {
  newHotel?: boolean;
  hotel?: Hotel;
}

export default function Hotels() {
  const router = useRouter();
  const roles = useRoles();

  if (
    roles.status === AsyncStateStates.Success &&
    !roles.data.includes(UserRole.Employee)
  ) {
    router.push('/');
  }

  const user = useUser();

  const [hotelsChains, setHotelsChains] = useState<HotelChain[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setLoading] = useState(false);

  const refreshHotelData = () => {
    setLoading(true);
    fetch(`/api/admin/hotels`)
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setLoading(false);
      });
  };

  const refreshHotelChainsData = () => {
    setLoading(true);
    fetch(`/api/admin/hotel-chains`)
      .then((res) => res.json())
      .then((data) => {
        setHotelsChains(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshHotelData();
    refreshHotelChainsData();
  }, [user]);

  const HotelCollapse = ({ newHotel, hotel }: HotelCollapseProps) => {
    const { getToggleProps, getCollapseProps, isExpanded } = useCollapse();
    const { register, handleSubmit, reset, setValue } = useForm<Hotel>({
      defaultValues: hotel,
    });

    const [phoneNumbers, setPhoneNumbers] = useState<string[]>(
      hotel?.phone_numbers ?? [''],
    );
    const [emails, setEmails] = useState<string[]>(hotel?.emails ?? ['']);
    const [images, setImages] = useState<string[]>(hotel?.images ?? []);

    const deleteHotel = (hotel_id: number) => {
      fetch('/api/admin/hotels', {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify({
          hotel_id: hotel_id,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            toast.error(
              'Sorry... An error occurred, the Hotel has not been deleted.',
            );
          } else {
            reset();
            toast.success('The Hotel has been deleted successfully!');
            refreshHotelData();
          }
        })
        .catch(() => {
          toast.error(
            'Sorry... An error occurred, the Hotel has not been deleted.',
          );
        });
    };

    const onSubmit = handleSubmit((data) => {
      fetch('/api/admin/hotels', {
        method: hotel?.hotel_id ? 'PUT' : 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify({
          ...(hotel?.hotel_id && { hotel_id: hotel.hotel_id }),
          chain_id: data.chain_id,
          name: data.name,
          address: data.address,
          phone_numbers: data.phone_numbers?.filter((p) => p),
          emails: data.emails?.filter((e) => e),
          stars: data.stars,
          zone: data.zone,
          images: data.images,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            toast.error(
              'Sorry... An error occurred, the Hotel has not been saved.',
            );
          } else {
            reset();
            toast.success('The Hotel has been saved successfully!');
            refreshHotelData();
          }
        })
        .catch(() => {
          toast.error(
            'Sorry... An error occurred, the Hotel has not been saved.',
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
                  newHotel
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
              <h2 className='text-xl'>{hotel?.name ?? 'New Hotel'}</h2>
            </div>
          </div>
        </button>
        <section className='p-3' {...getCollapseProps()}>
          <form onSubmit={onSubmit}>
            <div className='relative z-0 w-full mb-6 group'>
              <select
                id='chain_id'
                {...register('chain_id')}
                className='form-input peer'
                placeholder=' '
                required
              >
                {hotelsChains.length &&
                  hotelsChains.map((hc) => (
                    <option key={hc.chain_id} value={hc.chain_id}>
                      {hc.name}
                    </option>
                  ))}
              </select>
              <label
                htmlFor='chain_id'
                className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Chain
              </label>
            </div>
            <div className='relative z-0 w-full mb-6 group'>
              <input
                type='text'
                id='name'
                {...register('name')}
                className='form-input peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='name'
                className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Name
              </label>
            </div>
            <div className='relative z-0 w-full mb-6 group'>
              <input
                type='text'
                id='address'
                {...register('address')}
                className='form-input peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='name'
                className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Address
              </label>
            </div>
            <div className='relative z-0 w-full mb-6 group'>
              <input
                type='text'
                id='zone'
                {...register('zone')}
                className='form-input peer'
                placeholder=' '
                required
              />
              <label
                htmlFor='zone'
                className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Zone
              </label>
            </div>
            <div className='relative z-0 w-full mb-6 group'>
              <input
                type='number'
                id='stars'
                {...register('stars')}
                className='form-input peer'
                placeholder=' '
                required
                min='1'
                max='5'
              />
              <label
                htmlFor='stars'
                className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
              >
                Stars
              </label>
            </div>
            <div className='mb-6'>
              {images?.map((im, i) => (
                <div key={i} className='relative z-0 w-full mb-4 group'>
                  <div className='flex'>
                    <div className='flex-grow'>
                      <input
                        type='text'
                        {...register(`images.${i}`)}
                        id={`image-${i}`}
                        className='form-input peer'
                        placeholder=' '
                        required
                      />
                      <label
                        htmlFor={`image-${i}`}
                        className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                      >
                        Image URL
                      </label>
                    </div>
                    <div className='ml-2'>
                      <button
                        onClick={() => {
                          const newImages = images.filter(
                            (image) => im != image,
                          );
                          setImages(newImages);
                          setValue('images', newImages);
                        }}
                        type='button'
                        className='text-red-600 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-auto px-3 py-2 text-center'
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newImages = [...(images ?? []), ''];
                  setImages(newImages);
                  setValue('images', newImages);
                }}
                type='button'
                className='text-gray-700 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full px-3 py-2 text-center'
              >
                <FontAwesomeIcon icon={faPlus} /> Add a new Image
              </button>
            </div>
            <div className='grid md:grid-cols-2 md:gap-6 mb-6'>
              <div>
                {phoneNumbers?.map((p, i) => (
                  <div key={i} className='relative z-0 w-full mb-4 group'>
                    <div className='flex'>
                      <div className='flex-grow'>
                        <input
                          type='tel'
                          {...register(`phone_numbers.${i}`)}
                          id={`phone-${i}`}
                          className='form-input peer'
                          placeholder=' '
                          required
                        />
                        <label
                          htmlFor={`phone-${i}`}
                          className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                        >
                          Phone number (613-613-6136)
                        </label>
                      </div>
                      <div className='ml-2'>
                        <button
                          onClick={() => {
                            const newPhoneNumbers = phoneNumbers.filter(
                              (pn) => pn != p,
                            );
                            setPhoneNumbers(newPhoneNumbers);
                            setValue('phone_numbers', newPhoneNumbers);
                          }}
                          type='button'
                          className='text-red-600 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-auto px-3 py-2 text-center'
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newPhoneNumbers = [...(phoneNumbers ?? []), ''];
                    setPhoneNumbers(newPhoneNumbers);
                    setValue('phone_numbers', newPhoneNumbers);
                  }}
                  type='button'
                  className='text-gray-700 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full px-3 py-2 text-center'
                >
                  <FontAwesomeIcon icon={faPlus} /> Add a new Phone Number
                </button>
              </div>
              <div>
                {emails.map((e, i) => (
                  <div key={i} className='flex'>
                    <div className='flex-grow'>
                      <div key={i} className='relative z-0 w-full mb-4 group'>
                        <input
                          type='email'
                          id={`email-${i}`}
                          {...register(`emails.${i}`)}
                          className='form-input peer'
                          placeholder=' '
                          required
                        />
                        <label
                          htmlFor={`email-${i}`}
                          className='peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                        >
                          Email
                        </label>
                      </div>
                    </div>
                    <div className='ml-2'>
                      <button
                        onClick={() => {
                          const newEmails = emails.filter((em) => em != e);
                          setEmails(newEmails);
                          setValue('emails', newEmails);
                        }}
                        type='button'
                        className='text-red-600 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-auto px-3 py-2 text-center'
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newEmails = [...(emails ?? []), ''];
                    setEmails(newEmails);
                    setValue('emails', newEmails);
                  }}
                  type='button'
                  className='text-gray-700 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full px-3 py-2 text-center'
                >
                  <FontAwesomeIcon icon={faPlus} /> Add a new Email
                </button>
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              {hotel?.hotel_id && (
                <button
                  type='button'
                  onClick={() => deleteHotel(hotel?.hotel_id)}
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
        <h1 className='text-2xl font-bold'>Edit Hotels</h1>
        <div>
          {hotels.length &&
            hotels.map((h) => <HotelCollapse key={h.hotel_id} hotel={h} />)}
          <HotelCollapse newHotel={true} />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
