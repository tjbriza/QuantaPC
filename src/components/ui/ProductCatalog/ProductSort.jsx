import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ProductSort() {
  const [selectedOption, setSelectedOption] = useState('Popular');
  const [isOpen, setIsOpen] = useState(false);

  const options = ['Popular', 'Latest', 'Top Sales'];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="w-full sm:w-80 mb-6 flex justify-end">
      <div className="relative inline-block">
        <div
          className="flex items-center space-x-2 px-4 py-2 bg-transparent cursor-pointer focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-dm-sans">
            Sort by <span className="font-bold">{selectedOption}</span>
          </span>
          <ChevronDown
            className={`w-5 h-5 text-black transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full right-0 bg-white border border-gray-200 shadow-lg z-10 w-max min-w-full">
            {options.map((option) => (
              <div
                key={option}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-50 font-dm-sans ${
                  selectedOption === option ? 'font-bold' : ''
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
