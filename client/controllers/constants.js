(function () {

var front = require('../libs/front/frontjs.min.js');

angular
    .module("frontApp")
    .constant('front', front);

})();