import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
  
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const Page = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {});
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center mt-10">Welcome to EventPlanner</h1>
      <p className="text-center mt-4">The hub for all your event planning needs.</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h2 className="text-center">Upcoming Events</h2>
        <p className="text-center">Check out the latest events in your area.</p>
           <ul className="events">
                    {events && events.length > 0 && events.map((event: IEvent) => (
                        <li key={event.title} className="list-none">
                            <EventCard {...event} />
                        </li>
                    ))}
            </ul>
      </div>
    </section>
  );
};

export default Page;