const dns = require("dns");
const { insert } = require("./db/db");

function lookup(domain) {
  return new Promise((resolve) => {
    dns.resolve(domain, "TXT", (err, records) => {
      if (err) {
        resolve();
        return;
      } else resolve(records);
      const obj = {
        domain: domain,
        txt_records: [],
      };

      for (const recordArray of records) {
        for (const record of recordArray) {
          obj.txt_records.push(record);
        }
      }

      insert(obj).finally(() => {
        resolve();
      });
    });
  });
}

module.exports.lookup = lookup;
