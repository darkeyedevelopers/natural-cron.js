'use strict';

const regexString = require('./maps').regexString;
var flags = require('./maps').flags;
var resultCron = require('./maps').resultCron;
//tokenizeInput function to seperate out all tokens

module.exports = {
    tokenizeInput : function(inputString){
        let regBuilder = new RegExp(regexString.tokenising.regexexec,"ig");
        let matches = inputString.match(regBuilder);
        if(matches == null || matches.length == 0 ) {
            return [];
        }
        for(let i=0;i<matches.length;i++) {
            matches[i] = (matches[i]+"").trim();
        }
        return matches;
    }
};
