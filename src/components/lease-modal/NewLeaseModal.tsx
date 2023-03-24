import Modal from "react-modal";
import {useForm} from "react-hook-form";
import {Room} from "@/src/types/Room";
import TextInput from "@/src/components/forms/TextInput";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {addDays} from "date-fns";
import {calcEndDate} from "@/src/utils/date-utils";
import DatePicker from "react-datepicker";
import SimpleSelect from "@/src/components/forms/SimpleSelect";
import {toast} from "react-toastify";

interface NewLeaseModalProps {
    isOpen: boolean;
    closeModal: () => void;
    hotelId: number;
}

interface NewLease {
    name: string;
    address: string;
    nas: string;
    email: string;
    phone_number: string;
    room_id: string;
    number_guests: number;
    start_date: Date;
    end_date: Date;
}

const NewLeaseModal = ({isOpen, closeModal, hotelId}: NewLeaseModalProps) => {
    Modal.setAppElement('.main');
    const { register, handleSubmit, reset, setValue, watch } = useForm<NewLease>();
    const [loadingRoomAvailabilties, setLoadingRoomAvailabilties] = useState(true);
    const [roomAvailabilities, setRoomAvailabilities] = useState<Room[]>([]);
    const [startDate, setStartDate] = useState<null | Date>(null);
    const [endDate, setEndDate] = useState<null | Date>(null);
    const roomId = watch("room_id");

    useEffect(() => {
        if (hotelId != null && startDate != null && endDate != null) {
            setLoadingRoomAvailabilties(true);
            fetch(
                `/api/get-rooms/${hotelId}?startDate=${dayjs(startDate).format('YYYY/MM/DD')}&endDate=${dayjs(endDate).format('YYYY/MM/DD')}&available=true`,
            )
                .then((res) => res.json())
                .then((data) => {
                    setRoomAvailabilities(data);
                    if (data.length) {
                        setValue('room_id', data[0].room_id)
                        setValue('number_guests', 1)
                    }
                    setLoadingRoomAvailabilties(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [hotelId, startDate, endDate]);

    const onSubmit = handleSubmit((data) => {
        const numberOfDays = Math.round(
            dayjs(String(endDate)).diff(String(startDate), 'days'),
        );
        const fullPrice = (roomAvailabilities.find(r => String(r.room_id) == data.room_id)?.price ?? 0) * numberOfDays;
        if (fullPrice > 0) {
            fetch(`/api/book/manual/`, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }),
                body: JSON.stringify({
                    name: data.name,
                    address: data.address,
                    nas: data.nas,
                    email: data.email,
                    phone_number: data.phone_number,
                    room_id: data.room_id,
                    number_guests: data.number_guests,
                    start_date: dayjs(data.start_date).format('YYYY/MM/DD'),
                    end_date: dayjs(data.end_date).format('YYYY/MM/DD'),
                    full_price: fullPrice
                }),
            })
                .then((r) => r.json())
                .then((data) => {
                    if (!data.error) {
                        closeModal();
                        toast.success("The lease has been successfully created! Thank you for booking with us!")
                    } else {
                        toast.error("An error occurred while creating the lease. Please try again later...")
                    }
                });
        }
    });

    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal}>
            <div className='bg-white text-gray-700'>
                <h1 className='text-2xl font-bold mb-3'>New Lease</h1>
                <form onSubmit={onSubmit}>
                    <div>
                        <TextInput
                            register={register}
                            name={'name'}
                            label={'Client Name'}
                        />
                        <TextInput
                            register={register}
                            name={'address'}
                            label={'Client Address'}
                        />
                        <TextInput
                            register={register}
                            name={'nas'}
                            label={'Client NAS'}
                        />
                        <TextInput
                            register={register}
                            name={'email'}
                            type={'email'}
                            label={'Client Email'}
                        />
                        <TextInput
                            register={register}
                            name={'phone_number'}
                            label={'Client Phone Number'}
                        />
                        <div className="mb-2">
                            <label className='text-xs text-gray-500'>Start & End Dates</label>
                            <DatePicker
                                className='border px-2 h-8 mb-3 text-sm rounded-lg block bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                                selected={startDate}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(dates) => {
                                    const [start, end] = dates;
                                    setStartDate(start);
                                    setValue('start_date', start!)
                                    if (start && end && Math.round(dayjs(String(end)).diff(String(start), 'days')) === 0) {
                                        setEndDate(addDays(start, 1))
                                        setValue('end_date', addDays(start, 1))
                                    } else {
                                        setEndDate(end)
                                        setValue('end_date', end!)
                                    }
                                }}
                                selectsRange={true}
                                placeholderText='Choose Dates'
                                closeOnScroll
                                minDate={new Date()}
                                maxDate={calcEndDate(6)}
                            />
                        </div>
                        { startDate && endDate ? (
                            <>
                                <SimpleSelect register={register} name={'room_id'} label={'Room Choice'} array={
                                    roomAvailabilities.map((ra) => {
                                        return {
                                            id: ra.room_id,
                                            value: `Room ${ra.room_id} (${ra.price}/night)`
                                        }
                                    })
                                } />
                                { roomId ? (
                                    <TextInput register={register} name={'number_guests'} label={'Number of Guests'} type='number' min={1} max={roomAvailabilities.find(r => String(r.room_id) == roomId)?.capacity ?? 2} />
                                ) : (
                                    <div
                                        className='flex p-4 my-2 mb-4 text-sm bg-gray-800 text-yellow-300 border-yellow-800 items-center rounded-lg'
                                        role='alert'
                                    >Please set the Room.</div>
                                )
                                }
                            </>
                        ) : (
                            <div
                                className='flex p-4 my-2 mb-4 text-sm bg-gray-600 text-yellow-400 border-yellow-800 items-center rounded-lg'
                                role='alert'
                            >Please set the Start and End Date.</div>
                        )
                        }
                        <button
                            type='submit'
                            className='button-dark'
                        >
                            Create Manual Lease
                        </button>
                    </div>
                </form>
                <div className='flex justify-end'>
                    <button onClick={() => {
                        reset();
                        closeModal();
                    }
                    } className='button-dark'>
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default NewLeaseModal;