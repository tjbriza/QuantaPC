import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';

export default function About() {
  const aboutImage = '/images/about-hero.jpg';

  const team = [
    {
      name: 'Tony Justin Briza',
      role: 'Team Leader',
    },
    {
      name: 'Nicolas Marcus Garcia',
      role: 'System Programmer',
    },
    {
      name: 'Luke Jan Nacional',
      role: 'System Designer',
    },
    {
      name: 'William Navarro',
      role: 'System Document Analyst',
    },
    {
      name: 'Razeenur Karuwahi',
      role: 'Software Tester',
    },
  ];

  return (
    <div className='min-h-screen text-slate-800 pt-16 sm:pt-24'>
      <section className='mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16'>
        <div className='text-center'>
          <h1 className='text-4xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900'>
            About quantapc
          </h1>
          <p className='mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl mx-auto'>
            Quanta PC delivers high-performance computers straight to you—own or
            rent, the choice is yours. Perfect for gamers, professionals, and
            students who need power on their terms.
          </p>
        </div>

        <div className='mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
          <div className='order-2 lg:order-1 text-center lg:text-left'>
            <h2 className='text-xl sm:text-2xl font-semibold text-slate-900'>
              Mission
            </h2>
            <p className='mt-3 text-slate-600 leading-relaxed'>
              To democratize access to high-performance computing by providing
              affordable, flexible rental solutions backed by exceptional
              customer service and reliable logistics.
            </p>

            <h2 className='mt-10 text-xl sm:text-2xl font-semibold text-slate-900'>
              Philosophy
            </h2>
            <p className='mt-3 text-slate-600 leading-relaxed'>
              We believe technology should be accessible, not restrictive. By
              removing barriers like upfront costs and maintenance worries,
              Quanta PC enables users to focus on what matters—whether it’s
              gaming, creativity, or productivity.
            </p>
          </div>

          <div className='order-1 lg:order-2 flex justify-center'>
            <div className='relative w-full max-w-md aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 bg-white'>
              <img
                src={aboutImage}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                alt='A modern desktop setup representing Quanta PC'
                className='absolute inset-0 h-full w-full object-cover'
                loading='lazy'
              />
            </div>
          </div>

          <div className='order-3 lg:order-3 text-center lg:text-left'>
            <h2 className='text-xl sm:text-2xl font-semibold text-slate-900'>
              Vision
            </h2>
            <p className='mt-3 text-slate-600 leading-relaxed'>
              To become the leading PC rental platform in Southeast Asia,
              empowering users with hassle-free technology solutions that adapt
              to their dynamic needs.
            </p>

            <h3 className='mt-10 text-lg sm:text-xl font-semibold text-slate-900'>
              Core Values
            </h3>
            <ul className='mt-3 space-y-2 text-slate-600'>
              <li>
                <span className='font-semibold text-slate-900'>
                  Accessibility
                </span>{' '}
                – Tech within reach.
              </li>
              <li>
                <span className='font-semibold text-slate-900'>
                  Flexibility
                </span>{' '}
                – Power when you need it.
              </li>
              <li>
                <span className='font-semibold text-slate-900'>
                  Customer First
                </span>{' '}
                – Smooth from start to finish.
              </li>
              <li>
                <span className='font-semibold text-slate-900'>Innovation</span>{' '}
                – Always ahead.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className='mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16'>
        <div className='text-center'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900'>
            The Dream Team
          </h2>
        </div>

        <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          {team.map((member, idx) => (
            <article
              key={member.name}
              className='rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm hover:shadow-md transition-shadow'
            >
              <div className='flex flex-col items-center text-center'>
                <div className='h-24 w-24 rounded-full bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center text-slate-400'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='h-12 w-12'
                    aria-hidden='true'
                  >
                    <path d='M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z' />
                  </svg>
                </div>

                <h3 className='mt-4 text-base font-semibold text-slate-900'>
                  {member.name}
                </h3>
                <p className='text-sm text-slate-600'>{member.role}</p>

                <div className='mt-3 flex items-center gap-3 text-slate-500'>
                  <a
                    href='#'
                    aria-label={`${member.name} on Facebook`}
                    className='hover:text-slate-700'
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href='#'
                    aria-label={`${member.name} on LinkedIn`}
                    className='hover:text-slate-700'
                  >
                    <FaLinkedinIn />
                  </a>
                  <a
                    href='#'
                    aria-label={`${member.name} on Instagram`}
                    className='hover:text-slate-700'
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href='#'
                    aria-label={`${member.name} on X`}
                    className='hover:text-slate-700'
                  >
                    <FaXTwitter />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
