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
drwxr-xr-x 1000/1000         0 2012-12-20 17:52 components/jquery/
-rw-r--r-- 1000/1000       591 2012-12-20 15:56 components/jquery/composer.json
-rw-r--r-- 1000/1000       366 2012-12-20 17:52 components/jquery/component.json
-rw-r--r-- 1000/1000     93637 2012-12-20 15:56 components/jquery/jquery.min.js
-rw-r--r-- 1000/1000    275529 2012-12-20 15:56 components/jquery/jquery.js
$
```

And just like that, you got that pesky node dependency off your super
successful Django on Rails application... ;)

# License

Copyright © 2013 Arnaud Berthomier. Distributed under the MIT License. See
LICENSE.txt for further details.

[bower]: https://github.com/twitter/bower
[zyll]: https://github.com/zyll
