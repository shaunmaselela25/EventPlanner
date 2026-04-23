import Image from "next/image";
import { notFound } from "next/navigation";

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

type EventMode = "online" | "offline" | "hybrid";

type EventDetails = {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
};

type EventPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseSlug(value: string): string {
  const normalizedSlug = value.trim().toLowerCase();

  if (!normalizedSlug || !SLUG_PATTERN.test(normalizedSlug)) {
    notFound();
  }

  return normalizedSlug;
}

function hasRequiredEventData(event: EventDetails | null): event is EventDetails {
  return Boolean(
    event &&
      event.title &&
      event.description &&
      event.overview &&
      event.image &&
      event.venue &&
      event.location &&
      event.date &&
      event.time &&
      event.mode &&
      event.organizer &&
      event.audience &&
      Array.isArray(event.agenda) &&
      event.agenda.length > 0 &&
      Array.isArray(event.tags)
  );
}

async function getEventBySlug(slug: string): Promise<EventDetails> {
  await connectDB();

  const event = await Event.findOne({ slug })
    .select(
      "title slug description overview image venue location date time mode audience agenda organizer tags"
    )
    .lean<EventDetails | null>();

  if (!hasRequiredEventData(event)) {
    notFound();
  }

  return event;
}

function formatMode(mode: EventMode): string {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

export default async function EventDetailsPage({ params }: EventPageProps) {
  const { slug: rawSlug } = await params;
  const slug = parseSlug(rawSlug);
  const event = await getEventBySlug(slug);

  return (
    <section id="event" className="space-y-10">
      <div className="header">
        <span className="pill">{formatMode(event.mode)}</span>
        <h1>{event.title}</h1>
        <p>{event.description}</p>
      </div>

      <div className="details">
        <div className="content">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              quality={95}
              className="banner object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>

          <div className="glass card-shadow flex flex-col gap-6 rounded-lg border border-border-dark p-6">
            <div className="flex flex-wrap gap-3">
              <span className="pill">{event.date}</span>
              <span className="pill">{event.time}</span>
              <span className="pill">{event.venue}</span>
              <span className="pill">{event.location}</span>
            </div>

            <div className="flex-col-gap-2">
              <h2>Overview</h2>
              <p>{event.overview}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex-col-gap-2">
                <h3>Event Details</h3>
                <ul className="space-y-2">
                  <li>
                    <strong>Organizer:</strong> {event.organizer}
                  </li>
                  <li>
                    <strong>Audience:</strong> {event.audience}
                  </li>
                  <li>
                    <strong>Venue:</strong> {event.venue}
                  </li>
                  <li>
                    <strong>Location:</strong> {event.location}
                  </li>
                </ul>
              </div>

              <div className="agenda">
                <h3>Agenda</h3>
                <ul className="space-y-2">
                  {event.agenda.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {event.tags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {event.tags.map((tag) => (
                  <span key={tag} className="pill">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="booking">
          <div className="signup-card">
            <div className="flex-col-gap-2">
              <h2>Book Your Spot</h2>
              <p>Reserve your seat and get event updates sent straight to your inbox.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass rounded-lg border border-border-dark p-4">
                <p className="text-sm text-light-200">Starts</p>
                <p>{event.date}</p>
              </div>
              <div className="glass rounded-lg border border-border-dark p-4">
                <p className="text-sm text-light-200">Format</p>
                <p>{formatMode(event.mode)}</p>
              </div>
            </div>

            <form id="book-event">
              <input type="hidden" name="slug" value={event.slug} />

              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button type="submit">Book Now</button>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
}
