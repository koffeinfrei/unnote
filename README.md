[![CI](https://github.com/panter/mykonote/actions/workflows/ci.yml/badge.svg)](https://github.com/panter/mykonote/actions/workflows/ci.yml)
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/panter/mykonote)
[![codebeat badge](https://codebeat.co/badges/6f0e1968-b451-4cb9-84d9-9cc49c68e64f)](https://codebeat.co/projects/github-com-panter-mykonote-main)

# Mykonote [/ˈmɪkəˌnəʊt/]

**Full / Desktop**

![desktop](screenshot_desktop.png)

**Mobile / PWA**

<p>
  <img src="screenshot_mobile_1.png" alt="mobile note" width="49%" />
  <img src="screenshot_mobile_2.png" alt="mobile list" width="49%" />
</p>

The note taking app that doesn't suck. Made under the Mykonian sun.

The goal of this project is to provide a solid note taking app with just the
core functionality. There won't be any fancy unnecessary features such as a
chat. It basically meets the one requirement: Taking and managing private
notes.

What Mykonote offers:

* A [solid richtext editor](http://quilljs.com/) which works properly without
  ruining the formatting
* [Task lists](https://github.com/koffeinfrei/quill-task-list) (aka. todo
  lists)
* PWA, so it can be installed as an app on any mobile device
  * Support for the "share to" functionality of mobile phones. Pretty much any
    image or text based content can be shared to Mykonote.
* Autosave
* Permanent edit mode. There's no switching between read and edit mode. Just
  edit, always.
* Pseudo offline support, so you don't lose data when the connection is bad or even
  missing. The next time the internet is up again your edits will be synced to
  the server.
* A simple and fast user experience
* An always available and easy to use search
* A donkey logo
* [Free and open source software](https://www.gnu.org/philosophy/free-sw.html).
  There is no [vendor lock-in](https://en.wikipedia.org/wiki/Vendor_lock-in)
  and there will never be any weird business going on with your data.


## Development setup

To get the application started the standard rails setup routine can be
executed.

  ```bash
  $ bin/setup
  ```

You can now start the application and give it a try at
[localhost:3000](http://localhost:3000).
There's a demo user `user@example.com` with the password `asdfasdf`.

  ```bash
  $ rake start
  ```

### Testing

For the capybara e2e tests headless firefox / geckodriver is used.

- [Download latest firefox beta](https://www.mozilla.org/en-US/firefox/channel/desktop/)
- [Download latest geckodriver](https://github.com/mozilla/geckodriver/releases/latest)
- Put both binaries in your `$PATH`

Make sure to build the client before running RSpec.

```bash
$ bundle exec rake client:build_and_deploy
$ bundle exec rspec spec
```

### Releases (Versioning / Changelog)

[Semantic Versioning](https://semver.org/) is used, obviously.

There's a script that bumps the version, generates the changelog entry and
creates a corresponding git commit / tag.

```bash
# bump the major version, e.g. from 1.2.0 to 2.0.0
$ scripts/version bump:major

# bump the minor version, e.g. from 1.2.0 to 1.3.0
$ scripts/version bump:minor

# bump the patch version, e.g. from 1.2.0 to 1.2.1
$ scripts/version bump:patch
```

#### Changelog

For generating the changelog
[lerna-changelog](https://github.com/lerna/lerna-changelog) is used.

To set this up locally you'll need to create the file
`.lerna-changelog-github-token` containing a GitHub access token (with just the
`public_repo` scope).

## Links

- [Homepage www.mykonote.com](https://www.mykonote.com)
- [Web app at app.mykonote.com](https://app.mykonote.com)
- [Mobile app on Google
  Play](https://play.google.com/store/apps/details?id=com.mykonote)
- [Mobile app source code](https://github.com/panter/mykonote-app)


## License

    Copyright 2016 Alexis Reigel <mail@koffeinfrei.org>
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
