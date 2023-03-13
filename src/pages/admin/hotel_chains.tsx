import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useRoles from "@/src/hooks/use-roles";
import useUser from "@/src/hooks/use-user";
import {AsyncStateStates} from "@/src/types/AsyncState";
import UserRole from "@/src/types/UserRole";
import HotelChain from "@/src/types/HotelChain";
import useCollapse from "react-collapsed";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp, faMinus, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {getBookHotelRoomRoute} from "@/src/config/routes";
import FullHotelChain from "@/src/types/HotelChain";
import {useForm} from "react-hook-form";

interface HotelChainCollapseProps {
    hotelChain: FullHotelChain
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

    const [hotelChains, setHotelChains] = useState<FullHotelChain[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/admin/get-hotel-chains`)
            .then((res) => res.json())
            .then((data) => {
                setHotelChains(data);
                setLoading(false);
            });
    }, [user]);


    const HotelChainCollapse = ({hotelChain}: HotelChainCollapseProps) => {
        const { getToggleProps, getCollapseProps, isExpanded } = useCollapse();
        const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<FullHotelChain>({defaultValues: hotelChain});

        const [phoneNumbers, setPhoneNumbers] = useState<string[]>(hotelChain?.phone_numbers ?? []);
        const [emails, setEmails] = useState<string[]>(hotelChain?.emails ?? []);

        const onSubmit = handleSubmit((data) => {
            fetch(`/api/admin/hotel_chains/${data.chain_id}/`, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }),
                body: JSON.stringify({
                    name: data.name,
                    address: data.address,
                    phone_numbers: data.phone_numbers?.filter(p => p),
                    emails: data.emails?.filter(e => e)
                }),
            })
                .then((r) => r.json())
                .then((data) => {
                    if (!data) {
                        console.error('Error');
                    }
                });
        });

        return (
            <div className='my-2'>
                <button className='w-full' {...getToggleProps()}>
                    <div className='border rounded p-3 my-1 flex items-center'>
                        <div className='mr-5'>
                            <FontAwesomeIcon icon={isExpanded ? faCaretUp : faCaretDown} />
                        </div>
                        <div className='text-left'>
                            <h2 className='text-xl'>{hotelChain.name}</h2>
                        </div>
                    </div>
                </button>
                <section className='p-3' {...getCollapseProps()}>
                    <form onSubmit={onSubmit}>
                        <div className="relative z-0 w-full mb-6 group">
                            <input type="text" id="name" {...register('name')}
                                   className="form-input peer"
                                   placeholder=" " required/>
                            <label htmlFor="name" className="peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Chain Name
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                            <input type="text" id="address" {...register("address")}
                                   className="form-input peer"
                                   placeholder=" " required/>
                            <label htmlFor="name" className="peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Address
                            </label>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6 mb-6">
                            <div>
                                { phoneNumbers?.map((p, i) => (
                                    <div key={i} className="relative z-0 w-full mb-4 group">
                                        <div className="flex">
                                            <div className="flex-grow">
                                                <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" {...register(`phone_numbers.${i}`)}
                                                       id={`phone-${i}`}
                                                       className="form-input peer"
                                                       placeholder=" " required/>
                                                <label htmlFor={`phone-${i}`}
                                                       className="peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone
                                                    number (613-613-6136)</label>
                                            </div>
                                            <div className="ml-2">
                                                <button onClick={() => setPhoneNumbers(phoneNumbers.filter(pn => pn != p))} type="button"
                                                        className="text-red-600 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-auto px-3 py-2 text-center">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                }
                                <button onClick={() => setPhoneNumbers([...phoneNumbers ?? [], ''])} type="button"
                                        className="text-gray-700 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full px-3 py-2 text-center">
                                    <FontAwesomeIcon icon={faPlus} /> Add a new Phone Number
                                </button>
                            </div>
                            <div>
                                { emails.map((e, i) => (
                                    <div className="flex">
                                        <div className="flex-grow">
                                            <div key={i} className="relative z-0 w-full mb-6 group">
                                                <input type="email" id={`email-${i}`} {...register(`emails.${i}`)}
                                                       className="form-input peer"
                                                       placeholder=" " required/>
                                                <label htmlFor={`email-${i}`}
                                                       className="peer-focus:font-medium form-label peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                                            </div>
                                        </div>
                                        <div className="ml-2">
                                            <button onClick={() => setEmails(emails.filter(em => em != e))} type="button"
                                                    className="text-red-600 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-auto px-3 py-2 text-center">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                    ))}
                                <button onClick={() => setEmails([...emails ?? [], ''])} type="button"
                                        className="text-gray-700 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full px-3 py-2 text-center">
                                    <FontAwesomeIcon icon={faPlus} /> Add a new Email
                                </button>
                            </div>
                        </div>
                        <button type="submit"
                                className="hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Submit
                        </button>
                    </form>
                </section>
            </div>
        );
    };

    return (
        <div className="p-3">
            <h1 className="text-2xl font-bold">Edit Hotel Chains</h1>
            <div>
                { hotelChains.length && hotelChains.map(hc => (
                  <HotelChainCollapse key={hc.chain_id} hotelChain={hc} />
                ))
                }
            </div>
        </div>
    );
}
