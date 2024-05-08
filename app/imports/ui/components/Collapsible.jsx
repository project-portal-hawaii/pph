import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
const Collapsible = ({ open, children, title }) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleFilterOpening = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="card">
      <div>
        <div className="p-3 border-bottom d-flex justify-content-between">
          <h6 className="font-weight-bold">{title}</h6>
          <button type="button" className="btn" onClick={handleFilterOpening}>
            {!isOpen ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </button>
        </div>
      </div>

      <div className="border-bottom">
        <div>{isOpen && <div className="p-3">{children}</div>}</div>
      </div>
    </div>
  );
};

Collapsible.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
};

Collapsible.defaultProps = {
  open: false,
  // eslint-disable-next-line react/jsx-no-useless-fragment
  title: '',
};

export default Collapsible;
