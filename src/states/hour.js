'use strict';

const regexString = require('../maps').regexString;
var flags = require('../maps').flags;
var resultCron = require('../maps').resultCron;

/*getHour function to parse Hours*/
function getHour(token,stack,error) {
    // TO DO: check for group
    let regBuilder = new RegExp(regexString.hour.regexexec[0],"ig");
    let value;
    // check for word hours
    if(regBuilder.test(token)) {
        let topElement = stack[stack.length-1];
        if(topElement == null) {
            topElement = {
                'frequency' : "*"
            };
        } else if(topElement.ownerState == "frequencyOnly") {
            value = topElement.frequency;
            resultCron.hour = "0/"+topElement.frequency;
            stack.pop();
        } else if(topElement.ownerState == "frequencyWith") {
            //hour already set
            if(resultCron.hour != "*" && resultCron.hour != "")
                resultCron.hour += ","+topElement.frequency;
            else
                resultCron.hour = ""+topElement.frequency;
            value = resultCron.hour;
            stack.pop();
        } else {
            if(flags.isRangeForHour == true) {
                error +=" already set for range expressions, seperate into two crons!";
                return false;
            }
            else if(topElement.ownerState == "rangeStart") {
                topElement.hour.start = topElement.frequency.start;
                topElement.frequency.start = "";
                stack.pop();
                stack.push(topElement);
                return true;
            } else if(topElement.ownerState == "rangeEnd") {
                stack.pop();
                topElement.hour.start = topElement.frequency.start;
                topElement.hour.end = topElement.frequency.end;
                topElement.frequency.end = "";
                resultCron.hour = topElement.hour.start + "-"+topElement.hour.end;
                //flags.isRangeForHour = true;
                return true;
            }
        }
    }
    let stackElement = {
        "ownerState" : "hour",
        "hour" : value
    };
    stack.push(stackElement);
    return true;
}


module.exports = {
    getHour
};
