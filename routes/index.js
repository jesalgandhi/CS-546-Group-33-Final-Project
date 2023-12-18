import homepageAndErrorRoutes from './homepage_error.js';
import registerRoutes from './register.js';
import loginAndLogoutRoutes from './login_logout.js';
import matchesRoutes from './matches.js';
import settingsRoutes from './settings.js';
import groupsRoutes from './groups.js';
import messagesRoutes from './messages.js';
import reviewsRoutes from './reviews.js';


/* DELETE BEFORE SUBMISSION */
import {usersData} from '../data/index.js';


const constructorMethod = (app) => {

  /* DELETE BEFORE SUBMISSION */
  /* THIS ROUTE IS FOR TESTING PURPOSES (TO LOGIN WITHOUT CREDENTIALS) DELETE BEFORE SUBMITTING */
  app.use('/logintest', async (req, res) => {
    const users = await usersData.getAllUsers();
    req.session.user = {
      /* Feel free to add key/values here if needed */
      firstName: "Test", 
      lastName: "User", 
      emailAddress: "test@example.com",
      phoneNumber: "2015554516", 
      biography: "This is for testing purposes", 
      age: 23, 
      interests: ["Biking", "Sports", "Movies"],
      picture: "URL Will be here(?)", 
      admin: true,
      id: users[0]._id.toString()
    }
    return res.redirect('/');
  });

  /* ALL ROUTES BELOW ARE NOT YET COMPLETED */
  app.use('/', homepageAndErrorRoutes); // error route is done 
  app.use('/register', registerRoutes);
  app.use('/', loginAndLogoutRoutes); // logout route is done
  app.use('/matches', matchesRoutes);
  app.use('/settings', settingsRoutes); 
  app.use('/groups', groupsRoutes); 
  app.use('/messages', messagesRoutes); 
  app.use('/reviews', reviewsRoutes); 
  
  /* All other routes not above are redirected to /error - make sure to set errorCode and errorMessage (as shown below) 
    EVERY TIME YOU REDIRECT TO /error */
  app.use('*', (req, res) => {
    res.status(404).render('error', {title: "Error", error: "Page Not Found"});
  });
};

export default constructorMethod;
