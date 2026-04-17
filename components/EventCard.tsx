import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import pinIcon from "../app/public/icons/pin.svg";
import calendarIcon from "../app/public/icons/calendar.svg";
import clockIcon from "../app/public/icons/clock.svg";

interface Props {
    title: string;
    image: string | StaticImageData;
    slug: string;
    date?: string;
    time?: string;
    location?: string;
}

const EventCard = ({ title, image, slug, date, time, location }: Props) => {
  return (
    <Link href={`/events/${slug}`} className="block" id="event-card">
      <Image src={image} alt={title} width={300} height={200} className="poster" />

    <div className="flex flex-row gap-2">
        <Image src={pinIcon} alt="pin icon" width={16} height={16} />
        <p>{location}</p>
    </div>
      <p className="title">{title}</p>

      <div className="datetime">
        <div className="flex flex-row gap-2">
          <Image src={calendarIcon} alt="calendar icon" width={16} height={16} />
          <p>{date}</p>
        </div>
        <div>
            <Image src={clockIcon} alt="clock icon" width={16} height={16} />
            <p>{time}</p>
        </div>
      </div>

    </Link>
  )
}

export default EventCard