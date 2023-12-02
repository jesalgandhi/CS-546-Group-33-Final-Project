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

    logRequestsAndRedirect(req, res, next) {
        const date = new Date().toUTCString();
        
        /* TODO: authorization logic to log if user is authenticated or not */
        // const authorized = false;
        // if (req.cookies.AuthState) authorized = true;
        // console.log(`[${date}]: ${req.method} ${req.originalUrl} (${authorized ? 'Authenticated User' : 'Non-Authenticated User'})`);
        
        console.log(`[${date}]: ${req.method} ${req.originalUrl}`);

        // if (authorized && req.session.user.role === 'admin') res.redirect('/admin');
        // else if (authorized && req.session.user.role === 'user') res.redirect('/protected');
        // else res.redirect('/login');

        next();
    }
}

export default middleware;