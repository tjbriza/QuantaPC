import { useState, useEffect } from 'react';
import { useSupabaseRead } from '../../../hooks/useSupabaseRead';

export default function ProductFilter({
  onFiltersChange,
  currentFilters = { categories: [], priceMin: '', priceMax: '' },
  className = '',
}) {
  // Local state for the filters - sync with current filters
  const [localSelectedCategories, setLocalSelectedCategories] = useState(
    currentFilters.categories,
  );
  const [localPriceMin, setLocalPriceMin] = useState(currentFilters.priceMin);
  const [localPriceMax, setLocalPriceMax] = useState(currentFilters.priceMax);

  // Track if filters have changed since last apply
  const [hasChanges, setHasChanges] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Check if current price range is valid
  const isPriceRangeValid = () => {
    if (localPriceMin && localPriceMax) {
      return Number(localPriceMin) <= Number(localPriceMax);
    }
    return true;
  };

  // Sync local state with currentFilters prop changes
  useEffect(() => {
    setLocalSelectedCategories(currentFilters.categories);
    setLocalPriceMin(currentFilters.priceMin);
    setLocalPriceMax(currentFilters.priceMax);
    setHasChanges(false);
    setValidationError('');
  }, [currentFilters]);

  // Fetch categories from database
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSupabaseRead('categories', {
    order: { column: 'name', ascending: true },
  });

  // Handle category checkbox changes
  const handleCategoryChange = (categoryId, checked) => {
    const updatedCategories = checked
      ? [...localSelectedCategories, categoryId]
      : localSelectedCategories.filter((id) => id !== categoryId);

    setLocalSelectedCategories(updatedCategories);
    setHasChanges(true);
  };

  // Handle price range changes
  const handlePriceChange = (field, value) => {
    // Allow only numbers and empty string, convert "0000" to "0"
    if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
      // Convert value to number and back to string to handle cases like "0000" -> "0"
      const normalizedValue = value === '' ? '' : String(Number(value));

      let newMin = localPriceMin;
      let newMax = localPriceMax;

      if (field === 'min') {
        newMin = normalizedValue;
        // Check if min value exceeds current max
        if (
          localPriceMax &&
          normalizedValue &&
          Number(normalizedValue) > Number(localPriceMax)
        ) {
          setValidationError('Minimum price cannot exceed maximum price');
          return;
        }
        setLocalPriceMin(normalizedValue);
      } else {
        newMax = normalizedValue;
        // Check if max value is less than current min
        if (
          localPriceMin &&
          normalizedValue &&
          Number(normalizedValue) < Number(localPriceMin)
        ) {
          setValidationError('Maximum price cannot be less than minimum price');
          return;
        }
        setLocalPriceMax(normalizedValue);
      }

      // Clear validation error if range is now valid
      if (newMin && newMax && Number(newMin) <= Number(newMax)) {
        setValidationError('');
      } else if (!newMin || !newMax) {
        setValidationError('');
      }

      setHasChanges(true);
    }
  };

  // Apply filters function
  const applyFilters = () => {
    if (!isPriceRangeValid()) {
      setValidationError('Please fix the price range before applying filters');
      return;
    }

    if (onFiltersChange) {
      onFiltersChange({
        categories: localSelectedCategories,
        priceMin: localPriceMin,
        priceMax: localPriceMax,
      });
    }
    setHasChanges(false);
    setValidationError('');
  };

  // Clear filters function
  const clearFilters = () => {
    setLocalSelectedCategories([]);
    setLocalPriceMin('');
    setLocalPriceMax('');
    setValidationError('');
    if (onFiltersChange) {
      onFiltersChange({
        categories: [],
        priceMin: '',
        priceMax: '',
      });
    }
    setHasChanges(false);
  };

  return (
    <div
      className={`w-full h-fit overflow-y-auto z-10 ${className}`}
      style={{
        fontFamily: 'DM Sans',
        fontSize: '1.25rem',
        position: 'sticky',
        top: '14.5rem',
        marginLeft: '-28px',
      }}
    >
      <div className='space-y-1.5 lg:space-y-2 xl:space-y-2.5'>
        {/* Categories Section */}
        <div>
          <h3 className='font-bold text-[1.5rem] mb-1.5 lg:mb-2 text-black cursor-default'>
            CATEGORIES
          </h3>
          <div className='space-y-0.5 lg:space-y-1'>
            {categoriesLoading && (
              <div className='text-gray-500 text-[1rem]'>
                Loading categories...
              </div>
            )}
            {categoriesError && (
              <div className='text-red-500 text-[1rem]'>
                Error loading categories
              </div>
            )}
            {categories &&
              categories.length > 0 &&
              categories.map((category) => (
                <label
                  key={category.id}
                  className='flex items-center gap-2 cursor-pointer w-fit group'
                >
                  <input
                    type='checkbox'
                    className='w-5 h-5 accent-blue-500'
                    checked={localSelectedCategories.includes(category.id)}
                    onChange={(e) =>
                      handleCategoryChange(category.id, e.target.checked)
                    }
                  />
                  <span className="text-black text-[1.25rem] relative block transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[0.125rem] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full">
                    {category.name}
                  </span>
                </label>
              ))}
            {categories && categories.length === 0 && !categoriesLoading && (
              <div className='text-gray-500 text-[1rem]'>
                No categories available
              </div>
            )}
          </div>
        </div>

        {/* Price Range Section */}
        <div>
          <h3 className='font-bold text-[1.5rem] text-black mb-1.5 lg:mb-2 cursor-default'>
            PRICE RANGE
          </h3>
          <div className='space-y-1.5 lg:space-y-2'>
            <div>
              <label className='text-black text-[1.25rem] mb-1 block'>
                Minimum
              </label>
              <input
                type='text'
                placeholder='0'
                value={localPriceMin}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className={`w-full max-w-[160px] px-3 py-2 border rounded-full text-[1.25rem] focus:outline-none transition-colors ${
                  validationError && !isPriceRangeValid()
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-black focus:border-blue-500'
                }`}
              />
            </div>
            <div>
              <label className='text-black text-[1.25rem] mb-1 block'>
                Maximum
              </label>
              <input
                type='text'
                placeholder='999999'
                value={localPriceMax}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className={`w-full max-w-[160px] px-3 py-2 border rounded-full text-[1.25rem] focus:outline-none transition-colors ${
                  validationError && !isPriceRangeValid()
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-black focus:border-blue-500'
                }`}
              />
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className='text-red-500 text-[0.875rem] mt-1'>
                {validationError}
              </div>
            )}
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className='pt-4 space-y-2'>
          {/* Apply Filters Button */}
          <button
            onClick={applyFilters}
            disabled={!hasChanges || (validationError && !isPriceRangeValid())}
            className={`w-full py-2 px-4 rounded-full font-medium text-[1rem] transition-all ${
              hasChanges && (!validationError || isPriceRangeValid())
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Apply Filters
          </button>

          {/* Clear Filters Button */}
          {(localSelectedCategories.length > 0 ||
            localPriceMin ||
            localPriceMax) && (
            <button
              onClick={clearFilters}
              className='w-full text-red-600 hover:text-red-800 transition-colors text-[1rem] underline'
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
