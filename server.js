require('dotenv').config();
const mongoose = require('mongoose');

// process.on('uncaughtException', err => {
//   console.log('UNCAUGHT EXCEPTION!');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

const app = require('./app');

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('Connected to DB!'));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

// process.on('unhandledRejection', err => {
//   console.log('UNHANDLED REJECTION!');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
