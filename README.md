# Bowerball

Bowerball is a little node program to stream tarballs over HTTP from [bower]
component files.  But it's all [zyll]'s fault really.

It is more a proof of concept than a “enterprise-ready” thing that you should
put in production right now.  That say, you're welcome to hack and send
pull-requests.

# Setup

Start by installing the npm package with `npm install bowerball`.

Alternatively, if you intend to code, grab the code:

    $ git clone git://github.com/oz/bowerball.git
    $ cd bowerball
    $ npm install 
    $ node index.js

# Example

Once installed, start the bowerball server in a console, by calling
`bowerball`.

```
$ bowerball
Server ready, listening on http://127.0.0.1:8080
```

In another term, create a sample bower component file:

```
$ cat > foo.json
{
  "dependencies": {
    "jquery": "~1.8.3"
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

# License

Copyright © 2012 Arnaud Berthomier. Distributed under the MIT License. See
LICENSE.txt for further details.

[bower]: https://github.com/twitter/bower
[zyll]: https://github.com/zyll
