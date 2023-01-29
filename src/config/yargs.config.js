import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const args = yargs(hideBin(process.argv))
  .default({
    port: 8080,
    mode: 'fork',
    dao: 'mongo',
  })

  .alias({
    p: 'port',
    m: 'mode',
    d: 'dao',
  })
  .choices({
    m: ['fork', 'cluster', 'native_cluster'],
    d: ['mongo', 'sql', 'firestore'],
  }).argv;

export { args };
