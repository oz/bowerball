#!/usr/bin/env node

var http    = require('http'),
    stream  = require('stream'),
    fs      = require('fs'),
    cp      = require('child_process'),
    bower   = require('bower'),
    tar     = require('tar'),
    fstream = require('fstream'),
    temp    = require('temp'),
    rimraf  = require('rimraf'),

    // HTTP Server config
    serverPort   = process.env.PORT || 8080,
    serverListen = '0.0.0.0';

// Send an error response in plain-text.
var respondText = function respondText(res, code, text) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'text/plain');
  return res.end(text.toString());
};

/**
 * Save POST-ed data to component.json in a tempdir, an call the received
 * callback with two params:
 *
 *  - an Exception if any is thrown (or null),
 *  - the temp directory where the received JSON was saved,
 *  - the component.json file's absolute path.
 */
var saveComponent = function saveComponent(req, cb) {
  req.pause(); // Wait for tempdir.

  temp.mkdir('bowerball-', function (err, dirPath) {
    if (err) { return cb(err); }

    var filePath   = dirPath + '/component.json',
        fileStream = fs.createWriteStream(filePath, {flags: 'w', mode: '0600'});

    fileStream.on('open', function (fd) {
      req.on('end', function () { return cb(null, dirPath, filePath); });
      req.pipe(fileStream);
      req.resume();
    });
  });
};

/**
 * Run `bower install` in the requested directory, and call the received
 * callback with:
 *   - an error describing the problem
 *   - no parameter if the command succeeded.
 *
 * FIXME This invokes process.chdir(), so it'd better run in a child
 *       process, since concurrent requests may create chdir conflicts.
 */
var bowerInstall = function bowerInstall(path, cb) {
  var install;

  process.chdir(path);
  install = bower.commands.install();
  install
  .on('data',  function (data) { console.log(path + ": " + data); })
  .on('end',   function (data) { cb(null); })
  .on('error', function (data) {
    cb(data || "Could not package your components.");
  });
};

/**
 * Does a "rm -fr" of the received path, silently discarding errors.
 */
var rm = function rm(path) {
  rimraf(path, function () {
    console.log(path + " temp directory removed.");
  });
};

/**
 * Your entry point is here... :)
 */
http.createServer(function (req, res) {
  // Only accept POST requests
  if ('POST' !== req.method) {
    res.statusCode = 303;
    res.setHeader('Location', 'https://github.com/oz/bowerball');
    return res.end();
  }

  // Expect a component.json to be POST-ed
  saveComponent(req, function (err, tempDir, tempFile) {
    if (err) {
      return respondText(res, 500, err);
    }

    bowerInstall(tempDir, function (err) {
      var reader, tarball;

      if (err) {
        return respondText(res, 500, err);
      }
      res.statusCode = 200;
      // Read components directory, and build a tarball.
      fstream.Reader({type: "Directory", path: tempDir + '/components'})
        .pipe(tar.Pack())
          .on('error', function (err) {
            respondText(res, 500, err);
            rm(tempDir);
          })
          .on('end', function () {
            rm(tempDir);
          })
        // Stream back the tarball.
        .pipe(res)
          .on('error', function (err) {
            console.log('Error when streaming a tarball:', err);
            respondText(res, 500, err);
          });
    });
  });

}).listen(serverPort, serverListen);

console.log("Server ready, listening on http://" + serverListen + ":" + serverPort);
