const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');

const routesAuthMiddleware = require('./routes/authorization.routes');
const routesAdminAuthMiddleware = require('./routes/adminAuthorization.routes');
const routesAdminActionsMiddleware = require('./routes/adminActions.routes');
const routesPersonalDataMiddleware = require('./routes/personalData.routes');
const routesApplicationDataMiddleware = require('./routes/userAppData.routes');

const app = express();
const PORT = config.get('port') || 5000;

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true, parameterLimit: 30000 }));

app.use('/api/authorization', routesAuthMiddleware);
app.use('/api/personal-data', routesPersonalDataMiddleware);
app.use('/api/user-application-data', routesApplicationDataMiddleware);
app.use('/api/adminAuthorization', routesAdminAuthMiddleware);
app.use('/api/adminActions', routesAdminActionsMiddleware);


if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

async function startServer() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`Node.js SWSOnline HTTP-server run on port ${PORT}`));
  } catch(error) {
    console.log('Server error', error.message);
    process.exit(1);
  }
}

startServer();
