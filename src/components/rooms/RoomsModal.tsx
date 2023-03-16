import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { Room } from '@/src/types/Room';
import useCollapse from 'react-collapsed';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretUp,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import SimpleSelect from '@/src/components/forms/SimpleSelect';
import TextInput from '@/src/components/forms/TextInput';
import { RoomData } from '@/src/pages/api/admin/hotel-rooms';
import CreatableSelect from 'react-select/creatable';
interface RoomsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  hotelId: number;
}

interface RoomCollapseProps {
  newRoom?: boolean;
  room?: Room;
  rt: { room_type_id: number; name: string }[];
  a: { amenity_id: number; name: string }[];
}

const RoomsModal = ({ isOpen, closeModal, hotelId }: RoomsModalProps) => {
  Modal.setAppElement('.main');

  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<{ hotel_id: number; name: string }[]>(
    [],
  );
  const [defaultAmenities, setDefaultAmenities] = useState<
    { amenity_id: number; name: string }[]
  >([]);
  const [defaultRoomTypes, setDefaultRoomTypes] = useState<
    { room_type_id: number; name: string }[]
  >([]);
  const [isLoading, setLoading] = useState(false);

  const refreshRoomData = () => {
    setLoading(true);
    fetch(`/api/admin/hotel-rooms?hotelId=${hotelId}`)
      .then((res) => res.json())
      .then((data: RoomData) => {
        setRooms(data.rooms);
        setHotels(data.hotels);
        setDefaultAmenities(data.amenities);
        setDefaultRoomTypes(data.room_types);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshRoomData();
  }, [hotelId]);

  const RoomCollapse = ({ newRoom, room, rt, a }: RoomCollapseProps) => {
    const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(
        {value: room?.room_type_id, label: rt.find(t => t.room_type_id === room?.room_type_id)?.name},
    );
    const [selectedAmentitiesId, setSelectedAmentitiesId] = useState<
      { label: string; value: string }[]
    >(
      a
        .filter((am) => room?.amenities.includes(am.amenity_id))
        .map((am) => {
          return {
            label: am.name,
            value: String(am.amenity_id),
          };
        }),
    );
    const [isLoadingRoomTypes, setLoadingRoomTypes] = useState(false);
    const [isLoadingAmenities, setLoadingAmenities] = useState(false);
    const [roomTypes, setRoomTypes] = useState(rt);
    const [amenities, setAmenities] = useState(a);
    const { getToggleProps, getCollapseProps, isExpanded } = useCollapse();
    const { register, handleSubmit, reset, setValue } = useForm<Room>({
      defaultValues: {...room},
    });

    const deleteRoom = (room_id: number) => {
      fetch('/api/admin/hotel-rooms', {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify({
          room_id: room_id,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            toast.error(
              'Sorry... An error occurred, the Room has not been deleted.',
            );
          } else {
            reset();
            toast.success('The Room has been deleted successfully!');
            refreshRoomData();
          }
        })
        .catch(() => {
          toast.error(
            'Sorry... An error occurred, the Room has not been deleted.',
          );
        });
    };

    const onSubmit = handleSubmit((data) => {
      fetch('/api/admin/hotel-rooms', {
        method: room?.room_id ? 'PUT' : 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify({
          ...(room?.room_id && { room_id: room.room_id }),
          hotel_id: data.hotel_id,
          price: data.price,
          capacity: data.capacity,
          extendable: data.extendable,
          view: data.view,
          room_type_id: data.room_type_id,
          amenities: data.amenities,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            toast.error(
              'Sorry... An error occurred, the Room has not been saved.',
            );
          } else {
            reset();
            toast.success('The Room has been saved successfully!');
            refreshRoomData();
          }
        })
        .catch(() => {
          toast.error(
            'Sorry... An error occurred, the Room has not been saved.',
          );
        });
    });

    const handleCreateRoomType = (inputValue: string) => {
      fetch('/api/admin/room-types', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify({
          room_type: inputValue,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            toast.error(
              'Sorry... An error occurred while creating the Room Type',
            );
          } else {
            setLoadingRoomTypes(true);
            fetch(`/api/admin/room-types`)
              .then((res) => res.json())
              .then((data) => {
                setRoomTypes(data);
                setLoadingRoomTypes(false);
              });
            setSelectedRoomTypeId({value: data.created, label: inputValue})
            setValue('room_type_id', data.created);
          }
        })
        .catch(() => {
          toast.error(
            'Sorry... An error occurred, the Room has not been saved.',
          );
        });
    };

    const handleCreateAmenities = (inputValue: string) => {
      fetch('/api/admin/amenities', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
        body: JSON.stringify({
          amenity: inputValue,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            toast.error(
              'Sorry... An error occurred while creating the Amenity',
            );
          } else {
            setLoadingAmenities(true);
            fetch(`/api/admin/amenities`)
              .then((res) => res.json())
              .then((data) => {
                setAmenities(data);
                setLoadingAmenities(false);
              });
            setSelectedAmentitiesId([
              ...selectedAmentitiesId,
              {
                value: data.created,
                label: inputValue,
              },
            ]);
            setValue('amenities', [...selectedAmentitiesId.map(sa => sa.value), data.created]);
          }
        })
        .catch(() => {
          toast.error(
            'Sorry... An error occurred, the Room has not been saved.',
          );
        });
    };

    return isLoading ? (
      <div>Loading...</div>
    ) : (
      <div className='my-2'>
        <button className='w-full' {...getToggleProps()}>
          <div className='border rounded p-3 my-1 flex items-center'>
            <div className='mr-5'>
              <FontAwesomeIcon
                icon={
                  newRoom
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
                {`Room ID: ${room?.room_id}` ?? 'New Room'}
              </h2>
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
              name={'hotel_id'}
              label={'Hotel'}
              array={hotels.map((h) => {
                return { id: h.hotel_id, value: h.name };
              })}
            />
            <div className='mb-6'>
              <label className='text-xs text-gray-500'>Room Types</label>
              <CreatableSelect
                isClearable
                isDisabled={isLoading || isLoadingRoomTypes}
                isLoading={isLoading || isLoadingRoomTypes}
                onChange={(newValue: number) => {
                  setSelectedRoomTypeId(newValue);
                  setValue('room_type_id', newValue);
                }}
                onCreateOption={handleCreateRoomType}
                options={roomTypes.map((rt) => {
                  return {
                    label: rt.name,
                    value: rt.room_type_id,
                  };
                })}
                value={selectedRoomTypeId}
              />
            </div>
            <div className='mb-6'>
              <label className='text-xs text-gray-500'>Amenities</label>
              <CreatableSelect
                isClearable
                isMulti
                isDisabled={isLoading || isLoadingAmenities}
                isLoading={isLoading || isLoadingAmenities}
                onChange={(newValue) => {
                  setValue(
                    'amenities',
                    newValue.map((am) => Number(am.value)),
                  );
                  setSelectedAmentitiesId(newValue);
                }}
                onCreateOption={handleCreateAmenities}
                options={a.map((rt) => {
                  return {
                    label: rt.name,
                    value: rt.amenity_id,
                  };
                })}
                value={selectedAmentitiesId}
              />
            </div>
            <TextInput
              register={register}
              name={'price'}
              label={'Price'}
              type={'number'}
              min={0}
            />
            <TextInput
              register={register}
              name={'capacity'}
              label={'Capacity'}
              type={'number'}
              min={0}
            />
            <SimpleSelect
              register={register}
              name={'extendable'}
              label={'Extendable'}
              array={[
                { id: 'true', value: 'Yes' },
                { id: 'false', value: 'No' },
              ]}
            />
            <TextInput
              register={register}
              name={'damages'}
              label={'Damages'}
              required={false}
            />
            <TextInput register={register} name={'view'} label={'View'} />
            <div className='flex justify-end gap-2'>
              {room?.room_id && (
                <button
                  type='button'
                  onClick={() => deleteRoom(room?.room_id)}
                  className='button-danger'
                >
                  Delete
                </button>
              )}
              <button
                type='submit'
                className='hover:bg-blue-800 focus:ring-4 text-white focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800'
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
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <div className='bg-white text-gray-700'>
        <h1 className='text-2xl font-bold'>Edit Rooms</h1>
        <div>
          {rooms.length &&
            rooms.map((r) => (
              <RoomCollapse
                key={r.room_id}
                a={defaultAmenities}
                rt={defaultRoomTypes}
                room={r}
              />
            ))}
          <RoomCollapse
            newRoom={true}
            a={defaultAmenities}
            rt={defaultRoomTypes}
          />
        </div>
      </div>
    </Modal>
  );
};

export default RoomsModal;
