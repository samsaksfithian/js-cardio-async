const fs = require('fs').promises;

/*
All of your functions must return a promise!
*/

/* 
Every function should be logged with a timestamp.
If the function logs data, then put that data into the log
ex after running get('user.json', 'email'):
  sroberts@talentpath.com 1563221866619

If the function just completes an operation, then mention that
ex after running delete('user.json'):
  user.json succesfully delete 1563221866619

Errors should also be logged (preferably in a human-readable format)
*/

/**
 * Resets the database (does not touch added files)
 */
function reset() {
  const andrew = fs.writeFile(
    './db-files/andrew.json',
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

/**
 * Appends the given info to the log file with a timestamp
 * @param {string} info the info to be logged
 * @param {Error} [error] the actual error, if it was an error
 * @returns {Promise}
 */
function addToLog(info, error = null) {
  if (error) console.error(error);
  return fs.appendFile(
    './db-files/log.txt',
    `${error ? 'ERROR: ' : ''}${info} | ${Date.now()}\n`,
  );
}

/**
 * Logs the value of object[key]
 * @param {string} file
 * @param {string} key
 */
function get(file, key) {
  return fs
    .readFile(`./db-files/${file}`)
    .then(fileData => {
      const data = JSON.parse(fileData);
      if (!data)
        return addToLog(
          `file '${file}' does not contain an object`,
          'File Not Parse-able',
        );
      const info = data[key];
      if (!info) return addToLog(`invalid key '${key}'`, 'Invalid Key');
      return addToLog(info);
    })
    .catch(err => addToLog(`problem reading/getting from '${file}'`, err));
}

/**
 * Sets the value of object[key] and rewrites object to file
 * @param {string} file
 * @param {string} key
 * @param {string} value
 */
function set(file, key, value) {
  return fs
    .readFile(`./db-files/${file}`)
    .then(fileData => {
      const data = JSON.parse(fileData);
      if (!data)
        return addToLog(
          `file '${file}' does not contain an object`,
          'File Not Parse-able',
        );
      data[key] = value;
      return fs.writeFile(`./db-files/${file}`, JSON.stringify(data));
    })
    .then(addToLog(`${file} successfully set ${key} to be ${value}`))
    .catch(err => addToLog(`problem reading/writing to '${file}'`, err));
}

/**
 * Deletes key from object and rewrites object to file
 * @param {string} file
 * @param {string} key
 */
function remove(file, key) {
  return fs
    .readFile(`./db-files/${file}`)
    .then(fileData => {
      const data = JSON.parse(fileData);
      if (!data)
        return addToLog(
          `file '${file}' does not contain an object`,
          'File Not Parse-able',
        );
      delete data[key];
      return fs.writeFile(`./db-files/${file}`, JSON.stringify(data));
    })
    .then(addToLog(`${file} successfully removed ${key}`))
    .catch(err => addToLog(`problem removing from '${file}'`, err));
}

/**
 * Deletes file.
 * Gracefully errors if the file does not exist.
 * @param {string} file
 */
function deleteFile(file) {
  return fs
    .access(`./db-files/${file}`)
    .then(() => fs.unlink(`./db-files/${file}`))
    .then(() => addToLog(`Successfully deleted '${file}'`))
    .catch(err => addToLog(`Cannot delete file, '${file}' does not exist`, err));
}

/**
 * Creates file with an empty object inside.
 * Gracefully errors if the file already exists.
 * @param {string} file JSON filename
 */
function createFile(file) {
  return fs
    .access(`./db-files/${file}`)
    .then(() =>
      addToLog(`Cannot create file, '${file}' already exists`, 'File already exists'),
    )
    .catch(() =>
      fs
        .writeFile(`./db-files/${file}`, '{}')
        .then(() => addToLog(`Successfully created '${file}'`))
        .catch(err => addToLog(`Problem deleting '${file}'`, err)),
    );
}

/**
 * Merges all data into a mega object and logs it.
 * Each object key should be the filename (without the .json) and the value should be the contents
 * ex:
 *  {
 *  user: {
 *      "firstname": "Scott",
 *      "lastname": "Roberts",
 *      "email": "sroberts@talentpath.com",
 *      "username": "scoot"
 *    },
 *  post: {
 *      "title": "Async/Await lesson",
 *      "description": "How to write asynchronous JavaScript",
 *      "date": "July 15, 2019"
 *    }
 * }
 */
function mergeData() {
  return fs.readdir('./db-files').then(dirFiles => {
    const dbFiles = dirFiles.filter(file => file.includes('.json'));
    const promiseArray = dbFiles.map(file => fs.readFile(`./db-files/${file}`, 'utf8'));
    const megaData = {};
    return Promise.all(promiseArray).then(allFileData => {
      allFileData.forEach((fileDataJSON, index) => {
        const filename = dbFiles[index].replace('.json', '');
        const fileData = JSON.parse(fileDataJSON);
        megaData[filename] = fileData;
      });
      return addToLog(JSON.stringify(megaData));
    });
  });
}

/**
 * Takes two files and logs all the properties as a list without duplicates
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *  union('scott.json', 'andrew.json')
 *  // ['firstname', 'lastname', 'email', 'username']
 */
function union(fileA, fileB) {}

/**
 * Takes two files and logs all the properties that both objects share
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    intersect('scott.json', 'andrew.json')
 *    // ['firstname', 'lastname', 'email']
 */
function intersect(fileA, fileB) {}

/**
 * Takes two files and logs all properties that are different between the two objects
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    difference('scott.json', 'andrew.json')
 *    // ['username']
 */
function difference(fileA, fileB) {}

module.exports = {
  reset,
  get,
  set,
  remove,
  deleteFile,
  createFile,
  mergeData,
  union,
  intersect,
  difference,
};
