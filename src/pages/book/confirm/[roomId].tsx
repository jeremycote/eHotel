import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getLoginRoute } from "@/src/config/routes";

export default function ClientDashboard() {
    const { data, status } = useSession();
    const router = useRouter();
    const { roomId } = router.query;

    if (status === 'loading') {
        return <h1>Loading</h1>;
    }

    if (status === 'unauthenticated') {
        router.push(getLoginRoute(`/book/confirm/${roomId}`));
    }

    return <h1>Book</h1>;
}
