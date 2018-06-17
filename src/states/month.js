'use strict';

const regexString = require('../maps').regexString;
var flags = require('../maps').flags;
var resultCron = require('../maps').resultCron;

/*getMonth function to parse months*/
function getMonth(token,stack,error) {
    // TO DO: check for group
    let regBuilder = new RegExp(regexString.month.regexexec[0],"ig");
    let value = "";
    // check for word month,months
    if(regBuilder.test(token)) {
        let topElement = stack[stack.length-1];
        if(topElement == null) {
            topElement = {
                'frequency' : "*"
            };
        }
        if(topElement.ownerState == "frequencyOnly") {
            resultCron.month = "0/"+topElement.frequency;
            stack.pop();
        } else if(topElement.ownerState == "frequencyWith") {
            resultCron.month = ""+topElement.frequency;
            stack.pop();
        } else {
            resultCron.month = "*";
        }
    }
    // check for values of months between [JAN-DEC]
    else {
        // TO DO: check for group
        regBuilder = new RegExp(regexString.month.regexexec[1],"ig");
        let matches = token.match(regBuilder);
        if(matches!=null && matches.length != 0) {
            resultCron.month = "";
            for(let i=0; i<matches.length; i++) {
                matches[i] = matches[i].toUpperCase();
            }
            // TO DO: check
            let topElement = stack[stack.length-1];

            if(matches.length == 1 && topElement != null) {
                //Check if already a range is defined
                if(flags.isRangeForMonth == true) {
                    error +=" already set for range expressions, seperate into two crons!";
                    return false;
                }
                stack.pop();
                if(topElement.ownerState == "frequencyOnly") {
                    resultCron.day_of_month = topElement.frequency;
                } else if(topElement.ownerState == "frequencyWith") {
                    resultCron.day_of_month = topElement.frequency;
                } else if(topElement.ownerState == "rangeStart") {
                    topElement.month.start = matches[0];
                    stack.push(topElement);
                    return true;
                } else if(topElement.ownerState == "rangeEnd") {
                    if(topElement.frequency.end != "") {
                        resultCron.day_of_week = "?";
                        resultCron.day_of_month = topElement.frequency.start + "-" + topElement.frequency.end;
                    }
                    topElement.month.end = matches[0];
                    resultCron.month = topElement.month.start + "-"+topElement.month.end;
                    //flags.isRangeForMonth = true;
                    return true;
                }
            }
            if(matches.includes('JAN') && !resultCron.month.includes('JAN'))
                resultCron.month += "JAN,";
            if(matches.includes('FEB') && !resultCron.month.includes('FEB'))
                resultCron.month += "FEB,";
            if(matches.includes('MAR') && !resultCron.month.includes('MAR'))
                resultCron.month += "MAR,";
            if(matches.includes('APR') && !resultCron.month.includes('APR'))
                resultCron.month += "APR,";
            if(matches.includes('MAY') && !resultCron.month.includes('MAY'))
                resultCron.month += "MAY,";
            if(matches.includes('JUN') && !resultCron.month.includes('JUN'))
                resultCron.month += "JUN,";
            if(matches.includes('JUL') && !resultCron.month.includes('JUL'))
                resultCron.month += "JUL,";
            if(matches.includes('AUG') && !resultCron.month.includes('AUG'))
                resultCron.month += "AUG,";
            if(matches.includes('SEPT') && !resultCron.month.includes('SEPT'))
                resultCron.month += "SEPT,";
            if(matches.includes('OCT') && !resultCron.month.includes('OCT'))
                resultCron.month += "OCT,";
            if(matches.includes('NOV') && !resultCron.month.includes('NOV'))
                resultCron.month += "NOV,";
            if(matches.includes('DEC') && !resultCron.month.includes('DEC'))
                resultCron.month += "DEC,";
            // removed extra comma
            resultCron.month = resultCron.month.slice(0,-1);
            value = ""+resultCron.month;
        } else {
            // TO DO: provide in future. but for NOW  error
            error +=" In unresolved state at 2;Month !";
            return false;
        }
    }
    let stackElement = {
        "ownerState" : "month",
        "month" : resultCron.month,
    };
    stack.push(stackElement);
    return true;
}


module.exports = {
    getMonth
};
