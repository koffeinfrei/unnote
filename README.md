# Mykonote

The note taking app that doesn't suck. Made under the Mykonian sun.

The goal of this projet is to provide a solid note taking app with just the
core functionality. There won't be any fancy unnecessary features such as a
chat.

What Mykonote offers:

* a solid richtext editor which works properly without ruining the formatting
* mobile support
* offline support, so you don't lose data when the connection is bad or even
  missing
* a simple and fast user experience
* an always available search
* a donkey logo

## Development setup

To get the application started the following steps are required.

* standard rails setup routine

  ```bash
  $ bundle
  $ rake db:setup
  ```

* 3rd party javascripts and stylesheets are managed using bower
  ([bower-rails](https://github.com/rharriso/bower-rails)). You need to have
  npm and bower installed for this to work.

  `$ rake bower:install`

## License

    Copyright 2016 Panter AG <info@panter.ch>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
