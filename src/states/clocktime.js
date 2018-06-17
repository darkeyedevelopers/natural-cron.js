'use strict';

const regexString = require('../maps').regexString;
var flags = require('../maps').flags;
var resultCron = require('../maps').resultCron;

/*clockTime function to parse and store frequency value without nth*/
function getClockTime(token,stack,error) {
    //retrive hours from clocktime
    let regBuilder = new RegExp(regexString.clockTime.regexexec[0]);
    let str = token.match(regBuilder);

    let hour,min;
    if(str != null && str.length > 0) {
        hour = parseInt(str[0]);
    } else {
        hour = 0;
    }

    //retrive minutes from clockTime
    regBuilder = new RegExp(regexString.clockTime.regexexec[1]);
    str = regBuilder.exec(token);
    if(str != null && str.length > 0) {
        if(str[0].indexOf(':')!=-1) {
            min = parseInt(str[0].slice(str[0].indexOf(':')+1));
            if(min >= 60) {
                error +=" please enter correct minutes !";
                return false;
            }
        } else {
            min = 0;
        }
    } else {
        min = 0;
    }

    //check for increment of hour by 12 for PM
    let regBuilderPM = new RegExp(regexString.clockTime.regexexec[2],'ig');
    let regBuilderAM = new RegExp(regexString.clockTime.regexexec[3],'ig');
    if(regBuilderPM.test(token)) {
        if(hour < 12) {
            hour+=12;
        } else if(hour > 12 ){
            error +=" please correct the time before PM !";
            return false;
        }
    } else if(regBuilderAM.test(token)){
        if(hour == 12) {
            hour = 0;
        } else if(hour > 12 ){
            error +=" please correct the time before AM !";
            return false;
        }
    }

    regBuilder = new RegExp(regexString.clockTime.regexexec[4],'ig');
    if(regBuilder.test(token)) {
        str = token.match(regBuilder);
        if(str == "noon") {
            hour = 12;
            min = 0;
        } else {
            hour = 0;
            min = 0;
        }
    }

    // TO DO: checked=>Test==?
    let topElement = stack[stack.length-1];
    if(topElement != null) {
        //Check if already a range is defined
        if(flags.isRangeForHour == true || flags.isRangeForMin == true) {
            error +=" already set for range expressions, seperate into two crons!";
            return false;
        }

        if(topElement.ownerState == "rangeStart") {
            topElement.hour.start = hour;
            topElement.min.start = min;
            stack.pop();
            stack.push(topElement);
            return true;
        } else if(topElement.ownerState == "rangeEnd") {
            if(topElement.hour == hour) {
                topElement.min.end = min;
                resultCron.min = topElement.min.start + "-"+topElement.min.end;
                //flags.isRangeForHour = true;
                return true;
            } else {
                topElement.hour.end = hour;
                resultCron.hour = topElement.hour.start + "-"+topElement.hour.end;
                //flags.isRangeForMin = true;
                return true;
            }
            stack.pop();
            return true;
        }
    }

    let stackElement = {
        "ownerState" : "clockTime",
        "hour" : hour,
        "min" : min
    };
    resultCron.min = min;
    if(resultCron.hour != "*" && resultCron.hour != "")
        resultCron.hour += ","+hour;
    else
        resultCron.hour = hour;
    stack.push(stackElement);
    return true;
}

module.exports = {
    getClockTime
};
