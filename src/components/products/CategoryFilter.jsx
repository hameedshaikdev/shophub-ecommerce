const CategoryFilter = ({ categories, selected, onSelect }) => (
  <div className="sh-subtabs">
    <div className="sh-container">
      <div className="sh-subtabs-inner sh-scroll-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`sh-subtab${selected === cat.id ? ' active' : ''}`}
          >
            <span className="sh-subtab-icon">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default CategoryFilter;
