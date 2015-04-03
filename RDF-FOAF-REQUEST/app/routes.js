var models = require('./models/find_model');
var requete = models.Requete;

module.exports = function(app) {
    require('./routes/deck.js')(app);
    require('./routes/search.js')(app);
};


