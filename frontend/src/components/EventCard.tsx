import type React from "react";
import type { EventCardProps } from "../interfaces/interface";
import { MapPin } from "lucide-react";

const isToday = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {

    const showGreenDot = isToday(event.date);

    return (
        <div className='w-full rounded-lg shadow overflow-hidden hover:scale-102 hover:shadow-primary/25 duration-300 bg-white p-4'>
            <h3 className="text-md sm:text-xl font-semibold text-primary">{event.title}</h3>
            <p className="text-xs flex text-gray-600 items-center gap-1">
                {showGreenDot && (
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                )}{new Date(event.date).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1"><MapPin className='w-4 h-4 inline-block mb-1 mr-1' />
                {event.location}</p>
            {event.description && <p className="mt-2 text-xs sm:text-sm text-gray-700">{event.description}</p>}
        </div>
    );
};

export default EventCard;
