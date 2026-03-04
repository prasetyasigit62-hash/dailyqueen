import Image from 'next/image';
import Opening from '../../public/coveropening.jpg';

export default function Maintenance() {
    return (
        <div className="bg-amber-900 h-screen relative">
            <Image src={Opening} alt="Opening" layout="fill" objectFit="cover" />
        </div>
    );
}
