import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export default function NavbarSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
      if (onClose) onClose();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex items-center w-[32rem] md:w-[40rem] gap-2'
    >
      <Link to='/' className='flex-shrink-0 mr-2' aria-label='Home'>
        <img src='/favicon.png' alt='Logo' className='h-8 w-8 object-contain' />
      </Link>
      <div className='relative w-full'>
        <input
          autoFocus
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search products...'
          className='w-full px-4 py-2 pr-10 bg-transparent border-0 border-b-1 border-black focus:outline-none focus:border-blue-400 text-black placeholder:text-black/60'
        />
        <button
          type='submit'
          className='absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-300 hover:scale-110 text-black hover:text-blue-500 bg-transparent'
          aria-label='Search'
        >
          <Search className='w-5 h-5' />
        </button>
      </div>
      <button
        type='button'
        onClick={onClose}
        className='ml-2 p-2 rounded-lg transition-all duration-300 hover:scale-110 text-black hover:text-red-500 bg-transparent'
        aria-label='Close search'
      >
        <X className='w-5 h-5' />
      </button>
    </form>
  );
}
