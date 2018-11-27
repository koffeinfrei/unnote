import React from 'react';
import UserLinks from './UserLinks';

export default function UserForm(props) {
  return (
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        {props.intro ? (
          <div className="jumbotron">
            {props.intro}
          </div>
        ) : (
          null
        )}

        <div className="well">
          {props.children}

          <UserLinks />
        </div>
      </div>
    </div>
  );
}
