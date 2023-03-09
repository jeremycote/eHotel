import { Hotel } from '@/src/types/Hotel';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {Reservation} from "@/src/types/Reservation";

export default function HotelPage() {
    const router = useRouter();
    const { employeeId } = router.query;

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (employeeId != null) {
            setLoading(true);
            fetch(`/api/employees/get-hotel-data/${employeeId}`)
                .then((res) => res.json())
                .then((data) => {
                    setReservations(data);
                    setLoading(false);
                });
        }
    }, [employeeId]);

    return (
        <div>
            <h1>{`Employee id: ${employeeId}`}</h1>
            <p>{ JSON.stringify(reservations) }</p>
        </div>
    );
}
