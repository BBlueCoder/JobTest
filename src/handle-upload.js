const busboy = require("busboy");
const fs = require("fs");
const readline = require("readline");
const { lookup } = require("./dns-lookup");
const { Worker } = require("worker_threads");
const { initializeClient } = require("./db/client");

function handleUpload(req, res) {
  const bb = busboy({ headers: req.headers });

  let filePath;
  bb.on("file", (name, file, info) => {
    const { filename } = info;
    filePath = `./storage/${Date.now()}_${filename}`;
    file.pipe(fs.createWriteStream(filePath));
  });

  bb.on("close", () => {
    readFileWithWorkers(filePath)
      .catch(console.error)
      .finally(() => {
        res.end();
      });
  });

  req.pipe(bb);
}

/**
 * This read file and process it using only promises
 * A simple benchmark :
 * Time to execute ≈ 32s
 * Memory ≈ 25MB
 * @param  path of file
 * @returns Promise<void>
 */
async function readFile(path) {
  return new Promise(async (resolve) => {
    console.time("process");
    const rs = fs.createReadStream(path);

    const rl = readline.createInterface({
      input: rs,
      crlfDelay: Infinity,
    });

    const promises = [];

    for await (const line of rl) {
      promises.push(lookup(line));
    }

    const records = await Promise.all(promises).catch(console.log);
    console.timeEnd("process");
    resolve(records);
  });
}

/**
 * This read file and process it using worker threads
 * A simple benchmark :
 * Time to execute ≈ 17s
 * Memory ≈ 120MB
 * @param  path of file
 * @returns Promise<void>
 */
async function readFileWithWorkers(path) {
  return new Promise(async (resolve) => {
    console.time("process");
    const rs = fs.createReadStream(path);
    const client = await initializeClient();

    const rl = readline.createInterface({
      input: rs,
      crlfDelay: Infinity,
    });

    const promises = [];
    let domains = [];

    for await (const line of rl) {
      if (domains.length < 100) {
        domains.push(line);
      } else {
        promises.push(createWorker(domains, client));
        domains = [];
      }
    }

    promises.push(createWorker(domains));

    await Promise.all(promises).catch(console.log);
    console.timeEnd("process");
    resolve();
  });
}

function createWorker(records) {
  return new Promise((resolve) => {
    const worker = new Worker("./worker.js", {
      workerData: { records },
    });

    worker.on("message", () => {
      resolve();
    });

    worker.on("error", (err) => {
      console.log(err);
      resolve();
    });
  });
}

module.exports.handleUpload = handleUpload;
