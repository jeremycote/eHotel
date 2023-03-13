import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useRoles from "@/src/hooks/use-roles";
import useUser from "@/src/hooks/use-user";
import {AsyncStateStates} from "@/src/types/AsyncState";
import UserRole from "@/src/types/UserRole";
import HotelChain from "@/src/types/HotelChain";
import useCollapse from "react-collapsed";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {getBookHotelRoomRoute} from "@/src/config/routes";

interface HotelChainCollapseProps {
    hotelChain: HotelChain
}

export default function EmployeeDashboard() {
    const router = useRouter();

    const roles = useRoles();

    if (
        roles.status === AsyncStateStates.Success &&
        !roles.data.includes(UserRole.Employee)
    ) {
        router.push('/');
    }

    const user = useUser();

    const [hotelChains, setHotelChains] = useState<HotelChain[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/get-hotel-chains`)
            .then((res) => res.json())
            .then((data) => {
                setHotelChains(data);
                setLoading(false);
            });
    }, [user]);


    const HotelChainCollapse = ({hotelChain}: HotelChainCollapseProps) => {
        const { getToggleProps, getCollapseProps, isExpanded } = useCollapse();

        return (
            <div className='my-2'>
                <button className='w-full' {...getToggleProps()}>
                    <div className='border rounded p-3 my-3 flex items-center'>
                        <div className='mr-5'>
                            <FontAwesomeIcon icon={isExpanded ? faCaretUp : faCaretDown} />
                        </div>
                        <div className='text-left'>
                            <h2 className='text-xl'>{hotelChain.name}</h2>
                        </div>
                    </div>
                </button>
                <section className='p-3' {...getCollapseProps()}>
                    <div>
                        {JSON.stringify(hotelChain)}
                    </div>
                </section>
            </div>
        );
    };

    return (
        <div className="p-3">
            <h1 className="text-2xl font-bold">Edit Hotel Chains</h1>
            <div>
                {JSON.stringify(hotelChains)}
            </div>
        </div>
    );
}
