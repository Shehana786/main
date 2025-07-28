import React from 'react';

const categories = [
  'Indoor', 'Outdoor', 'Medicinal', 'Evergreen',
  'Flowering', 'Succulents', 'Bonsai', 'Plant Tools'
];

const Sidebar = ({ selectedCategories, onCategoryChange }) => {
  const isAllSelected = selectedCategories.length === 0;

  return (
    <div className="sidebar-container">
      <h3>Filters</h3>
      <label className="category-item">
        <input
          type="checkbox"
          value="all"
          checked={isAllSelected}
          onChange={(e) => {
            if (!isAllSelected) {
              onCategoryChange({ target: { value: 'all', checked: true } });
            }
          }}
        />
        All
      </label>
      <div className="sidebar-grid">
        {categories.map((cat) => (
          <label key={cat} className="category-item">
            <input
              type="checkbox"
              value={cat}
              checked={selectedCategories.includes(cat)}
              onChange={onCategoryChange}
            />
            {cat}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
