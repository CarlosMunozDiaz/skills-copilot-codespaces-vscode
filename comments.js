// Create web server
// Create a web server that listens on port 3000 and serves the comments.html file. Use the fs module to read the file and send it to the client.

// The comments.html file should contain a form that allows users to submit comments. When the form is submitted, the comments should be saved to a file called comments.txt. Each comment should be on a new line.

// The comments.txt file should be created if it does not already exist.

// The comments.html file should also display all the comments that have been submitted.

// You can use the following command to start the server:

// node comments.js
// You can access the web server at http://localhost:3000.

// You can use the following HTML code for the form:

// <form action="/submit" method="post">
//   <input type="text" name="comment" />
//   <input type="submit" value="Submit" />
// </form>

const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);
  const path = urlObj.pathname;

  if (path === '/comments.html') {
    fs.readFile('comments.html', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else if (path === '/submit' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const formData = qs.parse(body);
      const comment = formData.comment;

      fs.appendFile('comments.txt', comment + '\n', (err) => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal Server Error');
          return;
        }

        res.statusCode = 303;
        res.setHeader('Location', '/comments.html');
        res.end();
      });
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});