const sqlite = require('sqlite3');
const path = require('path');

let db;

const connect = async () => {
  await conn();
  return true;
};

const getLongUrl = async localPath => {
  let query = 'select long_url from urls where short_url = ?';
  try {
    let row = await get(query, [localPath]);
    if (row && row.long_url) {
      return row.long_url;
    }
    return null;
  } catch (e) {
    console.error(e);
    return;
  }
};

const insert = async (longUrl, shortUrl) => {
  let query = 'insert into urls (long_url, short_url) values (?, ?)';
  try {
    return await run(query, [longUrl, shortUrl]);
  } catch (e) {
    console.error(e);
    return false;
  }
};

const run = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, err => {
      if (err) reject(err.message);
      else resolve(true);
    });
  });
};

const get = (query, params) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        console.error(err.message);
        reject(err.message);
      } else {
        resolve(row);
      }
    });
  });
};

const conn = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite.Database(path.join(__dirname, 'urls.db'), e => {
      if (e) reject(e.message);
      else resolve(true);
    });
  });
};

module.exports = {getLongUrl, insert, connect};
