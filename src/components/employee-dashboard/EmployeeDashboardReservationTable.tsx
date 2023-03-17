import Reservation from "@/src/types/Reservation";
import dayjs from "dayjs";
import {toast} from "react-toastify";

interface EmployeeDashboardReservationTableProps {
    reservations: Reservation[]
    refreshTables: () => void
}
const EmployeeDashboardReservationTable = ({reservations, refreshTables}: EmployeeDashboardReservationTableProps) => {

    const changeToLease = (reservation_id: number) => {
        fetch(`/api/employees/leases/${reservation_id}`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            })
        })
            .then((r) => r.json())
            .then((data) => {
                if (data) {
                    toast.success(
                        'The reservation has been successfully migrated to a Lease.',
                    );
                    refreshTables();
                } else {
                    toast.error(
                        'Sorry... An error occurred, the reservation has not been saved.',
                    );
                }
            })
            .catch(() => {
                toast.error(
                    'Sorry... An error occurred, the reservation has not been saved.',
                );
            });
    }

    return (
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                <tr>
                    <th scope='col' className='px-6 py-3'>
                        Reservation ID
                    </th>
                    <th scope='col' className='px-6 py-3'>
                        Dates
                    </th>
                    <th scope='col' className='px-6 py-3'>
                        Name
                    </th>
                    <th scope='col' className='px-6 py-3'>
                        Room ID
                    </th>
                    <th scope='col' className='px-6 py-3'>
                        Price
                    </th>
                    <th scope='col' className='px-6 py-3'>
                        Number of Guests
                    </th>
                    <th scope='col' className='px-6 py-3'>
                        Action
                    </th>
                </tr>
                </thead>
                <tbody>
                {reservations.map((r) => (
                    <tr
                        key={r.reservation_id}
                        className='border-b bg-gray-800 border-gray-700 hover:bg-gray-600'
                    >
                        <th
                            scope='row'
                            className='px-6 py-4 font-medium text-white whitespace-nowrap'
                        >
                            {r.reservation_id}
                        </th>
                        <th
                            scope='row'
                            className='px-6 py-4 font-medium text-white whitespace-nowrap'
                        >
                            {dayjs(r.start_date).format('DD/MM/YYYY')} to {dayjs(r.end_date).format('DD/MM/YYYY')}
                        </th>
                        <th
                            scope='row'
                            className='px-6 py-4 font-medium text-white whitespace-nowrap'
                        >
                            {r.client[0]?.name}
                        </th>
                        <th
                            scope='row'
                            className='px-6 py-4 font-medium text-white whitespace-nowrap'
                        >
                            {r.room[0].room_id}
                        </th>
                        <td className='px-6 py-4 text-white'>
                            ${r.price}
                        </td>
                        <td className='px-6 py-4 text-white'>
                            {r.number_guests}
                        </td>
                        <td className='px-6 py-4 text-white'>
                            <button onClick={() => changeToLease(r.reservation_id)} type="button" className="button-dark">
                                Change to lease
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default EmployeeDashboardReservationTable;