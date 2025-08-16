import { Search } from 'lucide-react';

export default function ProductSearch() {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-64"> 
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 pr-10 bg-transparent border-0 border-b border-black focus:outline-none focus:border-black"
        />    
        <Search 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" 
        />
      </div>
    </div>
  );
}
