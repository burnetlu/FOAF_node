var mongoose = require('mongoose');

var Requete = mongoose.Schema(
    {
        search       : {type: Object, index: true},
        searchOptions      : {type : [Object]}
    }
);
exports.Requete = mongoose.model('Requete', Requete);


