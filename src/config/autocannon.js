import { PassThrough } from 'stream';
import autocannon from 'autocannon';

const init = (url) => {
  const buf = [];
  const outputStream = new PassThrough();
  const inst = autocannon({
    url,
    connections: 100,
    duration: 20,
  });
  autocannon.track(inst, { outputStream });
  outputStream.on('data', (data) => buf.push(data));
  inst.on('done', () => {
    process.stdout.write(Buffer.concat(buf));
  });
};

init('http://localhost:8080/api/v1/test/tech-info');
