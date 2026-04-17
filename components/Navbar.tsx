import Link from 'next/link'
import Image from 'next/image';
import logo from '../app/public/icons/logo.png';

const Navbar = () => {
  return (
    <header>
        <nav>
            <Link href="/" className="logo">
                <Image src={logo} alt="EventPlanner Logo" width={24} height={50} />

                <p>EventPlanner</p>
            </Link>

            <ul>
                <Link href="/">Home</Link>
                <Link href="/events">Events</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar