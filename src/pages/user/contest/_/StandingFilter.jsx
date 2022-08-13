import React from "react";
import {Button, Dropdown} from "react-bootstrap";

import "./ContestStanding.scss";
import "styles/Ratings.scss";
import "./StandingFilter.scss";
import {FaFilter} from "react-icons/fa";
import {BiTrash} from "react-icons/bi";

const ClearIcon = props => {
  return <BiTrash className="clear-icon" size={18} {...props} />;
};

const StandingFilter = ({
  orgList,
  onSave,
  onToggleOrgFilter,
  onToggleFavoriteFilter,
  isOrgFilterEnable,
  isFavoriteEnable,
}) => {
  const [selectedOrg, setSelectedOrg] = React.useState([]);

  const onOrgFilterSelectChange = e => {
    let selectedIds = [];
    const options = e.target.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selectedIds.push(options[i].value);
    }
    setSelectedOrg(selectedIds);
  };

  const toggleOrgFilter = e => onToggleOrgFilter(e.target.checked);
  const toggleFavoriteFilter = e => onToggleFavoriteFilter(e.target.checked);
  const onSaveClick = () => onSave(selectedOrg);

  const onClearOrgFilter = () => {
    onSave([]);
    onToggleOrgFilter(false);
    setSelectedOrg([]);
  };

  const onClearFavoriteFilter = () => onToggleFavoriteFilter(false, true);

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant={
          isOrgFilterEnable || isFavoriteEnable ? "primary" : "secondary"
        }
        className="btn-svg"
      >
        <FaFilter size={18} /> Filter
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <div id="standing-filter">
          <div className="filter-col org-filter">
            <div className="filter-label">
              <span className="mr-1">Filter by </span>
              <label>
                <input
                  type="checkbox"
                  onChange={toggleOrgFilter}
                  checked={!!isOrgFilterEnable}
                />
                <span>Organization</span>
              </label>
              <ClearIcon onClick={onClearOrgFilter} />
            </div>
            <select
              multiple
              name="org-filter"
              className="filter-container border rounded"
              onChange={onOrgFilterSelectChange}
            >
              {orgList?.map(org => {
                return (
                  <option
                    key={`opt-org-${org.slug}`}
                    value={org.slug}
                    selected={selectedOrg.includes(org.slug)}
                    className="filter-option"
                  >
                    {`(${org.slug}) ${org.name}`}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="filter-label">
            <label>
              <input
                type="checkbox"
                checked={isFavoriteEnable}
                onChange={toggleFavoriteFilter}
              />
              <span>Favorite Only</span>
            </label>
            <ClearIcon onClick={onClearFavoriteFilter} />
          </div>
          <div className="filter-control-btn">
            <Button size="sm" onClick={onSaveClick}>
              Save
            </Button>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default StandingFilter;
