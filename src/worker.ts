import { parentPort, workerData } from "worker_threads";

let count = 0;
for (let i = 0; i <= workerData; i++) {
  count += i;
}

// Send result back to main thread
if (parentPort) {
  parentPort.postMessage(count);
}
