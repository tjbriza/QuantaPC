import { NavLink } from 'react-router-dom';

export default function DashboardNavigation() {
  return (
    <div className='flex flex-row items-center mt-16 mb-8 gap-8'>
      <h1 className='hero-main-title font-bold leading-tight antialiased font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl'>
        Dashboard
      </h1>
      <nav className='mt-4'>
        <ul className='flex flex-row space-y-2 gap-16'>
          <li>
            <NavLink
              to='profile'
              className={({ isActive }) =>
                isActive
                  ? 'font-bold underline'
                  : 'text-black-600 hover:underline'
              }
            >
              Account Details
            </NavLink>
          </li>
          <li>
            <NavLink
              to='orders'
              className={({ isActive }) =>
                isActive
                  ? 'font-bold underline'
                  : 'text-black-600 hover:underline'
              }
            >
              My Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to='addresses'
              className={({ isActive }) =>
                isActive
                  ? 'font-bold underline'
                  : 'text-black-600 hover:underline'
              }
            >
              My Addresses
            </NavLink>
          </li>
          <li>
            <NavLink
              to='tracking'
              className={({ isActive }) =>
                isActive
                  ? 'font-bold underline'
                  : 'text-black-600 hover:underline'
              }
            >
              Track Order
            </NavLink>
          </li>
          <li>
            <NavLink
              to='wishlist'
              className={({ isActive }) =>
                isActive
                  ? 'font-bold underline'
                  : 'text-black-600 hover:underline'
              }
            >
              Wishlist
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
