import React from 'react';
import { Button } from '../../components';

export const SortControl = ({ sortOrder, setSortOrder }) => {
  
  const handleSortToggle = () => {
    if (sortOrder === 'none') {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('none');
    }
  };

  const getSortButtonLabel = () => {
    if (sortOrder === 'asc') return 'Tên (A-Z) 🔼';
    if (sortOrder === 'desc') return 'Tên (Z-A) 🔽';
    return 'Sắp xếp theo tên';
  };

  return (
    <Button 
      size="sm" 
      variant="secondary"
      className="!rounded-lg"
      onClick={handleSortToggle}
    >
      {getSortButtonLabel()}
    </Button>
  );
};

export default SortControl;