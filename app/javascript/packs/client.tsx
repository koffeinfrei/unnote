// Run this example by adding <%= javascript_pack_tag 'hello_typescript' %> to the head of your layout file,
// like app/views/layouts/application.html.erb.

import * as React from 'react';
import { render } from 'react-dom';

export interface ClientProps {
  name?: string;
}
export const Client = ({ name = 'David' }: ClientProps = {}) => <div>Hello {name}!</div>;

document.addEventListener('DOMContentLoaded', () => {
  render(<Client name="dear Mykonote user" />, document.getElementById('root'));
});
