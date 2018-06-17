'use strict';

const regexString = require('../maps').regexString;
var flags = require('../maps').flags;
var resultCron = require('../maps').resultCron;


/*getYear function to parse year*/
function getYear(token,stack,error) {
    // TO DO: check for group
    let regBuilder = new RegExp(regexString.year.regexexec[0],"ig");
    let value = "";
    // check for word year,years
    if(regBuilder.test(token)) {
        let topElement = stack[stack.length-1];
        resultCron.year = "?";
        if(topElement == null) {
            topElement = {
                'frequency' : "*"
            };
        } else if(topElement.ownerState == "frequencyOnly") {
            resultCron.year = "0/"+topElement.frequency;
            stack.pop();
        } else if(topElement.ownerState == "frequencyWith") {
            resultCron.year = ""+topElement.frequency;
            stack.pop();
        } else {
            resultCron.year = "*";
        }
    }
    // check for values of years
    else {
        regBuilder = new RegExp(regexString.year.regexexec[1],"ig");
        let regBuilder2 = new RegExp(regexString.year.regexexec[2],"ig")
        let matches = token.match(regBuilder);
        let exactMatches = new Set();
        for(let i=0; i<matches.length; i++) {
            if(regBuilder2.test(matches[i])) {
                exactMatches.add(matches[i].match(regBuilder2)[0]);
            }
        }
        // TO DO: check
        let topElement = stack[stack.length-1];
        if(exactMatches.size == 1 && topElement != null) {
            //Check if already a range is defined
            if(flags.isRangeForYear == true) {
                error +=" Cannot handle multiple range expressions, seperate into two crons!";
                return false;
            }

            if(topElement.ownerState == "rangeStart") {
                topElement.year.start = Array.from(exactMatches)[0];
                stack.pop();
                stack.push(topElement);
                return true;
            } else if(topElement.ownerState == "rangeEnd") {
                topElement.year.end = Array.from(exactMatches)[0];
                stack.pop();
                resultCron.year = topElement.year.start + "-"+topElement.year.end;
                //flags.isRangeForYear = true;
                return true;
            }
        }
        if(exactMatches.size != 0) {
            resultCron.year = "";
            exactMatches.forEach(function(yr){
                resultCron.year += yr+",";
            });
            // removed extra comma
            resultCron.year = resultCron.year.slice(0,-1);
            value = ""+resultCron.year;
        } else {
            // TO DO: provide in future. but for NOW  error
            error +=" In unresolved state at 2;year !";
            return false;
        }
    }
    let stackElement = {
        "ownerState" : "year",
        "year" : resultCron.year
    };
    stack.push(stackElement);
    return true;
}

module.exports = {
    getYear
};
