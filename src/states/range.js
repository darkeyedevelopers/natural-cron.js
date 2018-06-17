'use strict';

const regexString = require('../maps').regexString;
var flags = require('../maps').flags;
var resultCron = require('../maps').resultCron;


/*rangeStartState function for range input*/
function rangeStartState(token,stack,error) {
    if(flags.isRangeForDay || flags.isRangeForMin || flags.isRangeForMonth || flags.isRangeForYear || flags.isRangeForHour) {
        error +=" already range expressions !";
        return false;
    }
    let stackElement = {
        "ownerState" : "rangeStart",
        "min": {
            "start" : "",
            "end" : ""
        },
        "hour" : {
            "start" : "",
            "end" : ""
        },
        "day" : {
            "start" : "",
            "end" : ""
        },
        "month" : {
            "start" : "",
            "end" : ""
        },
        "year" : {
            "start" : "",
            "end" : ""
        },
        "frequency" : {
            "start" : "",
            "end" : ""
        }
    };
    stack.push(stackElement);
    return true;
}

/*rangeEndState function for range input*/
function rangeEndState(token,stack,error) {
    let stackElement = {
        "ownerState" : "rangeEnd",
        "min": {
            "start" : "",
            "end" : ""
        },
        "hour" : {
            "start" : "",
            "end" : ""
        },
        "day" : {
            "start" : "",
            "end" : ""
        },
        "month" : {
            "start" : "",
            "end" : ""
        },
        "year" : {
            "start" : "",
            "end" : ""
        },
        "frequency" : {
            "start" : "",
            "end" : ""
        }
    };
    let topElement = stack[stack.length-1];
    if(topElement!=null) {
        switch(topElement.ownerState) {
            case "frequencyWith" :
            case "frequencyOnly" :
            {
                stack.pop();
                stackElement.frequency.start = topElement.frequency;
                stackElement.ownerState = "rangeEnd";
                stack.push(stackElement)
            }
            break;
            case "clockTime" :
            {
                stack.pop();
                stackElement.hour.start = topElement.hour;
                stackElement.min.start = topElement.min;
                stackElement.ownerState = "rangeEnd";
                stack.push(stackElement)
            }
            break;
            case "rangeStart" :
            {
                stack.pop();
                topElement.ownerState = "rangeEnd";
                stack.push(topElement);
            }
            break;
            case "month" :
            {
                stack.pop();
                stackElement.ownerState = "rangeEnd";
                stackElement.month.start = topElement.month;
                stack.push(stackElement);
            }
            break;
            case "minute" :
            {
                stack.pop();
                stackElement.ownerState = "rangeEnd";
                stackElement.frequency.start = stackElement.min.start = topElement.min;
                stack.push(stackElement);
            }
            break;
            case "hour" :
            {
                stack.pop();
                stackElement.ownerState = "rangeEnd";
                stackElement.frequency.start = stackElement.hour.start = topElement.hour;
                stack.push(stackElement);
            }
            break;
            case "day" :
            {
                stack.pop();
                stackElement.ownerState = "rangeEnd";
                stackElement.day.start = topElement.day_of_week;
                stack.push(stackElement);
            }
            break;
            case "year" :
            {
                stack.pop();
                stackElement.ownerState = "rangeEnd";
                stackElement.year.start = topElement.year;
                stack.push(stackElement);
            }
            break;
        }
    }
    return true;
}


module.exports = {
    rangeStartState,
    rangeEndState
};
