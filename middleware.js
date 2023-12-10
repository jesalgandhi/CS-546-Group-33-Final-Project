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
        let authorized = false;

        if (req.cookies.AuthState) 
            authorized = true;

        if (!authorized && req.path == "/") 
            return res.redirect('/login');

        else if (authorized && req.path == "/")
            next();


        else if (req.path != "/")
            next();


        
    },

    /* Redirects if user is not logged in (or page denied if they are not an admin(?)) */
    messagesRedirect(req, res, next) {
        let authorized = false;
        if (req.cookies.AuthState) authorized = true;
        if (!authorized) return res.redirect('/login');

        /* Uncomment below if we decide that only admins can send messages */
        // if (authorized && req.session.user && req.session.user.admin !== false) {
        //     req.session.errorCode = 403;
        //     req.session.errorMessage = "You do not have permission to view this page";
        //     return res.redirect('/error');
        // }
        next()
    },
}

export default middleware;