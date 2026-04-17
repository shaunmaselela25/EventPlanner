'use client';

import Image from 'next/image';
import arrowDown from '../app/public/icons/arrow-down.svg';

const ExploreBtn = () => {
  return (
    <div className="flex justify-center mt-7">
      <button
        type="button"
        id="explore-btn"
        className="inline-flex items-center gap-2 text-white font-bold py-3 px-5 rounded-full hover:bg-blue"
        onClick={() => {
          console.log('Click!');
          window.location.href = '/Events';
        }}
      >
        Explore Events
        <Image
          src={arrowDown}
          alt="arrow-down"
          width={16}
          height={16}
          style={{ width: '16px', height: '16px' }}
        />
      </button>
    </div>
  );
};

export default ExploreBtn;