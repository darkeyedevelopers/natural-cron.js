'use strict';

const regexString = require('../maps').regexString;
var flags = require('../maps').flags;
var resultCron = require('../maps').resultCron;

/*getMinute function to parse minutes*/
function getMinute(token,stack,error) {
    // TO DO: check for group
    let regBuilder = new RegExp(regexString.minute.regexexec[0],"ig");
    let value;
    // check for word minute,minutes
    if(regBuilder.test(token)) {
        let topElement = stack[stack.length-1];
        if(topElement == null) {
            topElement = {
                'frequency' : "*"
            };
        } else if(topElement.ownerState == "frequencyOnly") {
            value = topElement.frequency;
            resultCron.min = "0/"+topElement.frequency;
            stack.pop();
        } else if(topElement.ownerState == "frequencyWith") {
            value = topElement.frequency;
            resultCron.min = ""+topElement.frequency;
            stack.pop();
        } else {
            if(flags.isRangeForMinute == true) {
                error +=" already set for range expressions, seperate into two crons!";
                return false;
            }
            else if(topElement.ownerState == "rangeStart") {
                topElement.min.start = topElement.frequency.start;
                topElement.frequency.start = "";
                stack.pop();
                stack.push(topElement);
                return true;
            } else if(topElement.ownerState == "rangeEnd") {
                stack.pop();
                topElement.min.start = topElement.frequency.start;
                topElement.min.end = topElement.frequency.end;
                topElement.frequency.end = "";
                resultCron.min = topElement.min.start + "-"+topElement.min.end;
                //flags.isRangeForMin = true;
                return true;
            }
        }
    }
    let stackElement = {
        "ownerState" : "minute",
        "min" : value
    };
    stack.push(stackElement);
    return true;
}


module.exports = {
    getMinute
};
