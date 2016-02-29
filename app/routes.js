module.exports = function(app, passport, ctrl) {

    /*app.use('/static', express.static(__dirname + '/public'));*/

    // route for home page
    app.get('/', function(req, res) {
        res.render('index.html'); // load the index.ejs file
    });

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {

        ctrl.fb.get_homefb(function(resfb){

            /*res.render('profile.html', {
                user : req.user,
                data : response.data
            });*/

            ctrl.tweet.get_hometm(function(err, data, response){
                res.render('profile.html', {
                    twdata : data,
                    fbdata : resfb.data
                }); 
            });

        }); 
    });

    app.get('/myTwitter', isLoggedIn, function(req, res){
        ctrl.tweet.get_usertm(function(err, data, response){
            res.render('myTwitter.html', {
                utwdata : data
            });
        });
    });

    app.get('/myFacebook', isLoggedIn, function(req, res){
        ctrl.fb.get_homefb(function(resfb){
            res.render('myFacebook.html', {
                fbdata : resfb.data
            });
        });
    });


    app.get('/myMentions', isLoggedIn, function(req, res){
        ctrl.tweet.get_usermm(function(err, data, response){
            res.render('myMentions.html', {
                mtwdata : data
            });
        });
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/search', function(req, res) {
        res.render('search.html');
    });


    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'user_posts', 'publish_actions']}));

    app.get('/auth/facebook/callback', 
      passport.authenticate('facebook', { successRedirect: '/profile',
                                          failureRedirect: '/' })
    );

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}