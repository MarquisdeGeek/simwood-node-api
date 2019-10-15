const express = require('express');
const morgan = require('morgan');
process.on('unhandledRejection', r => console.log(r))

const app = express();

async function server(uri, cb, simwood) {

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
  app.use(express.json());
  app.post('/:path?', function (req, res) {
    try {
      const {
        app,
        id,
        data
      } = req.body;

      cb(app, id, data);

      var response = {
        status: 'OK'
      }

      // Send results
      res.setHeader('Content-Type', 'application/json');
      res.status(200)
        .send(JSON.stringify((response) ? response : {
          status: 'OK'
        }));

    } catch (err) {
      console.error(err);
      res.setHeader('Content-Type', 'application/json');
      res.status(400)
        .send(JSON.stringify({
          status: 'BAD REQUEST',
          errorMessage: err.message
        }));
    }
  });

  app.listen(8080);

}
exports = module.exports = server;
