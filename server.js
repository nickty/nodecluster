/** @format */

const express = require('express');
const cluster = require('cluster');
const fabObj = require('./math-logic/fibonacci-series');
const totalCpu = require('os').cpus().length;
const app = express();
// http://localhost:3000?number=10
// console.log(cluster);

if (cluster.isMaster) {
  for (let i = 0; i < totalCpu; i++) {
    cluster.fork();
  }
  cluster.on('online', (worker) => {
    console.log('worker id', worker.id);
    console.log('worker process id', worker.process.pid);
  });
  cluster.on('exit', (worker) => {
    console.log(worker.id);
    cluster.fork();
  });
} else {
  app.get('/', (request, response) => {
    console.log(`Who accepted request, ${cluster.worker.process.pid}`);
    console.log(`Who accepted request, ${cluster.worker.id}`);
    let number = fabObj.calculateFibonacciValue(
      Number.parseInt(request.query.number)
    );
    response.send(`<h1>${number}</h1>`);
  });

  app.listen(3000, () => console.log('Express App is running on PORT : 3000'));
}
