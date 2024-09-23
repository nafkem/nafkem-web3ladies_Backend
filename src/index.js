const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { Payment } = require('./models');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const io = require("socket.io")(server, {cors: {options: "*"}});

io.on("connection", (socket) => {
  //console.log(`${socket.id} is online`);
  socket.on('getPayment', async (message) => {
    totalPayments =0
   let payments =  await Payment.find()
   for (let i=0; i < payments.length; i++){
    totalPayments += payments[i].amount
   }
    io.emit('allPayment', totalPayments);
  })
  socket.on("disconnect", () => {
    console.log(`${socket.id} is offline`)
  })
});


const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
