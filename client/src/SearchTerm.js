import React, { Component } from 'react';

import './SearchTerm.css';

class SearchTerm extends Component {
  render() {
    if (!this.props.searchQuery) { return null; }

    return (
      <div className="search-term">Showing results for "{this.props.searchQuery}"</div>
    );
  }
}
export default SearchTerm;
