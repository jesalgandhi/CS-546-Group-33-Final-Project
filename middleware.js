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
    }
}

export default middleware;