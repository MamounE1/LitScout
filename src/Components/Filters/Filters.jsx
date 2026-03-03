import { SlidersHorizontal } from "lucide-react";
import "./Filters.css";

export default function Filters({ filters, onFilterChange, onClearFilters }) {
  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className="filtersContainer">
      <div className="filtersCard">
        <div className="filtersHeader">
          <h3 className="filtersTitle">
            <SlidersHorizontal size={20} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="activeFiltersCount">{activeFiltersCount}</span>
            )}
          </h3>
          {activeFiltersCount > 0 && (
            <button className="clearFiltersBtn" onClick={onClearFilters}>
              Clear All
            </button>
          )}
        </div>

        <div className="filtersGrid">
          <div className="filterGroup">
            <label className="filterLabel">Category</label>
            <select
              className="filterSelect"
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="fiction">Fiction</option>
              <option value="nonfiction">Non-Fiction</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="biography">Biography</option>
              <option value="fantasy">Fantasy</option>
              <option value="mystery">Mystery</option>
              <option value="romance">Romance</option>
              <option value="thriller">Thriller</option>
              <option value="self-help">Self-Help</option>
            </select>
          </div>

          <div className="filterGroup">
            <label className="filterLabel">Language</label>
            <select
              className="filterSelect"
              value={filters.language}
              onChange={(e) => onFilterChange('language', e.target.value)}
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
            </select>
          </div>

          <div className="filterGroup">
            <label className="filterLabel">Sort By</label>
            <select
              className="filterSelect"
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="filterGroup">
            <label className="filterLabel">Print Type</label>
            <select
              className="filterSelect"
              value={filters.printType}
              onChange={(e) => onFilterChange('printType', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="books">Books</option>
              <option value="magazines">Magazines</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
