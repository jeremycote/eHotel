import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {getLoginRoute, getPostBookRoute} from "@/src/config/routes";
import {useEffect, useState} from "react";
import {FullRoomData} from "@/src/types/Room";
import {useForm} from "react-hook-form";

interface BookingFormData {
    numberGuests: number;
}

export default function ClientDashboard() {
    const { status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [room, setRoom] = useState<FullRoomData | null>(null);
    const { roomId, startDate, endDate } = router.query;

    const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>();
    const onSubmit = handleSubmit(data => {
        fetch(`/api/book/confirm/`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
            body: JSON.stringify({
                roomId,
                numberGuests: data.numberGuests,
                startDate,
                endDate,
                fullPrice: room?.full_price
            })
        }).then(r => r.json()).then(data => {
            if (data) {
                router.push("/")
            } else {
                console.error("Error")
            }
        })
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push(getLoginRoute(`/book/confirm/${roomId}`));
        }
    }, [])

    useEffect(() => {
        if (roomId && startDate && endDate) {
            setLoading(true);
            fetch(
                `/api/get-room/${roomId}?startDate=${startDate}&endDate=${endDate}&available=true`,
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.length) {
                        setRoom(data[0])
                    }
                    setLoading(false);
                });
        }
    }, [roomId]);

    return (
        loading ? <p>Loading...</p> : (
            <div className="pt-10">
                <h1 className="text-xl">{room?.hotel_name} ({room?.hotel_stars} stars)</h1>
                <p className="text-sm">{room?.hotel_address}</p>
                <h2 className="text-lg">Room {room?.room_type} (${room?.price}/night), total: ${room?.full_price}</h2>
                <p>Capacity: {room?.capacity}, Extendable: {room?.extendable ? "Yes": "No"}, View: {room?.view}</p>
                <p>{room?.room_amenities}</p>


                <form onSubmit={onSubmit}>
                    <label htmlFor="guest_numbers">Number of guests</label>
                    <br/>
                    <input {...register('numberGuests')} id="guest_numbers" type="number" value="1" min="1" max={room?.capacity} />
                    <br/>
                    {errors.numberGuests && <p role="alert">{errors.numberGuests?.message}</p>}
                    <button type="submit">Book for ${room?.full_price}</button>
                </form>
            </div>
        )
    )
}
