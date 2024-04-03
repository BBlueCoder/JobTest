const http = require("http");
const fs = require("fs");
const nodeUrlTools = require("url");

const GET_PATHS = [];
const POST_PATHS = [];

const server = http.createServer((req, res) => {
  switch (req.method) {
    case "GET": {
      handleGetRequest(req, res);
      break;
    }
    case "POST": {
      handlePostRequest(req, res);
      break;
    }
    default: {
      res.statusCode(405);
      res.end();
    }
  }
});

const handleGetRequest = (req, res) => {
  for (i = 0; i < GET_PATHS.length; i++) {
    const requestUrl = nodeUrlTools.parse(req.url, true);
    if (GET_PATHS[i].path === requestUrl.pathname) {
      extractQueryParams(req, requestUrl.query);
      GET_PATHS[i].handler(req, res);
      return;
    }
  }
  notFound(res);
};

const handlePostRequest = (req, res) => {
  for (i = 0; i < POST_PATHS.length; i++) {
    const requestUrl = nodeUrlTools.parse(req.url, true);
    if (POST_PATHS[i].path === requestUrl.pathname) {
      POST_PATHS[i].handler(req, res);
      return;
    }
  }
  notFound(res);
};

const extractQueryParams = (req, query) => {
  req.params = {};
  for (const param of Object.keys(query)) {
    req.params[param] = query[param];
  }
};

const serveFile = (path, res) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
      console.log(err);
    } else {
      res.write(data);
      res.end();
    }
  });
};

const notFound = (res) => {
  res.statusCode = 404;
  res.end();
};

const get = (path, handler) => {
  GET_PATHS.push({
    path,
    handler,
  });
};

const post = (path, handler) => {
  POST_PATHS.push({
    path,
    handler,
  });
};

module.exports = {
  server,
  get,
  post,
  serveFile,
};
