const middleware = {
    rewriteUnsupportedBrowserMethods(req, res, next) {
        // If the user posts to the server with a property called _method, rewrite the request's method
        // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
        // rewritten in this middleware to a PUT route
        if (req.body && req.body._method) {
          req.method = req.body._method;
          delete req.body._method;
        }      
        // let the next middleware run:
        next();
    },

    /* This middleware logs every request, with authentication info  */
    logRequests(req, res, next) {
        const date = new Date().toUTCString();
        let authorized = false;
        if (req.cookies.AuthState) authorized = true;
        console.log(`[${date}]: ${req.method} ${req.originalUrl} (${authorized ? 'Authenticated User' : 'Non-Authenticated User'})`);

        /* We can uncomment the below if we decide not to do a general info page for / */
        // if (req.path === '/') {
        //     if (authorized && req.session.user && req.session.user.role === 'admin') return res.redirect('/admin');
        //     else if (authorized && req.session.user && req.session.user.role === 'user') return res.redirect('/protected');
        //     else return res.redirect('/login');
        // }
        
        next();
    },

    // Redirects user to login page if user is not logged in and tries to access homepage
    homepageRedirect(req, res, next)
    {
        
        // let authorized = false;

        // if (req.cookies.AuthState) 
        //     authorized = true;

        // if (!authorized && req.path == "/") 
        //     return res.redirect('/login');

        // else if (authorized && req.path == "/")
            
        //     next();


        // else if (req.path != "/")
        //     next();

        let authorized = false;
        if (req.cookies.AuthState) authorized = true;

        // Redirect only if trying to access home and not authorized
        if (!authorized && req.path === "/") {
            return res.redirect('/login');
        }
        next();


  
    },

    /* Prevents an authorized user from accessing /register */
    unprotectedRouteRedirect(req, res, next) {
        let authorized = false;
        if (req.cookies.AuthState) authorized = true;
        if (authorized) return res.redirect('/');
        next();
    },

    /* Prevents an unauthorized user or a user with no group from accessing a protected route */
    protectedRouteRedirect(req, res, next) {
        let authorized = false;
        if (req.cookies.AuthState) authorized = true;

        // redirect when authorized user tries to access /login
        if (req.path === '/login' && authorized) return res.redirect('/')
        // redirect to /login for unauthorized users
        // if (!authorized) return res.redirect('/');
        // redirect to home if authorized but NOT in a group
        // if (authorized && !(req.session.user && req.session.user.groupID)) return res.redirect('/');
        next();
    }
}

export default middleware;