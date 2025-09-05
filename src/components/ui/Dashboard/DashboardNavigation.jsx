import { NavLink } from 'react-router-dom';

const navItems = [
  { to: 'profile', label: 'Account Details' },
  { to: 'orders', label: 'My Orders' },
  { to: 'addresses', label: 'My Addresses' },
  { to: 'wishlist', label: 'Wishlist' },
];

export default function DashboardNavigation() {
  return (
    <div className="flex flex-col lg:flex-row items-start mt-20 mb-8 gap-8 lg:gap-[104px]">
      <h1 className="hero-main-title font-bold leading-tight antialiased font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#282E41]">
        DASHBOARD
      </h1>
      <nav className="mt-8">
        <ul className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20 text-2xl">
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `mt-12 text-2xl font-[Afacad] transition-colors duration-200 ${
                    isActive
                      ? 'font-bold underline'
                      : 'font-bold text-black-600 hover:underline'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
