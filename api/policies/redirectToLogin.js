// api/policies/redirectToLogin.js

module.exports = async function(req, res, next) {

    console.log("REQ ", req.session);
    // Check if user is authenticated
    if (!req.session.authenticated) {
      // Redirect to login page
      return res.redirect('/api/v1/auth/login');
    }
  
    // User is authenticated, proceed to the next middleware or controller action
    return next();
  };
  