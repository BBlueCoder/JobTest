const { handleSearch } = require("./handle-search");
const { handleUpload } = require("./handle-upload");
const { server, get, serveFile, post } = require("./server");

get("/", (req, res) => {
  serveFile("./public/index.html", res);
});

get("/upload.png", (req, res) => {
  serveFile("./public/upload.png", res);
});

get("/search", async (req, res) => {
  try {
    await handleSearch(req, res);
  } catch {
    res.statusCode = 500;
    res.end();
  }
});

get("/results", (req, res) => {
  if (req.params.filename) {
    serveFile(`./storage/${req.params.filename}`, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

post("/upload", async (req, res) => {
  try {
    await handleUpload(req, res);
  } catch {
    res.statusCode = 500;
    res.end();
  }
});

server.listen(5000, () => {
  console.log("Server is running on ", server.address());
});
