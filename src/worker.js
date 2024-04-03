const { lookup } = require("./dns-lookup");
const { workerData, parentPort } = require("worker_threads");

(async () => {
  const records = workerData.records;

  const promises = [];
  for (const record of records) {
    promises.push(lookup(record));
  }

  await Promise.all(promises);
})().then(() => {
  parentPort.postMessage("done!");
});
