const { search } = require("./db/db");
const fs = require("fs");

async function handleSearch(req, res) {
  const keyword = req.params.keyword;

  if (keyword) {
    const results = await search(keyword);
    if (results.length == 0) {
      res.statusCode = 404;
      res.end();
      return;
    }
    const filename = `${Date.now()}_results.txt`;

    const ws = fs.createWriteStream(`./storage/${filename}`);

    let i = 0;
    const writeToFile = () => {
      for (i; i < results.length; i++) {
        const canWrite = ws.write(`${results[i].domain}\n`);
        if (!canWrite) break;
      }
      res.setHeader("Content-Type", "application/json");
      const response = {
        filename,
      };
      res.write(JSON.stringify(response));
      res.end();
    };
    ws.on("drain", () => {
      writeToFile();
    });

    writeToFile();
  } else {
    res.end();
  }
}

module.exports.handleSearch = handleSearch;
