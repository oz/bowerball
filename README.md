# Bowerball

Bowerball is a little node program to stream tarballs over HTTP from [bower]
component files.  This means, that you POST a Bower-compatible `component.json`
file, and the program will build, and stream back a tarball of the
corresponding `components` directory.

I would blame alcohol, but this is really another of [zyll]'s weird ideas that
I could quickly hack.  It is more a proof of concept than a enterprisy thing:
it's simple, it just works, so I hope it can be of some use. :)

That said, you're welcome to hack and send pull-requests.  A running instance
is available on Heroku: http://bowerball.herokuapp.com

To test it from the your command-line, run:

```
curl -sX POST -d '{"dependencies": {"jquery":"~2.0", "ember":"~1.0"} }' \
    http://bowerball.herokuapp.com/ | tar -tv
```

# Setup

Start by installing the npm package with `npm install bowerball`, and run
`node node_modules/bowerball/index.js`

Alternatively, if you intend to code, grab the code:

```
$ git clone git://github.com/oz/bowerball.git
$ cd bowerball
$ npm install
$ node index.js
```

# Example

Once installed, start the bowerball server in a terminal by calling
`bowerball`.  It takes no arguments, the only movable part is the listening
port throught the `PORT` environment variable.

```
$ bowerball
Server ready, listening on http://0.0.0.0:8080
```

In another terminal, create a sample bower component file:

```
$ cat > foo.json
{
  "dependencies": {
    "jquery": "~2.0",
    "ember":  "~1.0"
  }
}
^D
```

And let bowerball serve that to you:

```
$ curl -sX POST -d @foo.json http://localhost:8080/ | tar -tv
drwx------  0 45895  45895       0 Apr 19 19:07 components/jquery/
-rw-------  0 45895  45895   16689 Apr 19 19:07 components/jquery/jquery-migrate.js
-rw-------  0 45895  45895     733 Apr 19 19:07 components/jquery/composer.json
-rw-------  0 45895  45895     783 Apr 19 19:07 components/jquery/component.json
-rw-------  0 45895  45895    7087 Apr 19 19:07 components/jquery/jquery-migrate.min.js
-rw-------  0 45895  45895  240196 Apr 19 19:07 components/jquery/jquery.js
-rw-------  0 45895  45895     336 Apr 19 19:07 components/jquery/README.md
-rw-------  0 45895  45895       6 Apr 19 18:46 components/jquery/.gitignore
-rw-------  0 45895  45895     144 Apr 19 19:07 components/jquery/package.json
-rw-------  0 45895  45895   83095 Apr 19 19:07 components/jquery/jquery.min.js
-rw-------  0 45895  45895     226 Apr 19 19:07 components/jquery/bower.json
drwx------  0 45895  45895       0 Apr 19 19:07 components/handlebars/
-rw-------  0 45895  45895    9636 Apr 19 18:48 components/handlebars/handlebars.runtime.js
-rw-------  0 45895  45895     431 Apr 19 19:07 components/handlebars/component.json
-rw-------  0 45895  45895   71956 Apr 19 18:48 components/handlebars/handlebars.js
drwx------  0 45895  45895       0 Apr 19 19:07 components/ember/
-rw-------  0 45895  45895     562 Apr 19 18:48 components/ember/composer.json
-rw-------  0 45895  45895  191968 Apr 19 19:07 components/ember/ember.min.js
-rw-------  0 45895  45895     440 Apr 19 19:07 components/ember/component.json
-rw-------  0 45895  45895  770333 Apr 19 19:07 components/ember/ember.js
-rw-------  0 45895  45895      45 Apr 19 19:07 components/ember/.gitignore
-rw-------  0 45895  45895     222 Apr 19 18:48 components/ember/package.json
$
```

And just like that, you got that pesky node dependency off your super
successful Django on Rails application... ;)

# License

Copyright © 2013 Arnaud Berthomier. Distributed under the MIT License. See
LICENSE.txt for further details.

[bower]: https://github.com/twitter/bower
[zyll]: https://github.com/zyll
