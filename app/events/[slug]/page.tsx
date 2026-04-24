import Image from "next/image";
import { notFound } from "next/navigation";

import BookingEvent from "@/components/BookingEvent";
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

type AgendaItem = {
  time: string;
  activity: string;
};

type EventPageData = {
  _id: string;
  description: string;
  image: string;
  overview: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  agenda: string[];
  audience: string;
  tags: string[];
  organizer: string;
};

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

type EventDetailsItemProps = {
  icon: string;
  alt: string;
  label: string;
};

type EventAgendaProps = {
  agendaItems: AgendaItem[];
};

type EventTagsProps = {
  tags: string[];
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function EventDetailsItem({ icon, alt, label }: EventDetailsItemProps) {
  return (
    <div className="flex flex-row items-center gap-2">
      <Image src={icon} alt={alt} width={16} height={16} />
      <p>{label}</p>
    </div>
  );
}

function EventAgenda({ agendaItems }: EventAgendaProps) {
  if (agendaItems.length === 0) {
    return null;
  }

  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item) => (
          <li
            key={`${item.time}-${item.activity}`}
            className="flex flex-row items-center gap-2"
          >
            <p>{item.time}</p>
            <p>{item.activity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EventTags({ tags }: EventTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {tags.map((tag) => (
        <div className="pill" key={tag}>
          {tag}
        </div>
      ))}
    </div>
  );
}

function parseSlug(value: string): string {
  const normalizedSlug = value.trim().toLowerCase();

  if (!normalizedSlug || !SLUG_PATTERN.test(normalizedSlug)) {
    notFound();
  }

  return normalizedSlug;
}

function parseAgendaItems(agenda: string[]): AgendaItem[] {
  if (!Array.isArray(agenda) || agenda.length === 0) {
    return [];
  }

  const firstItem = agenda[0];

  try {
    const parsed = JSON.parse(firstItem) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((item) => {
      if (
        typeof item === "object" &&
        item !== null &&
        "time" in item &&
        "activity" in item &&
        typeof item.time === "string" &&
        typeof item.activity === "string"
      ) {
        return [{ time: item.time, activity: item.activity }];
      }

      return [];
    });
  } catch {
    return agenda
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({ time: "", activity: item }));
  }
}

function parseTags(tags: string[]): string[] {
  if (!Array.isArray(tags) || tags.length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(tags[0]) as unknown;
    if (!Array.isArray(parsed)) {
      return tags.filter(Boolean);
    }

    return parsed.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0);
  } catch {
    return tags.filter((tag) => tag.trim().length > 0);
  }
}

async function getEvent(slug: string): Promise<EventPageData> {
  await connectDB();

  const event = await Event.findOne({ slug })
    .select(
      "_id description image overview date time location mode agenda audience tags organizer"
    )
    .lean<EventPageData | null>();

  if (
    !event ||
    !event.description ||
    !event.image ||
    !event.overview ||
    !event.date ||
    !event.time ||
    !event.location ||
    !event.mode
  ) {
    notFound();
  }

  return event;
}

async function getBookingsCount(eventId: string): Promise<number> {
  return Booking.countDocuments({ eventId });
}

export default async function EventDetailsPage({ params }: EventPageProps) {
  const { slug: rawSlug } = await params;
  const slug = parseSlug(rawSlug);
  const event = await getEvent(slug);
  const bookings = await getBookingsCount(event._id);
  const agendaItems = parseAgendaItems(event.agenda);
  const parsedTags = parseTags(event.tags);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{event.description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            src={event.image}
            alt="Event Banner"
            width={1200}
            height={800}
            quality={95}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>

            <EventDetailsItem
              icon="/icons/calendar.svg"
              alt="calendar icon"
              label={event.date}
            />
            <EventDetailsItem
              icon="/icons/clock.svg"
              alt="clock icon"
              label={event.time}
            />
            <EventDetailsItem
              icon="/icons/pin.svg"
              alt="pin icon"
              label={event.location}
            />
            <EventDetailsItem
              icon="/icons/mode.svg"
              alt="mode icon"
              label={event.mode}
            />
            <EventDetailsItem
              icon="/icons/audience.svg"
              alt="audience icon"
              label={event.audience}
            />
          </section>

          <EventAgenda agendaItems={agendaItems} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{event.organizer}</p>
          </section>

          <EventTags tags={parsedTags} />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p>
                {bookings} {bookings === 1 ? "person has" : "people have"} booked
                for this event.
              </p>
            ) : (
              <p>Be the first to book for this event!</p>
            )}
            <BookingEvent />
          </div>
        </aside>
      </div>
    </section>
  );
}
