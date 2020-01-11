const fs = require('fs');
const path = require('path');

const loadFromDisk = () => {
  const source = path.join(__dirname, '..', 'migrations');
  return new Promise((resolve, reject) => {
    fs.readdir(source, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const files = data.map((fileName) => ({
          fileName,
          filePath: path.join(source, fileName),
          etag: Number(fileName.split('--').shift()),
        }));

        // Ensure order based on etag
        files.sort((a, b) => a.etag - b.etag);
        resolve(files);
      }
    });
  });
};

module.exports = {
  loadFromDisk,
};
