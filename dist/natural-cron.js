(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.getCronString = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
'use strict';
//regexString json
var regexString = {
    every : {
        "regextest" : "^(every|each|all|entire)$"
    },
    clockTime : {
        //https://regexr.com/3qqbn
        "regextest" : "^([0-9]+:)?[0-9]+ *(AM|PM)$|^([0-9]+:[0-9]+)$|(noon|midnight)",
        //https://regexr.com/3qqbt
        "regexexec" : [
            "^[0-9]+",
            ":[0-9]+",
            "pm",
            "am",
            "(noon|midnight)"
        ]
    },
    frequencyWith : {
        "regextest" : "^[0-9]+(th|nd|rd|st)$"
    },
    frequencyOnly : {
        "regextest" : "^[0-9]+$",
        "regexexec" : "^[0-9]+"
    },
    minute : {
        "regextest" : "(minutes|minute|mins|min)",
        "regexexec" : [
            "^(minutes|minute|mins|min)$"
        ]
    },
    hour : {
        "regextest" : "(hour|hrs|hours)",
        "regexexec" : [
            "^(hour|hrs|hours)$"
        ]
    },
    day : {
        //https://regexr.com/3qqc3
        "regextest" : "^((days|day)|(((monday|tuesday|wednesday|thursday|friday|saturday|sunday|WEEKEND|MON|TUE|WED|THU|FRI|SAT|SUN)( ?and)?,? ?)+))$",
        "regexexec" : [
            "^(day|days)$",
            "(MON|TUE|WED|THU|FRI|SAT|SUN|WEEKEND)"
        ]
    },
    month : {
        //https://regexr.com/3r1na
        "regextest" : "^((months|month)|(((january|february|march|april|may|june|july|august|september|october|november|december|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEPT|OCT|NOV|DEC)( ?and)?,? ?)+))$",
        "regexexec" : [
            "^(month|months)$",
            "(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEPT|OCT|NOV|DEC)"
        ]
    },
    year : {
        "regextest" : "((years|year)|([0-9]{4}[0-9]*(( ?and)?,? ?))+)",
        "regexexec" : [
            "^(years|year)$",
            "[0-9]*",
            "^[0-9]{4}$"
        ]
    },
    rangeStart : {
        "regextest" : "(between|starting|start)" ,
    },
    rangeEnd : {
        "regextest" : "(to|through|ending|end|and)" ,
    },
    tokenising : {
        "regexexec" : "(hour|hrs|hours)|(minutes|minute|mins|min)|((months|month)|(((january|february|march|april|may|june|july|august|september|october|november|december|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEPT|OCT|NOV|DEC)( ?and)?,? ?)+))|[0-9]+(th|nd|rd|st)|(([0-9]+:)?[0-9]+( +)?(AM|PM))|([0-9]+:[0-9]+)|(noon|midnight)|((days|day)|(((monday|tuesday|wednesday|thursday|friday|saturday|sunday|WEEKEND|MON|TUE|WED|THU|FRI|SAT|SUN)( ?and)?,? ?)+))|(([0-9]{4}[0-9]*(( ?and)?,? ?))+)|([0-9]+)|(to|through|ending|end|and)|(between|starting|start)"
    }
}

var defaultFlags = {
    "isRangeForDay" : false,
    "isRangeForMonth" : false,
    "isRangeForYear" : false,
    "isRangeForHour" : false,
    "isRangeForMin" : false
};

var defaultResultCron = {
    "min" : "*",
    "hour" : "*",
    "day_of_month" : "*",
    "month" : "*",
    "day_of_week" : "?",
    "year" : "*"
};

var flags = {
    "isRangeForDay" : defaultFlags.isRangeForDay,
    "isRangeForMonth" : defaultFlags.isRangeForMonth,
    "isRangeForYear" : defaultFlags.isRangeForYear,
    "isRangeForHour" : defaultFlags.isRangeForHour,
    "isRangeForMin" : defaultFlags.isRangeForMin
};

var resultCron = {
    "min" : defaultResultCron.min,
    "hour" : defaultResultCron.hour,
    "day_of_month" : defaultResultCron.day_of_month,
    "month" : defaultResultCron.month,
    "day_of_week" : defaultResultCron.day_of_week,
    "year" : defaultResultCron.year
};


module.exports = {
    regexString,
    defaultFlags,
    defaultResultCron,
    flags,
    resultCron
}

},{}],3:[function(require,module,exports){
'use strict';
const regexString = require('./maps').regexString;
var defaultFlags = require('./maps').defaultFlags;
var defaultResultCron = require('./maps').defaultResultCron;
var flags = require('./maps').flags;
var resultCron = require('./maps').resultCron;

var readline = require('readline');
const tokenizeInput  = require('./tokens').tokenizeInput;
const getClockTime  = require('./states/clocktime').getClockTime;
const getDay  = require('./states/day').getDay;
const getFrequencyOnly  = require('./states/frequency').getFrequencyOnly;
const getFrequencyWith  = require('./states/frequency').getFrequencyWith;
const getHour  = require('./states/hour').getHour;
const getMonth  = require('./states/month').getMonth;
const getMinute  = require('./states/minute').getMinute;
const rangeStartState  = require('./states/range').rangeStartState;
const rangeEndState  = require('./states/range').rangeEndState;
const getYear  = require('./states/year').getYear;

/*callState function to match and call curresponding state function*/
function callState(token,stack,error) {
    let stateName = decideState(token);

    switch(stateName) {
        case "frequencyWith" : {
            return getFrequencyWith(token,stack,error);
        }
        break;
        case "frequencyOnly" : {
            return getFrequencyOnly(token,stack,error);
        }
        break;
        case "clockTime" : {
            return getClockTime(token,stack,error);
        }
        break;
        case "day" : {
            return getDay(token,stack,error);
        }
        break;
        case "minute" : {
            return getMinute(token,stack,error);
        }
        break;
        case "hour" : {
            return getHour(token,stack,error);
        }
        break;
        case "month" : {
            return getMonth(token,stack,error);
        }
        break;
        case "year" : {
            return getYear(token,stack,error);
        }
        break;
        case "rangeStart" : {
            return rangeStartState(token,stack,error);
        }
        break;
        case "rangeEnd" : {
            return rangeEndState(token,stack,error);
        }
        break;
    }
    return true;
}

/*decideState function to decide next state*/
function decideState(token) {
    let isFound = "decideState";
    for(let key in regexString) {
        // TO DO: check for group
        let regBuilder = new RegExp(regexString[key].regextest,'ig');
        if(regBuilder.test(token)) {
            isFound = key;
            break;
        }
    }
    return isFound;
}

/*getCronString fucntion to convert human readable input string to cron string*/
module.exports = function getCronString(inputString, syntaxString) {
    //Set default syntax string
    syntaxString = typeof(syntaxString) !== 'undefined' ? syntaxString : "MIN HOR DOM MON WEK YER";

    //resetting map values to default
    flags.isRangeForDay = defaultFlags.isRangeForDay;
    flags.isRangeForMonth = defaultFlags.isRangeForMonth;
    flags.isRangeForYear = defaultFlags.isRangeForYear;
    flags.isRangeForHour = defaultFlags.isRangeForHour;
    flags.isRangeForMin = defaultFlags.isRangeForMin;

    resultCron.min = defaultResultCron.min;
    resultCron.hour = defaultResultCron.hour;
    resultCron.day_of_month = defaultResultCron.day_of_month;
    resultCron.month = defaultResultCron.month;
    resultCron.day_of_week = defaultResultCron.day_of_week;
    resultCron.year = defaultResultCron.year;

    //Stack to store temperory states' data
    let stack = [];
    let error = "";
    let tokens = tokenizeInput(inputString);

    if(tokens == null) {
        error+="Please enter human readable rules !\n";
    }
    let notEndState = true;
    for(let i=0; notEndState && i<tokens.length;i++) {
        notEndState = callState(tokens[i],stack,error);
    }
    if(notEndState == false) {
        return "ERROR:"+error + "\t\t" + syntaxString.replace("MIN",resultCron.min).replace("HOR",resultCron.hour).replace("DOM",resultCron.day_of_month).replace("MON",resultCron.month).replace("WEK",resultCron.day_of_week).replace("YER",resultCron.year);
    }
    else {
        return syntaxString.replace("MIN",resultCron.min).replace("HOR",resultCron.hour).replace("DOM",resultCron.day_of_month).replace("MON",resultCron.month).replace("WEK",resultCron.day_of_week).replace("YER",resultCron.year);
    }
}

},{"./maps":2,"./states/clocktime":4,"./states/day":5,"./states/frequency":6,"./states/hour":7,"./states/minute":8,"./states/month":9,"./states/range":10,"./states/year":11,"./tokens":12,"readline":1}],4:[function(require,module,exports){
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

},{"../maps":2}],5:[function(require,module,exports){
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

},{"../maps":2}],6:[function(require,module,exports){
'use strict';

const regexString = require('../maps').regexString;
var flags = require('../maps').flags;
var resultCron = require('../maps').resultCron;


/*frequencyOnly function to parse and store frequency value without nth*/
function getFrequencyOnly(token,stack,error) {
    let freq = parseInt(token);
    if(isNaN(token)) {
        error +=" token is not number in frequency only !";
        return false;
    }
    if(stack.length > 0 && stack[stack.length - 1].ownerState=="rangeEnd") {
        let topElement = stack[stack.length - 1];
        stack.pop();
        topElement.frequency.end = freq;
        stack.push(topElement);
        return true;
    }
    else if(stack.length > 0 && stack[stack.length - 1].ownerState=="rangeStart") {
        let topElement = stack[stack.length - 1];
        stack.pop();
        topElement.frequency.start = freq;
        stack.push(topElement);
        return true;
    }
    let stackElement = {
        "ownerState" : "frequencyOnly",
        "frequency" : freq
    };
    stack.push(stackElement);
    return true;
}

/*frequencyWith function to parse and store frequency value with nth*/
function getFrequencyWith(token,stack,error) {
    // TO DO: check for group
    let regBuilder = new RegExp(regexString.frequencyOnly.regexexec,"ig");
    let freq = regBuilder.exec(token);
    let value = parseInt(freq);
    if(isNaN(value)) {
        error +=" token is not number in frequency with !";
        return false;
    }
    if(stack.length!=0 && stack[stack.length - 1].ownerState=="rangeEnd") {
        let topElement = stack[stack.length - 1];
        stack.pop();
        topElement.frequency.end = ""+value;
        stack.push(topElement);
        return true;
    }
    else if(stack.length > 0 && stack[stack.length - 1].ownerState=="rangeStart") {
        let topElement = stack[stack.length - 1];
        stack.pop();
        topElement.frequency.start = ""+value;
        stack.push(topElement);
        return true;
    }
    let stackElement = {
        "ownerState" : "frequencyWith",
        "frequency" : value
    };
    stack.push(stackElement);
    return true;
}


module.exports = {
    getFrequencyOnly,
    getFrequencyWith
};

},{"../maps":2}],7:[function(require,module,exports){
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

},{"../maps":2}],8:[function(require,module,exports){
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

},{"../maps":2}],9:[function(require,module,exports){
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

},{"../maps":2}],10:[function(require,module,exports){
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

},{"../maps":2}],11:[function(require,module,exports){
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

},{"../maps":2}],12:[function(require,module,exports){
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

},{"./maps":2}]},{},[3])(3)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2hvbWUvcmF0aGlyb2hpdC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuMTEuNS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2hvbWUvcmF0aGlyb2hpdC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuMTEuNS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm1hcHMuanMiLCJyZWFkYWJsZVRvQ3Jvbi5qcyIsInN0YXRlcy9jbG9ja3RpbWUuanMiLCJzdGF0ZXMvZGF5LmpzIiwic3RhdGVzL2ZyZXF1ZW5jeS5qcyIsInN0YXRlcy9ob3VyLmpzIiwic3RhdGVzL21pbnV0ZS5qcyIsInN0YXRlcy9tb250aC5qcyIsInN0YXRlcy9yYW5nZS5qcyIsInN0YXRlcy95ZWFyLmpzIiwidG9rZW5zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiIsIid1c2Ugc3RyaWN0Jztcbi8vcmVnZXhTdHJpbmcganNvblxudmFyIHJlZ2V4U3RyaW5nID0ge1xuICAgIGV2ZXJ5IDoge1xuICAgICAgICBcInJlZ2V4dGVzdFwiIDogXCJeKGV2ZXJ5fGVhY2h8YWxsfGVudGlyZSkkXCJcbiAgICB9LFxuICAgIGNsb2NrVGltZSA6IHtcbiAgICAgICAgLy9odHRwczovL3JlZ2V4ci5jb20vM3FxYm5cbiAgICAgICAgXCJyZWdleHRlc3RcIiA6IFwiXihbMC05XSs6KT9bMC05XSsgKihBTXxQTSkkfF4oWzAtOV0rOlswLTldKykkfChub29ufG1pZG5pZ2h0KVwiLFxuICAgICAgICAvL2h0dHBzOi8vcmVnZXhyLmNvbS8zcXFidFxuICAgICAgICBcInJlZ2V4ZXhlY1wiIDogW1xuICAgICAgICAgICAgXCJeWzAtOV0rXCIsXG4gICAgICAgICAgICBcIjpbMC05XStcIixcbiAgICAgICAgICAgIFwicG1cIixcbiAgICAgICAgICAgIFwiYW1cIixcbiAgICAgICAgICAgIFwiKG5vb258bWlkbmlnaHQpXCJcbiAgICAgICAgXVxuICAgIH0sXG4gICAgZnJlcXVlbmN5V2l0aCA6IHtcbiAgICAgICAgXCJyZWdleHRlc3RcIiA6IFwiXlswLTldKyh0aHxuZHxyZHxzdCkkXCJcbiAgICB9LFxuICAgIGZyZXF1ZW5jeU9ubHkgOiB7XG4gICAgICAgIFwicmVnZXh0ZXN0XCIgOiBcIl5bMC05XSskXCIsXG4gICAgICAgIFwicmVnZXhleGVjXCIgOiBcIl5bMC05XStcIlxuICAgIH0sXG4gICAgbWludXRlIDoge1xuICAgICAgICBcInJlZ2V4dGVzdFwiIDogXCIobWludXRlc3xtaW51dGV8bWluc3xtaW4pXCIsXG4gICAgICAgIFwicmVnZXhleGVjXCIgOiBbXG4gICAgICAgICAgICBcIl4obWludXRlc3xtaW51dGV8bWluc3xtaW4pJFwiXG4gICAgICAgIF1cbiAgICB9LFxuICAgIGhvdXIgOiB7XG4gICAgICAgIFwicmVnZXh0ZXN0XCIgOiBcIihob3VyfGhyc3xob3VycylcIixcbiAgICAgICAgXCJyZWdleGV4ZWNcIiA6IFtcbiAgICAgICAgICAgIFwiXihob3VyfGhyc3xob3VycykkXCJcbiAgICAgICAgXVxuICAgIH0sXG4gICAgZGF5IDoge1xuICAgICAgICAvL2h0dHBzOi8vcmVnZXhyLmNvbS8zcXFjM1xuICAgICAgICBcInJlZ2V4dGVzdFwiIDogXCJeKChkYXlzfGRheSl8KCgobW9uZGF5fHR1ZXNkYXl8d2VkbmVzZGF5fHRodXJzZGF5fGZyaWRheXxzYXR1cmRheXxzdW5kYXl8V0VFS0VORHxNT058VFVFfFdFRHxUSFV8RlJJfFNBVHxTVU4pKCA/YW5kKT8sPyA/KSspKSRcIixcbiAgICAgICAgXCJyZWdleGV4ZWNcIiA6IFtcbiAgICAgICAgICAgIFwiXihkYXl8ZGF5cykkXCIsXG4gICAgICAgICAgICBcIihNT058VFVFfFdFRHxUSFV8RlJJfFNBVHxTVU58V0VFS0VORClcIlxuICAgICAgICBdXG4gICAgfSxcbiAgICBtb250aCA6IHtcbiAgICAgICAgLy9odHRwczovL3JlZ2V4ci5jb20vM3IxbmFcbiAgICAgICAgXCJyZWdleHRlc3RcIiA6IFwiXigobW9udGhzfG1vbnRoKXwoKChqYW51YXJ5fGZlYnJ1YXJ5fG1hcmNofGFwcmlsfG1heXxqdW5lfGp1bHl8YXVndXN0fHNlcHRlbWJlcnxvY3RvYmVyfG5vdmVtYmVyfGRlY2VtYmVyfEpBTnxGRUJ8TUFSfEFQUnxNQVl8SlVOfEpVTHxBVUd8U0VQVHxPQ1R8Tk9WfERFQykoID9hbmQpPyw/ID8pKykpJFwiLFxuICAgICAgICBcInJlZ2V4ZXhlY1wiIDogW1xuICAgICAgICAgICAgXCJeKG1vbnRofG1vbnRocykkXCIsXG4gICAgICAgICAgICBcIihKQU58RkVCfE1BUnxBUFJ8TUFZfEpVTnxKVUx8QVVHfFNFUFR8T0NUfE5PVnxERUMpXCJcbiAgICAgICAgXVxuICAgIH0sXG4gICAgeWVhciA6IHtcbiAgICAgICAgXCJyZWdleHRlc3RcIiA6IFwiKCh5ZWFyc3x5ZWFyKXwoWzAtOV17NH1bMC05XSooKCA/YW5kKT8sPyA/KSkrKVwiLFxuICAgICAgICBcInJlZ2V4ZXhlY1wiIDogW1xuICAgICAgICAgICAgXCJeKHllYXJzfHllYXIpJFwiLFxuICAgICAgICAgICAgXCJbMC05XSpcIixcbiAgICAgICAgICAgIFwiXlswLTldezR9JFwiXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHJhbmdlU3RhcnQgOiB7XG4gICAgICAgIFwicmVnZXh0ZXN0XCIgOiBcIihiZXR3ZWVufHN0YXJ0aW5nfHN0YXJ0KVwiICxcbiAgICB9LFxuICAgIHJhbmdlRW5kIDoge1xuICAgICAgICBcInJlZ2V4dGVzdFwiIDogXCIodG98dGhyb3VnaHxlbmRpbmd8ZW5kfGFuZClcIiAsXG4gICAgfSxcbiAgICB0b2tlbmlzaW5nIDoge1xuICAgICAgICBcInJlZ2V4ZXhlY1wiIDogXCIoaG91cnxocnN8aG91cnMpfChtaW51dGVzfG1pbnV0ZXxtaW5zfG1pbil8KChtb250aHN8bW9udGgpfCgoKGphbnVhcnl8ZmVicnVhcnl8bWFyY2h8YXByaWx8bWF5fGp1bmV8anVseXxhdWd1c3R8c2VwdGVtYmVyfG9jdG9iZXJ8bm92ZW1iZXJ8ZGVjZW1iZXJ8SkFOfEZFQnxNQVJ8QVBSfE1BWXxKVU58SlVMfEFVR3xTRVBUfE9DVHxOT1Z8REVDKSggP2FuZCk/LD8gPykrKSl8WzAtOV0rKHRofG5kfHJkfHN0KXwoKFswLTldKzopP1swLTldKyggKyk/KEFNfFBNKSl8KFswLTldKzpbMC05XSspfChub29ufG1pZG5pZ2h0KXwoKGRheXN8ZGF5KXwoKChtb25kYXl8dHVlc2RheXx3ZWRuZXNkYXl8dGh1cnNkYXl8ZnJpZGF5fHNhdHVyZGF5fHN1bmRheXxXRUVLRU5EfE1PTnxUVUV8V0VEfFRIVXxGUkl8U0FUfFNVTikoID9hbmQpPyw/ID8pKykpfCgoWzAtOV17NH1bMC05XSooKCA/YW5kKT8sPyA/KSkrKXwoWzAtOV0rKXwodG98dGhyb3VnaHxlbmRpbmd8ZW5kfGFuZCl8KGJldHdlZW58c3RhcnRpbmd8c3RhcnQpXCJcbiAgICB9XG59XG5cbnZhciBkZWZhdWx0RmxhZ3MgPSB7XG4gICAgXCJpc1JhbmdlRm9yRGF5XCIgOiBmYWxzZSxcbiAgICBcImlzUmFuZ2VGb3JNb250aFwiIDogZmFsc2UsXG4gICAgXCJpc1JhbmdlRm9yWWVhclwiIDogZmFsc2UsXG4gICAgXCJpc1JhbmdlRm9ySG91clwiIDogZmFsc2UsXG4gICAgXCJpc1JhbmdlRm9yTWluXCIgOiBmYWxzZVxufTtcblxudmFyIGRlZmF1bHRSZXN1bHRDcm9uID0ge1xuICAgIFwibWluXCIgOiBcIipcIixcbiAgICBcImhvdXJcIiA6IFwiKlwiLFxuICAgIFwiZGF5X29mX21vbnRoXCIgOiBcIipcIixcbiAgICBcIm1vbnRoXCIgOiBcIipcIixcbiAgICBcImRheV9vZl93ZWVrXCIgOiBcIj9cIixcbiAgICBcInllYXJcIiA6IFwiKlwiXG59O1xuXG52YXIgZmxhZ3MgPSB7XG4gICAgXCJpc1JhbmdlRm9yRGF5XCIgOiBkZWZhdWx0RmxhZ3MuaXNSYW5nZUZvckRheSxcbiAgICBcImlzUmFuZ2VGb3JNb250aFwiIDogZGVmYXVsdEZsYWdzLmlzUmFuZ2VGb3JNb250aCxcbiAgICBcImlzUmFuZ2VGb3JZZWFyXCIgOiBkZWZhdWx0RmxhZ3MuaXNSYW5nZUZvclllYXIsXG4gICAgXCJpc1JhbmdlRm9ySG91clwiIDogZGVmYXVsdEZsYWdzLmlzUmFuZ2VGb3JIb3VyLFxuICAgIFwiaXNSYW5nZUZvck1pblwiIDogZGVmYXVsdEZsYWdzLmlzUmFuZ2VGb3JNaW5cbn07XG5cbnZhciByZXN1bHRDcm9uID0ge1xuICAgIFwibWluXCIgOiBkZWZhdWx0UmVzdWx0Q3Jvbi5taW4sXG4gICAgXCJob3VyXCIgOiBkZWZhdWx0UmVzdWx0Q3Jvbi5ob3VyLFxuICAgIFwiZGF5X29mX21vbnRoXCIgOiBkZWZhdWx0UmVzdWx0Q3Jvbi5kYXlfb2ZfbW9udGgsXG4gICAgXCJtb250aFwiIDogZGVmYXVsdFJlc3VsdENyb24ubW9udGgsXG4gICAgXCJkYXlfb2Zfd2Vla1wiIDogZGVmYXVsdFJlc3VsdENyb24uZGF5X29mX3dlZWssXG4gICAgXCJ5ZWFyXCIgOiBkZWZhdWx0UmVzdWx0Q3Jvbi55ZWFyXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlZ2V4U3RyaW5nLFxuICAgIGRlZmF1bHRGbGFncyxcbiAgICBkZWZhdWx0UmVzdWx0Q3JvbixcbiAgICBmbGFncyxcbiAgICByZXN1bHRDcm9uXG59XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCByZWdleFN0cmluZyA9IHJlcXVpcmUoJy4vbWFwcycpLnJlZ2V4U3RyaW5nO1xudmFyIGRlZmF1bHRGbGFncyA9IHJlcXVpcmUoJy4vbWFwcycpLmRlZmF1bHRGbGFncztcbnZhciBkZWZhdWx0UmVzdWx0Q3JvbiA9IHJlcXVpcmUoJy4vbWFwcycpLmRlZmF1bHRSZXN1bHRDcm9uO1xudmFyIGZsYWdzID0gcmVxdWlyZSgnLi9tYXBzJykuZmxhZ3M7XG52YXIgcmVzdWx0Q3JvbiA9IHJlcXVpcmUoJy4vbWFwcycpLnJlc3VsdENyb247XG5cbnZhciByZWFkbGluZSA9IHJlcXVpcmUoJ3JlYWRsaW5lJyk7XG5jb25zdCB0b2tlbml6ZUlucHV0ICA9IHJlcXVpcmUoJy4vdG9rZW5zJykudG9rZW5pemVJbnB1dDtcbmNvbnN0IGdldENsb2NrVGltZSAgPSByZXF1aXJlKCcuL3N0YXRlcy9jbG9ja3RpbWUnKS5nZXRDbG9ja1RpbWU7XG5jb25zdCBnZXREYXkgID0gcmVxdWlyZSgnLi9zdGF0ZXMvZGF5JykuZ2V0RGF5O1xuY29uc3QgZ2V0RnJlcXVlbmN5T25seSAgPSByZXF1aXJlKCcuL3N0YXRlcy9mcmVxdWVuY3knKS5nZXRGcmVxdWVuY3lPbmx5O1xuY29uc3QgZ2V0RnJlcXVlbmN5V2l0aCAgPSByZXF1aXJlKCcuL3N0YXRlcy9mcmVxdWVuY3knKS5nZXRGcmVxdWVuY3lXaXRoO1xuY29uc3QgZ2V0SG91ciAgPSByZXF1aXJlKCcuL3N0YXRlcy9ob3VyJykuZ2V0SG91cjtcbmNvbnN0IGdldE1vbnRoICA9IHJlcXVpcmUoJy4vc3RhdGVzL21vbnRoJykuZ2V0TW9udGg7XG5jb25zdCBnZXRNaW51dGUgID0gcmVxdWlyZSgnLi9zdGF0ZXMvbWludXRlJykuZ2V0TWludXRlO1xuY29uc3QgcmFuZ2VTdGFydFN0YXRlICA9IHJlcXVpcmUoJy4vc3RhdGVzL3JhbmdlJykucmFuZ2VTdGFydFN0YXRlO1xuY29uc3QgcmFuZ2VFbmRTdGF0ZSAgPSByZXF1aXJlKCcuL3N0YXRlcy9yYW5nZScpLnJhbmdlRW5kU3RhdGU7XG5jb25zdCBnZXRZZWFyICA9IHJlcXVpcmUoJy4vc3RhdGVzL3llYXInKS5nZXRZZWFyO1xuXG4vKmNhbGxTdGF0ZSBmdW5jdGlvbiB0byBtYXRjaCBhbmQgY2FsbCBjdXJyZXNwb25kaW5nIHN0YXRlIGZ1bmN0aW9uKi9cbmZ1bmN0aW9uIGNhbGxTdGF0ZSh0b2tlbixzdGFjayxlcnJvcikge1xuICAgIGxldCBzdGF0ZU5hbWUgPSBkZWNpZGVTdGF0ZSh0b2tlbik7XG5cbiAgICBzd2l0Y2goc3RhdGVOYW1lKSB7XG4gICAgICAgIGNhc2UgXCJmcmVxdWVuY3lXaXRoXCIgOiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RnJlcXVlbmN5V2l0aCh0b2tlbixzdGFjayxlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmcmVxdWVuY3lPbmx5XCIgOiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RnJlcXVlbmN5T25seSh0b2tlbixzdGFjayxlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjbG9ja1RpbWVcIiA6IHtcbiAgICAgICAgICAgIHJldHVybiBnZXRDbG9ja1RpbWUodG9rZW4sc3RhY2ssZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGF5XCIgOiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0RGF5KHRva2VuLHN0YWNrLGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1pbnV0ZVwiIDoge1xuICAgICAgICAgICAgcmV0dXJuIGdldE1pbnV0ZSh0b2tlbixzdGFjayxlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJob3VyXCIgOiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0SG91cih0b2tlbixzdGFjayxlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtb250aFwiIDoge1xuICAgICAgICAgICAgcmV0dXJuIGdldE1vbnRoKHRva2VuLHN0YWNrLGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInllYXJcIiA6IHtcbiAgICAgICAgICAgIHJldHVybiBnZXRZZWFyKHRva2VuLHN0YWNrLGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJhbmdlU3RhcnRcIiA6IHtcbiAgICAgICAgICAgIHJldHVybiByYW5nZVN0YXJ0U3RhdGUodG9rZW4sc3RhY2ssZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmFuZ2VFbmRcIiA6IHtcbiAgICAgICAgICAgIHJldHVybiByYW5nZUVuZFN0YXRlKHRva2VuLHN0YWNrLGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8qZGVjaWRlU3RhdGUgZnVuY3Rpb24gdG8gZGVjaWRlIG5leHQgc3RhdGUqL1xuZnVuY3Rpb24gZGVjaWRlU3RhdGUodG9rZW4pIHtcbiAgICBsZXQgaXNGb3VuZCA9IFwiZGVjaWRlU3RhdGVcIjtcbiAgICBmb3IobGV0IGtleSBpbiByZWdleFN0cmluZykge1xuICAgICAgICAvLyBUTyBETzogY2hlY2sgZm9yIGdyb3VwXG4gICAgICAgIGxldCByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZ1trZXldLnJlZ2V4dGVzdCwnaWcnKTtcbiAgICAgICAgaWYocmVnQnVpbGRlci50ZXN0KHRva2VuKSkge1xuICAgICAgICAgICAgaXNGb3VuZCA9IGtleTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpc0ZvdW5kO1xufVxuXG4vKmdldENyb25TdHJpbmcgZnVjbnRpb24gdG8gY29udmVydCBodW1hbiByZWFkYWJsZSBpbnB1dCBzdHJpbmcgdG8gY3JvbiBzdHJpbmcqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRDcm9uU3RyaW5nKGlucHV0U3RyaW5nLCBzeW50YXhTdHJpbmcpIHtcbiAgICAvL1NldCBkZWZhdWx0IHN5bnRheCBzdHJpbmdcbiAgICBzeW50YXhTdHJpbmcgPSB0eXBlb2Yoc3ludGF4U3RyaW5nKSAhPT0gJ3VuZGVmaW5lZCcgPyBzeW50YXhTdHJpbmcgOiBcIk1JTiBIT1IgRE9NIE1PTiBXRUsgWUVSXCI7XG5cbiAgICAvL3Jlc2V0dGluZyBtYXAgdmFsdWVzIHRvIGRlZmF1bHRcbiAgICBmbGFncy5pc1JhbmdlRm9yRGF5ID0gZGVmYXVsdEZsYWdzLmlzUmFuZ2VGb3JEYXk7XG4gICAgZmxhZ3MuaXNSYW5nZUZvck1vbnRoID0gZGVmYXVsdEZsYWdzLmlzUmFuZ2VGb3JNb250aDtcbiAgICBmbGFncy5pc1JhbmdlRm9yWWVhciA9IGRlZmF1bHRGbGFncy5pc1JhbmdlRm9yWWVhcjtcbiAgICBmbGFncy5pc1JhbmdlRm9ySG91ciA9IGRlZmF1bHRGbGFncy5pc1JhbmdlRm9ySG91cjtcbiAgICBmbGFncy5pc1JhbmdlRm9yTWluID0gZGVmYXVsdEZsYWdzLmlzUmFuZ2VGb3JNaW47XG5cbiAgICByZXN1bHRDcm9uLm1pbiA9IGRlZmF1bHRSZXN1bHRDcm9uLm1pbjtcbiAgICByZXN1bHRDcm9uLmhvdXIgPSBkZWZhdWx0UmVzdWx0Q3Jvbi5ob3VyO1xuICAgIHJlc3VsdENyb24uZGF5X29mX21vbnRoID0gZGVmYXVsdFJlc3VsdENyb24uZGF5X29mX21vbnRoO1xuICAgIHJlc3VsdENyb24ubW9udGggPSBkZWZhdWx0UmVzdWx0Q3Jvbi5tb250aDtcbiAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrID0gZGVmYXVsdFJlc3VsdENyb24uZGF5X29mX3dlZWs7XG4gICAgcmVzdWx0Q3Jvbi55ZWFyID0gZGVmYXVsdFJlc3VsdENyb24ueWVhcjtcblxuICAgIC8vU3RhY2sgdG8gc3RvcmUgdGVtcGVyb3J5IHN0YXRlcycgZGF0YVxuICAgIGxldCBzdGFjayA9IFtdO1xuICAgIGxldCBlcnJvciA9IFwiXCI7XG4gICAgbGV0IHRva2VucyA9IHRva2VuaXplSW5wdXQoaW5wdXRTdHJpbmcpO1xuXG4gICAgaWYodG9rZW5zID09IG51bGwpIHtcbiAgICAgICAgZXJyb3IrPVwiUGxlYXNlIGVudGVyIGh1bWFuIHJlYWRhYmxlIHJ1bGVzICFcXG5cIjtcbiAgICB9XG4gICAgbGV0IG5vdEVuZFN0YXRlID0gdHJ1ZTtcbiAgICBmb3IobGV0IGk9MDsgbm90RW5kU3RhdGUgJiYgaTx0b2tlbnMubGVuZ3RoO2krKykge1xuICAgICAgICBub3RFbmRTdGF0ZSA9IGNhbGxTdGF0ZSh0b2tlbnNbaV0sc3RhY2ssZXJyb3IpO1xuICAgIH1cbiAgICBpZihub3RFbmRTdGF0ZSA9PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gXCJFUlJPUjpcIitlcnJvciArIFwiXFx0XFx0XCIgKyBzeW50YXhTdHJpbmcucmVwbGFjZShcIk1JTlwiLHJlc3VsdENyb24ubWluKS5yZXBsYWNlKFwiSE9SXCIscmVzdWx0Q3Jvbi5ob3VyKS5yZXBsYWNlKFwiRE9NXCIscmVzdWx0Q3Jvbi5kYXlfb2ZfbW9udGgpLnJlcGxhY2UoXCJNT05cIixyZXN1bHRDcm9uLm1vbnRoKS5yZXBsYWNlKFwiV0VLXCIscmVzdWx0Q3Jvbi5kYXlfb2Zfd2VlaykucmVwbGFjZShcIllFUlwiLHJlc3VsdENyb24ueWVhcik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gc3ludGF4U3RyaW5nLnJlcGxhY2UoXCJNSU5cIixyZXN1bHRDcm9uLm1pbikucmVwbGFjZShcIkhPUlwiLHJlc3VsdENyb24uaG91cikucmVwbGFjZShcIkRPTVwiLHJlc3VsdENyb24uZGF5X29mX21vbnRoKS5yZXBsYWNlKFwiTU9OXCIscmVzdWx0Q3Jvbi5tb250aCkucmVwbGFjZShcIldFS1wiLHJlc3VsdENyb24uZGF5X29mX3dlZWspLnJlcGxhY2UoXCJZRVJcIixyZXN1bHRDcm9uLnllYXIpO1xuICAgIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVnZXhTdHJpbmcgPSByZXF1aXJlKCcuLi9tYXBzJykucmVnZXhTdHJpbmc7XG52YXIgZmxhZ3MgPSByZXF1aXJlKCcuLi9tYXBzJykuZmxhZ3M7XG52YXIgcmVzdWx0Q3JvbiA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZXN1bHRDcm9uO1xuXG4vKmNsb2NrVGltZSBmdW5jdGlvbiB0byBwYXJzZSBhbmQgc3RvcmUgZnJlcXVlbmN5IHZhbHVlIHdpdGhvdXQgbnRoKi9cbmZ1bmN0aW9uIGdldENsb2NrVGltZSh0b2tlbixzdGFjayxlcnJvcikge1xuICAgIC8vcmV0cml2ZSBob3VycyBmcm9tIGNsb2NrdGltZVxuICAgIGxldCByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZy5jbG9ja1RpbWUucmVnZXhleGVjWzBdKTtcbiAgICBsZXQgc3RyID0gdG9rZW4ubWF0Y2gocmVnQnVpbGRlcik7XG5cbiAgICBsZXQgaG91cixtaW47XG4gICAgaWYoc3RyICE9IG51bGwgJiYgc3RyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaG91ciA9IHBhcnNlSW50KHN0clswXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaG91ciA9IDA7XG4gICAgfVxuXG4gICAgLy9yZXRyaXZlIG1pbnV0ZXMgZnJvbSBjbG9ja1RpbWVcbiAgICByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZy5jbG9ja1RpbWUucmVnZXhleGVjWzFdKTtcbiAgICBzdHIgPSByZWdCdWlsZGVyLmV4ZWModG9rZW4pO1xuICAgIGlmKHN0ciAhPSBudWxsICYmIHN0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmKHN0clswXS5pbmRleE9mKCc6JykhPS0xKSB7XG4gICAgICAgICAgICBtaW4gPSBwYXJzZUludChzdHJbMF0uc2xpY2Uoc3RyWzBdLmluZGV4T2YoJzonKSsxKSk7XG4gICAgICAgICAgICBpZihtaW4gPj0gNjApIHtcbiAgICAgICAgICAgICAgICBlcnJvciArPVwiIHBsZWFzZSBlbnRlciBjb3JyZWN0IG1pbnV0ZXMgIVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1pbiA9IDA7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBtaW4gPSAwO1xuICAgIH1cblxuICAgIC8vY2hlY2sgZm9yIGluY3JlbWVudCBvZiBob3VyIGJ5IDEyIGZvciBQTVxuICAgIGxldCByZWdCdWlsZGVyUE0gPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nLmNsb2NrVGltZS5yZWdleGV4ZWNbMl0sJ2lnJyk7XG4gICAgbGV0IHJlZ0J1aWxkZXJBTSA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcuY2xvY2tUaW1lLnJlZ2V4ZXhlY1szXSwnaWcnKTtcbiAgICBpZihyZWdCdWlsZGVyUE0udGVzdCh0b2tlbikpIHtcbiAgICAgICAgaWYoaG91ciA8IDEyKSB7XG4gICAgICAgICAgICBob3VyKz0xMjtcbiAgICAgICAgfSBlbHNlIGlmKGhvdXIgPiAxMiApe1xuICAgICAgICAgICAgZXJyb3IgKz1cIiBwbGVhc2UgY29ycmVjdCB0aGUgdGltZSBiZWZvcmUgUE0gIVwiO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmKHJlZ0J1aWxkZXJBTS50ZXN0KHRva2VuKSl7XG4gICAgICAgIGlmKGhvdXIgPT0gMTIpIHtcbiAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICB9IGVsc2UgaWYoaG91ciA+IDEyICl7XG4gICAgICAgICAgICBlcnJvciArPVwiIHBsZWFzZSBjb3JyZWN0IHRoZSB0aW1lIGJlZm9yZSBBTSAhXCI7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZy5jbG9ja1RpbWUucmVnZXhleGVjWzRdLCdpZycpO1xuICAgIGlmKHJlZ0J1aWxkZXIudGVzdCh0b2tlbikpIHtcbiAgICAgICAgc3RyID0gdG9rZW4ubWF0Y2gocmVnQnVpbGRlcik7XG4gICAgICAgIGlmKHN0ciA9PSBcIm5vb25cIikge1xuICAgICAgICAgICAgaG91ciA9IDEyO1xuICAgICAgICAgICAgbWluID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgbWluID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPIERPOiBjaGVja2VkPT5UZXN0PT0/XG4gICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG4gICAgaWYodG9wRWxlbWVudCAhPSBudWxsKSB7XG4gICAgICAgIC8vQ2hlY2sgaWYgYWxyZWFkeSBhIHJhbmdlIGlzIGRlZmluZWRcbiAgICAgICAgaWYoZmxhZ3MuaXNSYW5nZUZvckhvdXIgPT0gdHJ1ZSB8fCBmbGFncy5pc1JhbmdlRm9yTWluID09IHRydWUpIHtcbiAgICAgICAgICAgIGVycm9yICs9XCIgYWxyZWFkeSBzZXQgZm9yIHJhbmdlIGV4cHJlc3Npb25zLCBzZXBlcmF0ZSBpbnRvIHR3byBjcm9ucyFcIjtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRvcEVsZW1lbnQub3duZXJTdGF0ZSA9PSBcInJhbmdlU3RhcnRcIikge1xuICAgICAgICAgICAgdG9wRWxlbWVudC5ob3VyLnN0YXJ0ID0gaG91cjtcbiAgICAgICAgICAgIHRvcEVsZW1lbnQubWluLnN0YXJ0ID0gbWluO1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHRvcEVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZUVuZFwiKSB7XG4gICAgICAgICAgICBpZih0b3BFbGVtZW50LmhvdXIgPT0gaG91cikge1xuICAgICAgICAgICAgICAgIHRvcEVsZW1lbnQubWluLmVuZCA9IG1pbjtcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1pbiA9IHRvcEVsZW1lbnQubWluLnN0YXJ0ICsgXCItXCIrdG9wRWxlbWVudC5taW4uZW5kO1xuICAgICAgICAgICAgICAgIC8vZmxhZ3MuaXNSYW5nZUZvckhvdXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b3BFbGVtZW50LmhvdXIuZW5kID0gaG91cjtcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmhvdXIgPSB0b3BFbGVtZW50LmhvdXIuc3RhcnQgKyBcIi1cIit0b3BFbGVtZW50LmhvdXIuZW5kO1xuICAgICAgICAgICAgICAgIC8vZmxhZ3MuaXNSYW5nZUZvck1pbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHN0YWNrRWxlbWVudCA9IHtcbiAgICAgICAgXCJvd25lclN0YXRlXCIgOiBcImNsb2NrVGltZVwiLFxuICAgICAgICBcImhvdXJcIiA6IGhvdXIsXG4gICAgICAgIFwibWluXCIgOiBtaW5cbiAgICB9O1xuICAgIHJlc3VsdENyb24ubWluID0gbWluO1xuICAgIGlmKHJlc3VsdENyb24uaG91ciAhPSBcIipcIiAmJiByZXN1bHRDcm9uLmhvdXIgIT0gXCJcIilcbiAgICAgICAgcmVzdWx0Q3Jvbi5ob3VyICs9IFwiLFwiK2hvdXI7XG4gICAgZWxzZVxuICAgICAgICByZXN1bHRDcm9uLmhvdXIgPSBob3VyO1xuICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0Q2xvY2tUaW1lXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZWdleFN0cmluZyA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZWdleFN0cmluZztcbnZhciBmbGFncyA9IHJlcXVpcmUoJy4uL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi4vbWFwcycpLnJlc3VsdENyb247XG5cbi8qZ2V0RGF5IGZ1bmN0aW9uIHRvIHBhcnNlIGRheXMqL1xuZnVuY3Rpb24gZ2V0RGF5KHRva2VuLHN0YWNrLGVycm9yKSB7XG4gICAgLy8gVE8gRE86IGNoZWNrIGZvciBncm91cFxuICAgIGxldCByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZy5kYXkucmVnZXhleGVjWzBdLFwiaWdcIik7XG4gICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAvLyBjaGVjayBmb3Igd29yZCBkYXksZGF5c1xuICAgIGlmKHJlZ0J1aWxkZXIudGVzdCh0b2tlbikpIHtcbiAgICAgICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG4gICAgICAgIHJlc3VsdENyb24uZGF5X29mX3dlZWsgPSBcIj9cIjtcbiAgICAgICAgaWYodG9wRWxlbWVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0b3BFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgICdmcmVxdWVuY3knIDogXCIqXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJmcmVxdWVuY3lPbmx5XCIpIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX21vbnRoID0gXCIwL1wiK3RvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJmcmVxdWVuY3lXaXRoXCIpIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX21vbnRoID0gXCJcIit0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0Q3Jvbi5kYXlfb2ZfbW9udGggPSBcIipcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjaGVjayBmb3IgdmFsdWVzIG9mIGRheXMgYmV0d2VlbiBbTU9OLVNVTl1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVnQnVpbGRlciA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcuZGF5LnJlZ2V4ZXhlY1sxXSxcImlnXCIpO1xuICAgICAgICBsZXQgbWF0Y2hlcyA9IHRva2VuLm1hdGNoKHJlZ0J1aWxkZXIpO1xuICAgICAgICBpZihtYXRjaGVzIT1udWxsICYmIG1hdGNoZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX3dlZWsgPSBcIlwiO1xuICAgICAgICAgICAgZm9yKGxldCBpPTA7IGk8bWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1hdGNoZXNbaV0gPSBtYXRjaGVzW2ldLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUTyBETzogY2hlY2tcbiAgICAgICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5sZW5ndGggPT0gMSAmJiB0b3BFbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIGFscmVhZHkgYSByYW5nZSBpcyBkZWZpbmVkXG4gICAgICAgICAgICAgICAgaWYoZmxhZ3MuaXNSYW5nZUZvckRheSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yICs9XCIgYWxyZWFkeSBzZXQgZm9yIHJhbmdlIGV4cHJlc3Npb25zLCBzZXBlcmF0ZSBpbnRvIHR3byBjcm9ucyFcIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wRWxlbWVudC5kYXkuc3RhcnQgPSBtYXRjaGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRvcEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwicmFuZ2VFbmRcIikge1xuICAgICAgICAgICAgICAgICAgICB0b3BFbGVtZW50LmRheS5lbmQgPSBtYXRjaGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrID0gdG9wRWxlbWVudC5kYXkuc3RhcnQgKyBcIi1cIit0b3BFbGVtZW50LmRheS5lbmQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX21vbnRoID0gXCI/XCI7XG4gICAgICAgICAgICAgICAgICAgIC8vZmxhZ3MuaXNSYW5nZUZvckRheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ01PTicpICYmICFyZXN1bHRDcm9uLmRheV9vZl93ZWVrLmluY2x1ZGVzKCdNT04nKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrICs9IFwiTU9OLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnVFVFJykgJiYgIXJlc3VsdENyb24uZGF5X29mX3dlZWsuaW5jbHVkZXMoJ1RVRScpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX3dlZWsgKz0gXCJUVUUsXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdXRUQnKSAmJiAhcmVzdWx0Q3Jvbi5kYXlfb2Zfd2Vlay5pbmNsdWRlcygnV0VEJykpXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5kYXlfb2Zfd2VlayArPSBcIldFRCxcIjtcbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ1RIVScpICYmICFyZXN1bHRDcm9uLmRheV9vZl93ZWVrLmluY2x1ZGVzKCdUSFUnKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrICs9IFwiVEhVLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnRlJJJykgJiYgIXJlc3VsdENyb24uZGF5X29mX3dlZWsuaW5jbHVkZXMoJ0ZSSScpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX3dlZWsgKz0gXCJGUkksXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdTQVQnKSAmJiAhcmVzdWx0Q3Jvbi5kYXlfb2Zfd2Vlay5pbmNsdWRlcygnU0FUJykpXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5kYXlfb2Zfd2VlayArPSBcIlNBVCxcIjtcbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ1NVTicpICYmICFyZXN1bHRDcm9uLmRheV9vZl93ZWVrLmluY2x1ZGVzKCdTVU4nKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrICs9IFwiU1VOLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnV0VFS0VORCcpICYmICFyZXN1bHRDcm9uLmRheV9vZl93ZWVrLmluY2x1ZGVzKCdTQVQnKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrICs9IFwiU0FULFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnV0VFS0VORCcpICYmICFyZXN1bHRDcm9uLmRheV9vZl93ZWVrLmluY2x1ZGVzKCdTVU4nKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrICs9IFwiU1VOLFwiO1xuICAgICAgICAgICAgLy8gcmVtb3ZlZCBleHRyYSBjb21tYVxuICAgICAgICAgICAgcmVzdWx0Q3Jvbi5kYXlfb2Zfd2VlayA9IHJlc3VsdENyb24uZGF5X29mX3dlZWsuc2xpY2UoMCwtMSk7XG4gICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl9tb250aCA9IFwiP1wiO1xuICAgICAgICAgICAgdmFsdWUgPSBcIlwiK3Jlc3VsdENyb24uZGF5X29mX3dlZWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUTyBETzogcHJvdmlkZSBpbiBmdXR1cmUuIGJ1dCBmb3IgTk9XICBlcnJvclxuICAgICAgICAgICAgZXJyb3IgKz1cIiBJbiB1bnJlc29sdmVkIHN0YXRlIGF0IDI7RGF5ICFcIjtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgc3RhY2tFbGVtZW50ID0ge1xuICAgICAgICBcIm93bmVyU3RhdGVcIiA6IFwiZGF5XCIsXG4gICAgICAgIFwiZGF5X29mX3dlZWtcIiA6IHJlc3VsdENyb24uZGF5X29mX3dlZWssXG4gICAgICAgIFwiZGF5X29mX21vbnRoXCIgOiByZXN1bHRDcm9uLmRheV9vZl9tb250aFxuICAgIH07XG4gICAgc3RhY2sucHVzaChzdGFja0VsZW1lbnQpO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXREYXlcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHJlZ2V4U3RyaW5nID0gcmVxdWlyZSgnLi4vbWFwcycpLnJlZ2V4U3RyaW5nO1xudmFyIGZsYWdzID0gcmVxdWlyZSgnLi4vbWFwcycpLmZsYWdzO1xudmFyIHJlc3VsdENyb24gPSByZXF1aXJlKCcuLi9tYXBzJykucmVzdWx0Q3JvbjtcblxuXG4vKmZyZXF1ZW5jeU9ubHkgZnVuY3Rpb24gdG8gcGFyc2UgYW5kIHN0b3JlIGZyZXF1ZW5jeSB2YWx1ZSB3aXRob3V0IG50aCovXG5mdW5jdGlvbiBnZXRGcmVxdWVuY3lPbmx5KHRva2VuLHN0YWNrLGVycm9yKSB7XG4gICAgbGV0IGZyZXEgPSBwYXJzZUludCh0b2tlbik7XG4gICAgaWYoaXNOYU4odG9rZW4pKSB7XG4gICAgICAgIGVycm9yICs9XCIgdG9rZW4gaXMgbm90IG51bWJlciBpbiBmcmVxdWVuY3kgb25seSAhXCI7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYoc3RhY2subGVuZ3RoID4gMCAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5vd25lclN0YXRlPT1cInJhbmdlRW5kXCIpIHtcbiAgICAgICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHRvcEVsZW1lbnQuZnJlcXVlbmN5LmVuZCA9IGZyZXE7XG4gICAgICAgIHN0YWNrLnB1c2godG9wRWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmKHN0YWNrLmxlbmd0aCA+IDAgJiYgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0ub3duZXJTdGF0ZT09XCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0ID0gZnJlcTtcbiAgICAgICAgc3RhY2sucHVzaCh0b3BFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJmcmVxdWVuY3lPbmx5XCIsXG4gICAgICAgIFwiZnJlcXVlbmN5XCIgOiBmcmVxXG4gICAgfTtcbiAgICBzdGFjay5wdXNoKHN0YWNrRWxlbWVudCk7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8qZnJlcXVlbmN5V2l0aCBmdW5jdGlvbiB0byBwYXJzZSBhbmQgc3RvcmUgZnJlcXVlbmN5IHZhbHVlIHdpdGggbnRoKi9cbmZ1bmN0aW9uIGdldEZyZXF1ZW5jeVdpdGgodG9rZW4sc3RhY2ssZXJyb3IpIHtcbiAgICAvLyBUTyBETzogY2hlY2sgZm9yIGdyb3VwXG4gICAgbGV0IHJlZ0J1aWxkZXIgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nLmZyZXF1ZW5jeU9ubHkucmVnZXhleGVjLFwiaWdcIik7XG4gICAgbGV0IGZyZXEgPSByZWdCdWlsZGVyLmV4ZWModG9rZW4pO1xuICAgIGxldCB2YWx1ZSA9IHBhcnNlSW50KGZyZXEpO1xuICAgIGlmKGlzTmFOKHZhbHVlKSkge1xuICAgICAgICBlcnJvciArPVwiIHRva2VuIGlzIG5vdCBudW1iZXIgaW4gZnJlcXVlbmN5IHdpdGggIVwiO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKHN0YWNrLmxlbmd0aCE9MCAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5vd25lclN0YXRlPT1cInJhbmdlRW5kXCIpIHtcbiAgICAgICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHRvcEVsZW1lbnQuZnJlcXVlbmN5LmVuZCA9IFwiXCIrdmFsdWU7XG4gICAgICAgIHN0YWNrLnB1c2godG9wRWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmKHN0YWNrLmxlbmd0aCA+IDAgJiYgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0ub3duZXJTdGF0ZT09XCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0ID0gXCJcIit2YWx1ZTtcbiAgICAgICAgc3RhY2sucHVzaCh0b3BFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJmcmVxdWVuY3lXaXRoXCIsXG4gICAgICAgIFwiZnJlcXVlbmN5XCIgOiB2YWx1ZVxuICAgIH07XG4gICAgc3RhY2sucHVzaChzdGFja0VsZW1lbnQpO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldEZyZXF1ZW5jeU9ubHksXG4gICAgZ2V0RnJlcXVlbmN5V2l0aFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVnZXhTdHJpbmcgPSByZXF1aXJlKCcuLi9tYXBzJykucmVnZXhTdHJpbmc7XG52YXIgZmxhZ3MgPSByZXF1aXJlKCcuLi9tYXBzJykuZmxhZ3M7XG52YXIgcmVzdWx0Q3JvbiA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZXN1bHRDcm9uO1xuXG4vKmdldEhvdXIgZnVuY3Rpb24gdG8gcGFyc2UgSG91cnMqL1xuZnVuY3Rpb24gZ2V0SG91cih0b2tlbixzdGFjayxlcnJvcikge1xuICAgIC8vIFRPIERPOiBjaGVjayBmb3IgZ3JvdXBcbiAgICBsZXQgcmVnQnVpbGRlciA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcuaG91ci5yZWdleGV4ZWNbMF0sXCJpZ1wiKTtcbiAgICBsZXQgdmFsdWU7XG4gICAgLy8gY2hlY2sgZm9yIHdvcmQgaG91cnNcbiAgICBpZihyZWdCdWlsZGVyLnRlc3QodG9rZW4pKSB7XG4gICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICBpZih0b3BFbGVtZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIHRvcEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgJ2ZyZXF1ZW5jeScgOiBcIipcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmKHRvcEVsZW1lbnQub3duZXJTdGF0ZSA9PSBcImZyZXF1ZW5jeU9ubHlcIikge1xuICAgICAgICAgICAgdmFsdWUgPSB0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHJlc3VsdENyb24uaG91ciA9IFwiMC9cIit0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICB9IGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwiZnJlcXVlbmN5V2l0aFwiKSB7XG4gICAgICAgICAgICAvL2hvdXIgYWxyZWFkeSBzZXRcbiAgICAgICAgICAgIGlmKHJlc3VsdENyb24uaG91ciAhPSBcIipcIiAmJiByZXN1bHRDcm9uLmhvdXIgIT0gXCJcIilcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmhvdXIgKz0gXCIsXCIrdG9wRWxlbWVudC5mcmVxdWVuY3k7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5ob3VyID0gXCJcIit0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0Q3Jvbi5ob3VyO1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihmbGFncy5pc1JhbmdlRm9ySG91ciA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgKz1cIiBhbHJlYWR5IHNldCBmb3IgcmFuZ2UgZXhwcmVzc2lvbnMsIHNlcGVyYXRlIGludG8gdHdvIGNyb25zIVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwicmFuZ2VTdGFydFwiKSB7XG4gICAgICAgICAgICAgICAgdG9wRWxlbWVudC5ob3VyLnN0YXJ0ID0gdG9wRWxlbWVudC5mcmVxdWVuY3kuc3RhcnQ7XG4gICAgICAgICAgICAgICAgdG9wRWxlbWVudC5mcmVxdWVuY3kuc3RhcnQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9wRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwicmFuZ2VFbmRcIikge1xuICAgICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHRvcEVsZW1lbnQuaG91ci5zdGFydCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0O1xuICAgICAgICAgICAgICAgIHRvcEVsZW1lbnQuaG91ci5lbmQgPSB0b3BFbGVtZW50LmZyZXF1ZW5jeS5lbmQ7XG4gICAgICAgICAgICAgICAgdG9wRWxlbWVudC5mcmVxdWVuY3kuZW5kID0gXCJcIjtcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmhvdXIgPSB0b3BFbGVtZW50LmhvdXIuc3RhcnQgKyBcIi1cIit0b3BFbGVtZW50LmhvdXIuZW5kO1xuICAgICAgICAgICAgICAgIC8vZmxhZ3MuaXNSYW5nZUZvckhvdXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJob3VyXCIsXG4gICAgICAgIFwiaG91clwiIDogdmFsdWVcbiAgICB9O1xuICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRIb3VyXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZWdleFN0cmluZyA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZWdleFN0cmluZztcbnZhciBmbGFncyA9IHJlcXVpcmUoJy4uL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi4vbWFwcycpLnJlc3VsdENyb247XG5cbi8qZ2V0TWludXRlIGZ1bmN0aW9uIHRvIHBhcnNlIG1pbnV0ZXMqL1xuZnVuY3Rpb24gZ2V0TWludXRlKHRva2VuLHN0YWNrLGVycm9yKSB7XG4gICAgLy8gVE8gRE86IGNoZWNrIGZvciBncm91cFxuICAgIGxldCByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZy5taW51dGUucmVnZXhleGVjWzBdLFwiaWdcIik7XG4gICAgbGV0IHZhbHVlO1xuICAgIC8vIGNoZWNrIGZvciB3b3JkIG1pbnV0ZSxtaW51dGVzXG4gICAgaWYocmVnQnVpbGRlci50ZXN0KHRva2VuKSkge1xuICAgICAgICBsZXQgdG9wRWxlbWVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXTtcbiAgICAgICAgaWYodG9wRWxlbWVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0b3BFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgICdmcmVxdWVuY3knIDogXCIqXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJmcmVxdWVuY3lPbmx5XCIpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdG9wRWxlbWVudC5mcmVxdWVuY3k7XG4gICAgICAgICAgICByZXN1bHRDcm9uLm1pbiA9IFwiMC9cIit0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICB9IGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwiZnJlcXVlbmN5V2l0aFwiKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgcmVzdWx0Q3Jvbi5taW4gPSBcIlwiK3RvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihmbGFncy5pc1JhbmdlRm9yTWludXRlID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBlcnJvciArPVwiIGFscmVhZHkgc2V0IGZvciByYW5nZSBleHByZXNzaW9ucywgc2VwZXJhdGUgaW50byB0d28gY3JvbnMhXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICB0b3BFbGVtZW50Lm1pbi5zdGFydCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0O1xuICAgICAgICAgICAgICAgIHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRvcEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHRvcEVsZW1lbnQub3duZXJTdGF0ZSA9PSBcInJhbmdlRW5kXCIpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICB0b3BFbGVtZW50Lm1pbi5zdGFydCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0O1xuICAgICAgICAgICAgICAgIHRvcEVsZW1lbnQubWluLmVuZCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5LmVuZDtcbiAgICAgICAgICAgICAgICB0b3BFbGVtZW50LmZyZXF1ZW5jeS5lbmQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHJlc3VsdENyb24ubWluID0gdG9wRWxlbWVudC5taW4uc3RhcnQgKyBcIi1cIit0b3BFbGVtZW50Lm1pbi5lbmQ7XG4gICAgICAgICAgICAgICAgLy9mbGFncy5pc1JhbmdlRm9yTWluID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgc3RhY2tFbGVtZW50ID0ge1xuICAgICAgICBcIm93bmVyU3RhdGVcIiA6IFwibWludXRlXCIsXG4gICAgICAgIFwibWluXCIgOiB2YWx1ZVxuICAgIH07XG4gICAgc3RhY2sucHVzaChzdGFja0VsZW1lbnQpO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldE1pbnV0ZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVnZXhTdHJpbmcgPSByZXF1aXJlKCcuLi9tYXBzJykucmVnZXhTdHJpbmc7XG52YXIgZmxhZ3MgPSByZXF1aXJlKCcuLi9tYXBzJykuZmxhZ3M7XG52YXIgcmVzdWx0Q3JvbiA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZXN1bHRDcm9uO1xuXG4vKmdldE1vbnRoIGZ1bmN0aW9uIHRvIHBhcnNlIG1vbnRocyovXG5mdW5jdGlvbiBnZXRNb250aCh0b2tlbixzdGFjayxlcnJvcikge1xuICAgIC8vIFRPIERPOiBjaGVjayBmb3IgZ3JvdXBcbiAgICBsZXQgcmVnQnVpbGRlciA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcubW9udGgucmVnZXhleGVjWzBdLFwiaWdcIik7XG4gICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAvLyBjaGVjayBmb3Igd29yZCBtb250aCxtb250aHNcbiAgICBpZihyZWdCdWlsZGVyLnRlc3QodG9rZW4pKSB7XG4gICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICBpZih0b3BFbGVtZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIHRvcEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgJ2ZyZXF1ZW5jeScgOiBcIipcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJmcmVxdWVuY3lPbmx5XCIpIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggPSBcIjAvXCIrdG9wRWxlbWVudC5mcmVxdWVuY3k7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgfSBlbHNlIGlmKHRvcEVsZW1lbnQub3duZXJTdGF0ZSA9PSBcImZyZXF1ZW5jeVdpdGhcIikge1xuICAgICAgICAgICAgcmVzdWx0Q3Jvbi5tb250aCA9IFwiXCIrdG9wRWxlbWVudC5mcmVxdWVuY3k7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggPSBcIipcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjaGVjayBmb3IgdmFsdWVzIG9mIG1vbnRocyBiZXR3ZWVuIFtKQU4tREVDXVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBUTyBETzogY2hlY2sgZm9yIGdyb3VwXG4gICAgICAgIHJlZ0J1aWxkZXIgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nLm1vbnRoLnJlZ2V4ZXhlY1sxXSxcImlnXCIpO1xuICAgICAgICBsZXQgbWF0Y2hlcyA9IHRva2VuLm1hdGNoKHJlZ0J1aWxkZXIpO1xuICAgICAgICBpZihtYXRjaGVzIT1udWxsICYmIG1hdGNoZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggPSBcIlwiO1xuICAgICAgICAgICAgZm9yKGxldCBpPTA7IGk8bWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1hdGNoZXNbaV0gPSBtYXRjaGVzW2ldLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUTyBETzogY2hlY2tcbiAgICAgICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuXG4gICAgICAgICAgICBpZihtYXRjaGVzLmxlbmd0aCA9PSAxICYmIHRvcEVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgYWxyZWFkeSBhIHJhbmdlIGlzIGRlZmluZWRcbiAgICAgICAgICAgICAgICBpZihmbGFncy5pc1JhbmdlRm9yTW9udGggPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciArPVwiIGFscmVhZHkgc2V0IGZvciByYW5nZSBleHByZXNzaW9ucywgc2VwZXJhdGUgaW50byB0d28gY3JvbnMhXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwiZnJlcXVlbmN5T25seVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX21vbnRoID0gdG9wRWxlbWVudC5mcmVxdWVuY3k7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHRvcEVsZW1lbnQub3duZXJTdGF0ZSA9PSBcImZyZXF1ZW5jeVdpdGhcIikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl9tb250aCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wRWxlbWVudC5tb250aC5zdGFydCA9IG1hdGNoZXNbMF07XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9wRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZUVuZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRvcEVsZW1lbnQuZnJlcXVlbmN5LmVuZCAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrID0gXCI/XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl9tb250aCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0ICsgXCItXCIgKyB0b3BFbGVtZW50LmZyZXF1ZW5jeS5lbmQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdG9wRWxlbWVudC5tb250aC5lbmQgPSBtYXRjaGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoID0gdG9wRWxlbWVudC5tb250aC5zdGFydCArIFwiLVwiK3RvcEVsZW1lbnQubW9udGguZW5kO1xuICAgICAgICAgICAgICAgICAgICAvL2ZsYWdzLmlzUmFuZ2VGb3JNb250aCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ0pBTicpICYmICFyZXN1bHRDcm9uLm1vbnRoLmluY2x1ZGVzKCdKQU4nKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoICs9IFwiSkFOLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnRkVCJykgJiYgIXJlc3VsdENyb24ubW9udGguaW5jbHVkZXMoJ0ZFQicpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggKz0gXCJGRUIsXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdNQVInKSAmJiAhcmVzdWx0Q3Jvbi5tb250aC5pbmNsdWRlcygnTUFSJykpXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5tb250aCArPSBcIk1BUixcIjtcbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ0FQUicpICYmICFyZXN1bHRDcm9uLm1vbnRoLmluY2x1ZGVzKCdBUFInKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoICs9IFwiQVBSLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnTUFZJykgJiYgIXJlc3VsdENyb24ubW9udGguaW5jbHVkZXMoJ01BWScpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggKz0gXCJNQVksXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdKVU4nKSAmJiAhcmVzdWx0Q3Jvbi5tb250aC5pbmNsdWRlcygnSlVOJykpXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5tb250aCArPSBcIkpVTixcIjtcbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ0pVTCcpICYmICFyZXN1bHRDcm9uLm1vbnRoLmluY2x1ZGVzKCdKVUwnKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoICs9IFwiSlVMLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnQVVHJykgJiYgIXJlc3VsdENyb24ubW9udGguaW5jbHVkZXMoJ0FVRycpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggKz0gXCJBVUcsXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdTRVBUJykgJiYgIXJlc3VsdENyb24ubW9udGguaW5jbHVkZXMoJ1NFUFQnKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoICs9IFwiU0VQVCxcIjtcbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ09DVCcpICYmICFyZXN1bHRDcm9uLm1vbnRoLmluY2x1ZGVzKCdPQ1QnKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoICs9IFwiT0NULFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnTk9WJykgJiYgIXJlc3VsdENyb24ubW9udGguaW5jbHVkZXMoJ05PVicpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggKz0gXCJOT1YsXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdERUMnKSAmJiAhcmVzdWx0Q3Jvbi5tb250aC5pbmNsdWRlcygnREVDJykpXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5tb250aCArPSBcIkRFQyxcIjtcbiAgICAgICAgICAgIC8vIHJlbW92ZWQgZXh0cmEgY29tbWFcbiAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggPSByZXN1bHRDcm9uLm1vbnRoLnNsaWNlKDAsLTEpO1xuICAgICAgICAgICAgdmFsdWUgPSBcIlwiK3Jlc3VsdENyb24ubW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUTyBETzogcHJvdmlkZSBpbiBmdXR1cmUuIGJ1dCBmb3IgTk9XICBlcnJvclxuICAgICAgICAgICAgZXJyb3IgKz1cIiBJbiB1bnJlc29sdmVkIHN0YXRlIGF0IDI7TW9udGggIVwiO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJtb250aFwiLFxuICAgICAgICBcIm1vbnRoXCIgOiByZXN1bHRDcm9uLm1vbnRoLFxuICAgIH07XG4gICAgc3RhY2sucHVzaChzdGFja0VsZW1lbnQpO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldE1vbnRoXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZWdleFN0cmluZyA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZWdleFN0cmluZztcbnZhciBmbGFncyA9IHJlcXVpcmUoJy4uL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi4vbWFwcycpLnJlc3VsdENyb247XG5cblxuLypyYW5nZVN0YXJ0U3RhdGUgZnVuY3Rpb24gZm9yIHJhbmdlIGlucHV0Ki9cbmZ1bmN0aW9uIHJhbmdlU3RhcnRTdGF0ZSh0b2tlbixzdGFjayxlcnJvcikge1xuICAgIGlmKGZsYWdzLmlzUmFuZ2VGb3JEYXkgfHwgZmxhZ3MuaXNSYW5nZUZvck1pbiB8fCBmbGFncy5pc1JhbmdlRm9yTW9udGggfHwgZmxhZ3MuaXNSYW5nZUZvclllYXIgfHwgZmxhZ3MuaXNSYW5nZUZvckhvdXIpIHtcbiAgICAgICAgZXJyb3IgKz1cIiBhbHJlYWR5IHJhbmdlIGV4cHJlc3Npb25zICFcIjtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgc3RhY2tFbGVtZW50ID0ge1xuICAgICAgICBcIm93bmVyU3RhdGVcIiA6IFwicmFuZ2VTdGFydFwiLFxuICAgICAgICBcIm1pblwiOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJob3VyXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXlcIiA6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIiA6IFwiXCIsXG4gICAgICAgICAgICBcImVuZFwiIDogXCJcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1vbnRoXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJ5ZWFyXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmcmVxdWVuY3lcIiA6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIiA6IFwiXCIsXG4gICAgICAgICAgICBcImVuZFwiIDogXCJcIlxuICAgICAgICB9XG4gICAgfTtcbiAgICBzdGFjay5wdXNoKHN0YWNrRWxlbWVudCk7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8qcmFuZ2VFbmRTdGF0ZSBmdW5jdGlvbiBmb3IgcmFuZ2UgaW5wdXQqL1xuZnVuY3Rpb24gcmFuZ2VFbmRTdGF0ZSh0b2tlbixzdGFjayxlcnJvcikge1xuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJyYW5nZUVuZFwiLFxuICAgICAgICBcIm1pblwiOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJob3VyXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXlcIiA6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIiA6IFwiXCIsXG4gICAgICAgICAgICBcImVuZFwiIDogXCJcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1vbnRoXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJ5ZWFyXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmcmVxdWVuY3lcIiA6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIiA6IFwiXCIsXG4gICAgICAgICAgICBcImVuZFwiIDogXCJcIlxuICAgICAgICB9XG4gICAgfTtcbiAgICBsZXQgdG9wRWxlbWVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXTtcbiAgICBpZih0b3BFbGVtZW50IT1udWxsKSB7XG4gICAgICAgIHN3aXRjaCh0b3BFbGVtZW50Lm93bmVyU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJmcmVxdWVuY3lXaXRoXCIgOlxuICAgICAgICAgICAgY2FzZSBcImZyZXF1ZW5jeU9ubHlcIiA6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgc3RhY2tFbGVtZW50LmZyZXF1ZW5jeS5zdGFydCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgICAgIHN0YWNrRWxlbWVudC5vd25lclN0YXRlID0gXCJyYW5nZUVuZFwiO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY2xvY2tUaW1lXCIgOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHN0YWNrRWxlbWVudC5ob3VyLnN0YXJ0ID0gdG9wRWxlbWVudC5ob3VyO1xuICAgICAgICAgICAgICAgIHN0YWNrRWxlbWVudC5taW4uc3RhcnQgPSB0b3BFbGVtZW50Lm1pbjtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQub3duZXJTdGF0ZSA9IFwicmFuZ2VFbmRcIjtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN0YWNrRWxlbWVudClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInJhbmdlU3RhcnRcIiA6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgdG9wRWxlbWVudC5vd25lclN0YXRlID0gXCJyYW5nZUVuZFwiO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9wRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtb250aFwiIDpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQub3duZXJTdGF0ZSA9IFwicmFuZ2VFbmRcIjtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQubW9udGguc3RhcnQgPSB0b3BFbGVtZW50Lm1vbnRoO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1pbnV0ZVwiIDpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQub3duZXJTdGF0ZSA9IFwicmFuZ2VFbmRcIjtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0ID0gc3RhY2tFbGVtZW50Lm1pbi5zdGFydCA9IHRvcEVsZW1lbnQubWluO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImhvdXJcIiA6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgc3RhY2tFbGVtZW50Lm93bmVyU3RhdGUgPSBcInJhbmdlRW5kXCI7XG4gICAgICAgICAgICAgICAgc3RhY2tFbGVtZW50LmZyZXF1ZW5jeS5zdGFydCA9IHN0YWNrRWxlbWVudC5ob3VyLnN0YXJ0ID0gdG9wRWxlbWVudC5ob3VyO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImRheVwiIDpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQub3duZXJTdGF0ZSA9IFwicmFuZ2VFbmRcIjtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQuZGF5LnN0YXJ0ID0gdG9wRWxlbWVudC5kYXlfb2Zfd2VlaztcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN0YWNrRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ5ZWFyXCIgOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHN0YWNrRWxlbWVudC5vd25lclN0YXRlID0gXCJyYW5nZUVuZFwiO1xuICAgICAgICAgICAgICAgIHN0YWNrRWxlbWVudC55ZWFyLnN0YXJ0ID0gdG9wRWxlbWVudC55ZWFyO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJhbmdlU3RhcnRTdGF0ZSxcbiAgICByYW5nZUVuZFN0YXRlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZWdleFN0cmluZyA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZWdleFN0cmluZztcbnZhciBmbGFncyA9IHJlcXVpcmUoJy4uL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi4vbWFwcycpLnJlc3VsdENyb247XG5cblxuLypnZXRZZWFyIGZ1bmN0aW9uIHRvIHBhcnNlIHllYXIqL1xuZnVuY3Rpb24gZ2V0WWVhcih0b2tlbixzdGFjayxlcnJvcikge1xuICAgIC8vIFRPIERPOiBjaGVjayBmb3IgZ3JvdXBcbiAgICBsZXQgcmVnQnVpbGRlciA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcueWVhci5yZWdleGV4ZWNbMF0sXCJpZ1wiKTtcbiAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgIC8vIGNoZWNrIGZvciB3b3JkIHllYXIseWVhcnNcbiAgICBpZihyZWdCdWlsZGVyLnRlc3QodG9rZW4pKSB7XG4gICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICByZXN1bHRDcm9uLnllYXIgPSBcIj9cIjtcbiAgICAgICAgaWYodG9wRWxlbWVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0b3BFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgICdmcmVxdWVuY3knIDogXCIqXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJmcmVxdWVuY3lPbmx5XCIpIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24ueWVhciA9IFwiMC9cIit0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICB9IGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwiZnJlcXVlbmN5V2l0aFwiKSB7XG4gICAgICAgICAgICByZXN1bHRDcm9uLnllYXIgPSBcIlwiK3RvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRDcm9uLnllYXIgPSBcIipcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjaGVjayBmb3IgdmFsdWVzIG9mIHllYXJzXG4gICAgZWxzZSB7XG4gICAgICAgIHJlZ0J1aWxkZXIgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nLnllYXIucmVnZXhleGVjWzFdLFwiaWdcIik7XG4gICAgICAgIGxldCByZWdCdWlsZGVyMiA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcueWVhci5yZWdleGV4ZWNbMl0sXCJpZ1wiKVxuICAgICAgICBsZXQgbWF0Y2hlcyA9IHRva2VuLm1hdGNoKHJlZ0J1aWxkZXIpO1xuICAgICAgICBsZXQgZXhhY3RNYXRjaGVzID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IobGV0IGk9MDsgaTxtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZihyZWdCdWlsZGVyMi50ZXN0KG1hdGNoZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgZXhhY3RNYXRjaGVzLmFkZChtYXRjaGVzW2ldLm1hdGNoKHJlZ0J1aWxkZXIyKVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE8gRE86IGNoZWNrXG4gICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICBpZihleGFjdE1hdGNoZXMuc2l6ZSA9PSAxICYmIHRvcEVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgLy9DaGVjayBpZiBhbHJlYWR5IGEgcmFuZ2UgaXMgZGVmaW5lZFxuICAgICAgICAgICAgaWYoZmxhZ3MuaXNSYW5nZUZvclllYXIgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGVycm9yICs9XCIgQ2Fubm90IGhhbmRsZSBtdWx0aXBsZSByYW5nZSBleHByZXNzaW9ucywgc2VwZXJhdGUgaW50byB0d28gY3JvbnMhXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICB0b3BFbGVtZW50LnllYXIuc3RhcnQgPSBBcnJheS5mcm9tKGV4YWN0TWF0Y2hlcylbMF07XG4gICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh0b3BFbGVtZW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZUVuZFwiKSB7XG4gICAgICAgICAgICAgICAgdG9wRWxlbWVudC55ZWFyLmVuZCA9IEFycmF5LmZyb20oZXhhY3RNYXRjaGVzKVswXTtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLnllYXIgPSB0b3BFbGVtZW50LnllYXIuc3RhcnQgKyBcIi1cIit0b3BFbGVtZW50LnllYXIuZW5kO1xuICAgICAgICAgICAgICAgIC8vZmxhZ3MuaXNSYW5nZUZvclllYXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKGV4YWN0TWF0Y2hlcy5zaXplICE9IDApIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24ueWVhciA9IFwiXCI7XG4gICAgICAgICAgICBleGFjdE1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbih5cil7XG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi55ZWFyICs9IHlyK1wiLFwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyByZW1vdmVkIGV4dHJhIGNvbW1hXG4gICAgICAgICAgICByZXN1bHRDcm9uLnllYXIgPSByZXN1bHRDcm9uLnllYXIuc2xpY2UoMCwtMSk7XG4gICAgICAgICAgICB2YWx1ZSA9IFwiXCIrcmVzdWx0Q3Jvbi55ZWFyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVE8gRE86IHByb3ZpZGUgaW4gZnV0dXJlLiBidXQgZm9yIE5PVyAgZXJyb3JcbiAgICAgICAgICAgIGVycm9yICs9XCIgSW4gdW5yZXNvbHZlZCBzdGF0ZSBhdCAyO3llYXIgIVwiO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJ5ZWFyXCIsXG4gICAgICAgIFwieWVhclwiIDogcmVzdWx0Q3Jvbi55ZWFyXG4gICAgfTtcbiAgICBzdGFjay5wdXNoKHN0YWNrRWxlbWVudCk7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldFllYXJcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHJlZ2V4U3RyaW5nID0gcmVxdWlyZSgnLi9tYXBzJykucmVnZXhTdHJpbmc7XG52YXIgZmxhZ3MgPSByZXF1aXJlKCcuL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi9tYXBzJykucmVzdWx0Q3Jvbjtcbi8vdG9rZW5pemVJbnB1dCBmdW5jdGlvbiB0byBzZXBlcmF0ZSBvdXQgYWxsIHRva2Vuc1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB0b2tlbml6ZUlucHV0IDogZnVuY3Rpb24oaW5wdXRTdHJpbmcpe1xuICAgICAgICBsZXQgcmVnQnVpbGRlciA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcudG9rZW5pc2luZy5yZWdleGV4ZWMsXCJpZ1wiKTtcbiAgICAgICAgbGV0IG1hdGNoZXMgPSBpbnB1dFN0cmluZy5tYXRjaChyZWdCdWlsZGVyKTtcbiAgICAgICAgaWYobWF0Y2hlcyA9PSBudWxsIHx8IG1hdGNoZXMubGVuZ3RoID09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBpPTA7aTxtYXRjaGVzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgIG1hdGNoZXNbaV0gPSAobWF0Y2hlc1tpXStcIlwiKS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgfVxufTtcbiJdfQ==
