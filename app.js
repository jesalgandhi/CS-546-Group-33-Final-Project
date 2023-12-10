// This file should set up the express server as shown in the lecture code

import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import middleware from './middleware.js';
import session from 'express-session';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + '/public');

/* Set express-handlebars as rendering engine */
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/* Session: We will probably need something similar to this: */
app.use(session({
  name: 'AuthState',
  secret: 'Yeat is the greatest artist of all time',
  resave: false,
  saveUninitialized: false
}))

/* Call Middleware here: */
app.use(express.urlencoded({extended: true}));
app.use('/public', staticDir);
app.use(express.json());
app.use(cookieParser());
app.use(middleware.rewriteUnsupportedBrowserMethods);
app.use("/", middleware.logRequests); // logs every request
app.use("/", middleware.loginRedirect); //redirects for / (homepage)
app.use("/messages", middleware.messagesRedirect); // redirects for /messages
// ...


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});