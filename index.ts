import express from 'express';
import fs from 'fs';

const app = express();
const router = express.Router();


// credit: https://gist.github.com/paolorossi/1993068
const readStream = (req, res, file_path) => {
  var stat = fs.statSync(file_path);
  var total = stat.size;
  if (req.headers.range) {
    var range = req.headers.range;
    var parts = range.replace(/bytes=/, '').split('-');
    var partialstart = parts[0];
    var partialend = parts[1];

    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : total - 1;
    var chunksize = end - start + 1;
    var readStream = fs.createReadStream(file_path, { start: start, end: end });
    res.writeHead(206, {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    });
    readStream.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': total,
      'Content-Type': 'audio/mpeg',
    });
    fs.createReadStream(file_path).pipe(res);
  }
};

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.get('/test', async (req, res) => {
  // set absolute file path
  const dummyVideoAbsolutePath = '/home/vsode/workspaces/test/video.mp4';
  await readStream(req, res, dummyVideoAbsolutePath);
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});