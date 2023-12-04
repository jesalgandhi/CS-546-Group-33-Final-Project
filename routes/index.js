import homepageAndErrorRoutes from './homepage_error.js';
import registerRoutes from './register.js';
import loginAndLogoutRoutes from './login_logout.js';
import matchesRoutes from './matches.js';
import settingsRoutes from './settings.js';
import groupsRoutes from './groups.js';
import messagesRoutes from './messages.js';

const constructorMethod = (app) => {
  /* ALL ROUTES BELOW ARE NOT YET COMPLETED */
  app.use('/', homepageAndErrorRoutes); // error route is done 
  app.use('/register', registerRoutes);
  app.use('/', loginAndLogoutRoutes); // logout route is done
  app.use('/matches', matchesRoutes);
  app.use('/settings', settingsRoutes); 
  app.use('/groups', groupsRoutes); 
  app.use('/messages', messagesRoutes); 
  
  /* All other routes not above are redirected to /error - make sure to set errorCode and errorMessage (as shown below) 
    EVERY TIME YOU REDIRECT TO /error */
  app.use('*', (req, res) => {
    res.status(404).render('error', {title: "Error", error: "Page Not Found"});
  });
};

export default constructorMethod;
