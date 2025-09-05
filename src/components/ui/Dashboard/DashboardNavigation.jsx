import { NavLink } from 'react-router-dom';

export default function DashboardNavigation() {
  return (
    <div className="flex flex-col lg:flex-row items-center mt-16 mb-8 gap-8 lg:gap-[104px]">
      <h1 className="hero-main-title font-bold leading-tight antialiased font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#282E41]">
        DASHBOARD
      </h1>
      <nav>
        <ul className="flex flex-col lg:flex-row items-center gap-6 lg:gap-16 text-xl">
          <li>
            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive ? 'font-bold underline' : 'text-black-600 hover:underline'
              }
            >
              Account Details
            </NavLink>
          </li>
          <li>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                isActive ? 'font-bold underline' : 'text-black-600 hover:underline'
              }
            >
              My Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="addresses"
              className={({ isActive }) =>
                isActive ? 'font-bold underline' : 'text-black-600 hover:underline'
              }
            >
              My Addresses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="wishlist"
              className={({ isActive }) =>
                isActive ? 'font-bold underline' : 'text-black-600 hover:underline'
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
