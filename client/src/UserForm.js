import React from 'react';
import UserLinks from './UserLinks';

export default function UserForm(props) {
  return (
    <div className="flex center">
      <div className="hidden-sm"></div>

      <div className="full third-1000">
        {props.intro ? (
          <div className="card">
            <footer>
              {props.intro}
            </footer>
          </div>
        ) : (
          null
        )}

        {props.children}

        <UserLinks />
      </div>

      <div className="hidden-sm"></div>
    </div>
  );
}
