import express from "express";
import cluster from "cluster";
import os from "os";

const totalCPUs = os.cpus().length;

const port = 3000;

if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  const app = express();
  console.log(`Worker ${process.pid} started`);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/api/:n", function (req, res) {
    let n = parseInt(req.params.n);
    let count = 0;

    if (n > 5000000000) n = 5000000000;

    for (let i = 0; i <= n; i++) {
      count += i;
    }

    res.send(`Final count is ${count} ${process.pid}`);
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}


// import express from 'express';
// import { Worker } from 'worker_threads';

// const app = express();
// const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// app.get('/api/:n', (req, res) => {
//   const n = parseInt(req.params.n);
//   if (isNaN(n)) return res.status(400).send('Invalid number');

//   const worker = new Worker('./worker.js', {
//     workerData: n > 5000000000 ? 5000000000 : n,
//   });

//   worker.on('message', (count) => {
//     res.send(`Final count is ${count} from thread ${worker.threadId}`);
//   });

//   worker.on('error', (err) => {
//     res.status(500).send('Something went wrong in worker thread');
//   });

//   worker.on('exit', (code) => {
//     if (code !== 0) {
//       console.error(`Worker stopped with exit code ${code}`);
//     }
//   });
// });

// app.listen(port, () => {
//   console.log(`App listening on http://localhost:${port}`);
// });
