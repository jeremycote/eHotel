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
} from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Hotel } from '@/src/types/Hotel';
import HotelChain from '@/src/types/HotelChain';
import TextInput from '@/src/components/forms/TextInput';
import SimpleSelect from '@/src/components/forms/SimpleSelect';
import MultiTextInputWithDelete from '@/src/components/forms/MultiTextInputWithDelete';
import RoomsModal from '@/src/components/rooms/RoomsModal';
import Zone from "@/src/types/Zone";

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
  const [zones, setZones] = useState<Zone[]>([]);
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

  const refreshHotelZones = () => {
    setLoading(true);
    fetch(`/api/zones`)
        .then((res) => res.json())
        .then((data) => {
          setZones(data);
          setLoading(false);
        });
  };

  useEffect(() => {
    refreshHotelData();
    refreshHotelChainsData();
    refreshHotelZones();
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
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
          zone_id: data.zone_id,
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
        <section
          className='px-4 py-3 bg-slate-50 rounded'
          {...getCollapseProps()}
        >
          <form className='pb-5 pt-3' onSubmit={onSubmit}>
            <SimpleSelect
              register={register}
              name={'chain_id'}
              label={'Chain'}
              array={hotelsChains.map((hc) => {
                return { id: hc.chain_id, value: hc.name };
              })}
            />
            <TextInput register={register} name={'name'} label={'Name'} />
            <TextInput register={register} name={'address'} label={'Address'} />
            <SimpleSelect
                register={register}
                name={'zone_id'}
                label={'Zone'}
                array={zones.map((z) => {
                  return { id: z.zone_id, value: z.name };
                })}
            />
            <TextInput
              register={register}
              name={'stars'}
              label={'Stars'}
              type={'number'}
              min={1}
              max={5}
            />
            <MultiTextInputWithDelete
              register={register}
              /* @ts-ignore */
              setValue={(n, a) => setValue(n, a)}
              name={'images'}
              label={'Image URL'}
              array={images}
            />
            <div className='grid md:grid-cols-2 md:gap-6 mb-6'>
              <MultiTextInputWithDelete
                register={register}
                /* @ts-expect-error */
                setValue={(n, a) => setValue(n, a)}
                name={'phone_numbers'}
                label={'Phone Number'}
                array={phoneNumbers}
              />
              <MultiTextInputWithDelete
                register={register}
                /* @ts-expect-error */
                setValue={(n, a) => setValue(n, a)}
                name={'emails'}
                label={'Email Address'}
                array={emails}
              />
            </div>
            <div className='flex justify-end gap-2'>
              {hotel?.hotel_id && (
                <button
                  type='button'
                  onClick={() => deleteHotel(hotel?.hotel_id)}
                  className='button-danger'
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
          <div className='flex'>
            <button
              onClick={() => setModalIsOpen(true)}
              className='button-dark w-full'
            >
              Edit Rooms
            </button>
          </div>
        </section>
        {hotel && isExpanded && (
          <RoomsModal
            isOpen={modalIsOpen}
            closeModal={() => setModalIsOpen(false)}
            hotelId={hotel.hotel_id}
          />
        )}
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
