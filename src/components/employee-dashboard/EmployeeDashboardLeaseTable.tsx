import dayjs from "dayjs";
import {toast} from "react-toastify";
import {FullLease} from "@/src/types/Lease";

interface EmployeeDashboardLeaseTableProps {
    leases: FullLease[];
    refreshTables: () => void;
}

const EmployeeDashboardReservationTable = ({leases, refreshTables}: EmployeeDashboardLeaseTableProps) => {

    const markAsPaid = (lease_id: number) => {
        fetch(`/api/admin/leases`, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
            body: JSON.stringify({
                lease_id: lease_id
            }),
        })
            .then((r) => r.json())
            .then((data) => {
                if (data) {
                    toast.success(
                        'The Lease has been marked as Paid.',
                    );
                    refreshTables();
                } else {
                    toast.error(
                        'Sorry... An error occurred, the lease has not been marked as paid.',
                    );
                }
            })
            .catch(() => {
                toast.error(
                    'Sorry... An error occurred, the lease has not been marked as paid.',
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
                        Approved By
                    </th>
                    <th scope='col' className='px-6 py-3'>
                        Paid
                    </th>
                    { leases.filter(l => !l.paid).length > 0 &&
                        <th scope='col' className='px-6 py-3'>
                            Action
                        </th>
                    }
                </tr>
                </thead>
                <tbody>
                {leases.map((l) => (
                    l.reservation &&
                            <tr
                                key={l.lease_id}
                                className='border-b bg-gray-800 border-gray-700 hover:bg-gray-600'
                            >
                                <th
                                    scope='row'
                                    className='px-6 py-4 font-medium text-white whitespace-nowrap'
                                >
                                    {l.reservation.reservation_id}
                                </th>
                                <th
                                    scope='row'
                                    className='px-6 py-4 font-medium text-white whitespace-nowrap'
                                >
                                    {dayjs(l.reservation.start_date).format('DD/MM/YYYY')} to {dayjs(l.reservation.end_date).format('DD/MM/YYYY')}
                                </th>
                                <th
                                    scope='row'
                                    className='px-6 py-4 font-medium text-white whitespace-nowrap'
                                >
                                    {/* @ts-ignore */}
                                    {l.reservation.client[0]?.name}
                                </th>
                                <th
                                    scope='row'
                                    className='px-6 py-4 font-medium text-white whitespace-nowrap'
                                >
                                    {/* @ts-ignore */}
                                    {l.reservation.room[0].room_id}
                                </th>
                                <td className='px-6 py-4 text-white'>
                                    ${l.reservation.price}
                                </td>
                                <td className='px-6 py-4 text-white'>
                                    {l.reservation.number_guests}
                                </td>
                                <td className='px-6 py-4 text-white'>
                                    {l.employee.name} (ID: {l.employee.id})
                                </td>
                                <td className='px-6 py-4 text-white'>
                                    {l.paid ? 'True' : 'False'}
                                </td>
                                { !l.paid &&
                                    <td className='px-6 py-4 text-white'>
                                        <button onClick={() => markAsPaid(l.lease_id)} type="button" className="button-dark">
                                            Mark as Paid
                                        </button>
                                    </td>
                                }
                            </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default EmployeeDashboardReservationTable;