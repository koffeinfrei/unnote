import React from 'react';
import { Route, Link } from 'react-router-dom';

export default function UserLinks() {
  return (
    <div>
      <Route path="/login" render={props => (
        <Link className="btn btn-info btn-link btn-no-padding" to="/register">Register</Link>
      )}/>

      <Route path="/register" render={props => (
        <Link className="btn btn-info btn-link btn-no-padding" to="/login">Login</Link>
      )}/>
    </div>
  );
}
