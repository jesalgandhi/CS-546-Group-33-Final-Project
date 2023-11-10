// This file will import both route files and export the constructor method as shown in the lecture code

/*
    - When the route is /events use the routes defined in the events.js routing file
    - When the route is /attendees use the routes defined in attendee.js routing file
    - All other enpoints should respond with a 404 as shown in the lecture code
*/

import groupsRoutes from './groups.js';
import usersRoutes from './users.js';
import messagesRoutes from './messages.js';

const constructorMethod = (app) => {
  app.use('/groups', groupsRoutes);
  app.use('/users', usersRoutes);
  app.use('/messages', messagesRoutes);
  /* PROBABLY NEED TO ADD MORE ROUTES FOR SIGNUP, LOGIN, HOMEPAGE, ETC. */

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;
