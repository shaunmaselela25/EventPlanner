import ExploreBtn from "@/components/ExploreBtn"
import Navbar from "@/components/Navbar"
import EventCard from "@/components/EventCard"
import { events } from "@/lib/constants"
  

const page = () => {
  return (
    <section>
      <h1 className="text-center mt-10">Welcome to EventPlanner</h1>
      <p className="text-center mt-4">The hub for all your event planning needs.</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h2 className="text-center">Upcoming Events</h2>
        <p className="text-center">Check out the latest events in your area.</p>
        <ul className="events">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard title={event.title} image={event.image} slug={event.slug} date={event.date} time={event.time} location={event.location} />
            </li>
          ))}
        </ul>
      </div>
    </section>

  )
}

export default page