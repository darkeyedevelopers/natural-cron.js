'use strict';

const regexString = require('../maps').regexString;
var flags = require('../maps').flags;
var resultCron = require('../maps').resultCron;

/*getDay function to parse days*/
function getDay(token,stack,error) {
    // TO DO: check for group
    let regBuilder = new RegExp(regexString.day.regexexec[0],"ig");
    let value = "";
    // check for word day,days
    if(regBuilder.test(token)) {
        let topElement = stack[stack.length-1];
        resultCron.day_of_week = "?";
        if(topElement == null) {
            topElement = {
                'frequency' : "*"
            };
        } else if(topElement.ownerState == "frequencyOnly") {
            resultCron.day_of_month = "0/"+topElement.frequency;
            stack.pop();
        } else if(topElement.ownerState == "frequencyWith") {
            resultCron.day_of_month = ""+topElement.frequency;
            stack.pop();
        } else {
            resultCron.day_of_month = "*";
        }
    }
    // check for values of days between [MON-SUN]
    else {
        regBuilder = new RegExp(regexString.day.regexexec[1],"ig");
        let matches = token.match(regBuilder);
        if(matches!=null && matches.length != 0) {
            resultCron.day_of_week = "";
            for(let i=0; i<matches.length; i++) {
                matches[i] = matches[i].toUpperCase();
            }
            // TO DO: check
            let topElement = stack[stack.length-1];
            if(matches.length == 1 && topElement != null) {
                //Check if already a range is defined
                if(flags.isRangeForDay == true) {
                    error +=" already set for range expressions, seperate into two crons!";
                    return false;
                }
                stack.pop();
                if(topElement.ownerState == "rangeStart") {
                    topElement.day.start = matches[0];
                    stack.push(topElement);
                    return true;
                } else if(topElement.ownerState == "rangeEnd") {
                    topElement.day.end = matches[0];
                    resultCron.day_of_week = topElement.day.start + "-"+topElement.day.end;
                    resultCron.day_of_month = "?";
                    //flags.isRangeForDay = true;
                    return true;
                }
            }
            if(matches.includes('MON') && !resultCron.day_of_week.includes('MON'))
                resultCron.day_of_week += "MON,";
            if(matches.includes('TUE') && !resultCron.day_of_week.includes('TUE'))
                resultCron.day_of_week += "TUE,";
            if(matches.includes('WED') && !resultCron.day_of_week.includes('WED'))
                resultCron.day_of_week += "WED,";
            if(matches.includes('THU') && !resultCron.day_of_week.includes('THU'))
                resultCron.day_of_week += "THU,";
            if(matches.includes('FRI') && !resultCron.day_of_week.includes('FRI'))
                resultCron.day_of_week += "FRI,";
            if(matches.includes('SAT') && !resultCron.day_of_week.includes('SAT'))
                resultCron.day_of_week += "SAT,";
            if(matches.includes('SUN') && !resultCron.day_of_week.includes('SUN'))
                resultCron.day_of_week += "SUN,";
            if(matches.includes('WEEKEND') && !resultCron.day_of_week.includes('SAT'))
                resultCron.day_of_week += "SAT,";
            if(matches.includes('WEEKEND') && !resultCron.day_of_week.includes('SUN'))
                resultCron.day_of_week += "SUN,";
            // removed extra comma
            resultCron.day_of_week = resultCron.day_of_week.slice(0,-1);
            resultCron.day_of_month = "?";
            value = ""+resultCron.day_of_week;
        } else {
            // TO DO: provide in future. but for NOW  error
            error +=" In unresolved state at 2;Day !";
            return false;
        }
    }
    let stackElement = {
        "ownerState" : "day",
        "day_of_week" : resultCron.day_of_week,
        "day_of_month" : resultCron.day_of_month
    };
    stack.push(stackElement);
    return true;
}

module.exports = {
    getDay
};
