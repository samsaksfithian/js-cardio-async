const fs = require('fs').promises;

/**
 * Resets the database (does not touch added files)
 */
function reset() {
  const andrew = fs.writeFile(
    '.db-files/andrew.json',
    JSON.stringify({
      firstname: 'Andrew',
      lastname: 'Maney',
      email: 'amaney@talentpath.com',
    }),
  );
  const scott = fs.writeFile(
    './db-files/scott.json',
    JSON.stringify({
      firstname: 'Scott',
      lastname: 'Roberts',
      email: 'sroberts@talentpath.com',
      username: 'scoot',
    }),
  );
  const post = fs.writeFile(
    './db-files/post.json',
    JSON.stringify({
      title: 'Async/Await lesson',
      description: 'How to write asynchronous JavaScript',
      date: 'July 15, 2019',
    }),
  );
  const log = fs.writeFile('./db-files/log.txt', '=== Beginning of Log ===\n');
  return Promise.all([andrew, scott, post, log]);
}

reset();

module.exports = { reset };
