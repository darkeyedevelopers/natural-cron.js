(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.getCronString = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
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

},{"./maps":3,"./states/clocktime":4,"./states/day":5,"./states/frequency":6,"./states/hour":7,"./states/minute":8,"./states/month":9,"./states/range":10,"./states/year":11,"./tokens":12,"readline":1}],3:[function(require,module,exports){
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
    year : {
        "regextest" : "((years|year)|([0-9]{4}[0-9]*(( ?and)?,? ?))+)",
        "regexexec" : [
            "^(years|year)$",
            "[0-9]*",
            "^[0-9]{4}$"
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

},{}],4:[function(require,module,exports){
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

},{"../maps":3}],5:[function(require,module,exports){
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

},{"../maps":3}],6:[function(require,module,exports){
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

},{"../maps":3}],7:[function(require,module,exports){
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

},{"../maps":3}],8:[function(require,module,exports){
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

},{"../maps":3}],9:[function(require,module,exports){
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

},{"../maps":3}],10:[function(require,module,exports){
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

},{"../maps":3}],11:[function(require,module,exports){
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

},{"../maps":3}],12:[function(require,module,exports){
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

},{"./maps":3}]},{},[2])(2)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2hvbWUvcmF0aGlyb2hpdC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuMTEuNS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2hvbWUvcmF0aGlyb2hpdC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuMTEuNS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsImluZGV4LmpzIiwibWFwcy5qcyIsInN0YXRlcy9jbG9ja3RpbWUuanMiLCJzdGF0ZXMvZGF5LmpzIiwic3RhdGVzL2ZyZXF1ZW5jeS5qcyIsInN0YXRlcy9ob3VyLmpzIiwic3RhdGVzL21pbnV0ZS5qcyIsInN0YXRlcy9tb250aC5qcyIsInN0YXRlcy9yYW5nZS5qcyIsInN0YXRlcy95ZWFyLmpzIiwidG9rZW5zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHJlZ2V4U3RyaW5nID0gcmVxdWlyZSgnLi9tYXBzJykucmVnZXhTdHJpbmc7XG52YXIgZGVmYXVsdEZsYWdzID0gcmVxdWlyZSgnLi9tYXBzJykuZGVmYXVsdEZsYWdzO1xudmFyIGRlZmF1bHRSZXN1bHRDcm9uID0gcmVxdWlyZSgnLi9tYXBzJykuZGVmYXVsdFJlc3VsdENyb247XG52YXIgZmxhZ3MgPSByZXF1aXJlKCcuL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi9tYXBzJykucmVzdWx0Q3JvbjtcblxudmFyIHJlYWRsaW5lID0gcmVxdWlyZSgncmVhZGxpbmUnKTtcbmNvbnN0IHRva2VuaXplSW5wdXQgID0gcmVxdWlyZSgnLi90b2tlbnMnKS50b2tlbml6ZUlucHV0O1xuY29uc3QgZ2V0Q2xvY2tUaW1lICA9IHJlcXVpcmUoJy4vc3RhdGVzL2Nsb2NrdGltZScpLmdldENsb2NrVGltZTtcbmNvbnN0IGdldERheSAgPSByZXF1aXJlKCcuL3N0YXRlcy9kYXknKS5nZXREYXk7XG5jb25zdCBnZXRGcmVxdWVuY3lPbmx5ICA9IHJlcXVpcmUoJy4vc3RhdGVzL2ZyZXF1ZW5jeScpLmdldEZyZXF1ZW5jeU9ubHk7XG5jb25zdCBnZXRGcmVxdWVuY3lXaXRoICA9IHJlcXVpcmUoJy4vc3RhdGVzL2ZyZXF1ZW5jeScpLmdldEZyZXF1ZW5jeVdpdGg7XG5jb25zdCBnZXRIb3VyICA9IHJlcXVpcmUoJy4vc3RhdGVzL2hvdXInKS5nZXRIb3VyO1xuY29uc3QgZ2V0TW9udGggID0gcmVxdWlyZSgnLi9zdGF0ZXMvbW9udGgnKS5nZXRNb250aDtcbmNvbnN0IGdldE1pbnV0ZSAgPSByZXF1aXJlKCcuL3N0YXRlcy9taW51dGUnKS5nZXRNaW51dGU7XG5jb25zdCByYW5nZVN0YXJ0U3RhdGUgID0gcmVxdWlyZSgnLi9zdGF0ZXMvcmFuZ2UnKS5yYW5nZVN0YXJ0U3RhdGU7XG5jb25zdCByYW5nZUVuZFN0YXRlICA9IHJlcXVpcmUoJy4vc3RhdGVzL3JhbmdlJykucmFuZ2VFbmRTdGF0ZTtcbmNvbnN0IGdldFllYXIgID0gcmVxdWlyZSgnLi9zdGF0ZXMveWVhcicpLmdldFllYXI7XG5cbi8qY2FsbFN0YXRlIGZ1bmN0aW9uIHRvIG1hdGNoIGFuZCBjYWxsIGN1cnJlc3BvbmRpbmcgc3RhdGUgZnVuY3Rpb24qL1xuZnVuY3Rpb24gY2FsbFN0YXRlKHRva2VuLHN0YWNrLGVycm9yKSB7XG4gICAgbGV0IHN0YXRlTmFtZSA9IGRlY2lkZVN0YXRlKHRva2VuKTtcblxuICAgIHN3aXRjaChzdGF0ZU5hbWUpIHtcbiAgICAgICAgY2FzZSBcImZyZXF1ZW5jeVdpdGhcIiA6IHtcbiAgICAgICAgICAgIHJldHVybiBnZXRGcmVxdWVuY3lXaXRoKHRva2VuLHN0YWNrLGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZyZXF1ZW5jeU9ubHlcIiA6IHtcbiAgICAgICAgICAgIHJldHVybiBnZXRGcmVxdWVuY3lPbmx5KHRva2VuLHN0YWNrLGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNsb2NrVGltZVwiIDoge1xuICAgICAgICAgICAgcmV0dXJuIGdldENsb2NrVGltZSh0b2tlbixzdGFjayxlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkYXlcIiA6IHtcbiAgICAgICAgICAgIHJldHVybiBnZXREYXkodG9rZW4sc3RhY2ssZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWludXRlXCIgOiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0TWludXRlKHRva2VuLHN0YWNrLGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImhvdXJcIiA6IHtcbiAgICAgICAgICAgIHJldHVybiBnZXRIb3VyKHRva2VuLHN0YWNrLGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1vbnRoXCIgOiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0TW9udGgodG9rZW4sc3RhY2ssZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwieWVhclwiIDoge1xuICAgICAgICAgICAgcmV0dXJuIGdldFllYXIodG9rZW4sc3RhY2ssZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmFuZ2VTdGFydFwiIDoge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmdlU3RhcnRTdGF0ZSh0b2tlbixzdGFjayxlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJyYW5nZUVuZFwiIDoge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmdlRW5kU3RhdGUodG9rZW4sc3RhY2ssZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuLypkZWNpZGVTdGF0ZSBmdW5jdGlvbiB0byBkZWNpZGUgbmV4dCBzdGF0ZSovXG5mdW5jdGlvbiBkZWNpZGVTdGF0ZSh0b2tlbikge1xuICAgIGxldCBpc0ZvdW5kID0gXCJkZWNpZGVTdGF0ZVwiO1xuICAgIGZvcihsZXQga2V5IGluIHJlZ2V4U3RyaW5nKSB7XG4gICAgICAgIC8vIFRPIERPOiBjaGVjayBmb3IgZ3JvdXBcbiAgICAgICAgbGV0IHJlZ0J1aWxkZXIgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nW2tleV0ucmVnZXh0ZXN0LCdpZycpO1xuICAgICAgICBpZihyZWdCdWlsZGVyLnRlc3QodG9rZW4pKSB7XG4gICAgICAgICAgICBpc0ZvdW5kID0ga2V5O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzRm91bmQ7XG59XG5cbi8qZ2V0Q3JvblN0cmluZyBmdWNudGlvbiB0byBjb252ZXJ0IGh1bWFuIHJlYWRhYmxlIGlucHV0IHN0cmluZyB0byBjcm9uIHN0cmluZyovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldENyb25TdHJpbmcoaW5wdXRTdHJpbmcsIHN5bnRheFN0cmluZykge1xuICAgIC8vU2V0IGRlZmF1bHQgc3ludGF4IHN0cmluZ1xuICAgIHN5bnRheFN0cmluZyA9IHR5cGVvZihzeW50YXhTdHJpbmcpICE9PSAndW5kZWZpbmVkJyA/IHN5bnRheFN0cmluZyA6IFwiTUlOIEhPUiBET00gTU9OIFdFSyBZRVJcIjtcblxuICAgIC8vcmVzZXR0aW5nIG1hcCB2YWx1ZXMgdG8gZGVmYXVsdFxuICAgIGZsYWdzLmlzUmFuZ2VGb3JEYXkgPSBkZWZhdWx0RmxhZ3MuaXNSYW5nZUZvckRheTtcbiAgICBmbGFncy5pc1JhbmdlRm9yTW9udGggPSBkZWZhdWx0RmxhZ3MuaXNSYW5nZUZvck1vbnRoO1xuICAgIGZsYWdzLmlzUmFuZ2VGb3JZZWFyID0gZGVmYXVsdEZsYWdzLmlzUmFuZ2VGb3JZZWFyO1xuICAgIGZsYWdzLmlzUmFuZ2VGb3JIb3VyID0gZGVmYXVsdEZsYWdzLmlzUmFuZ2VGb3JIb3VyO1xuICAgIGZsYWdzLmlzUmFuZ2VGb3JNaW4gPSBkZWZhdWx0RmxhZ3MuaXNSYW5nZUZvck1pbjtcblxuICAgIHJlc3VsdENyb24ubWluID0gZGVmYXVsdFJlc3VsdENyb24ubWluO1xuICAgIHJlc3VsdENyb24uaG91ciA9IGRlZmF1bHRSZXN1bHRDcm9uLmhvdXI7XG4gICAgcmVzdWx0Q3Jvbi5kYXlfb2ZfbW9udGggPSBkZWZhdWx0UmVzdWx0Q3Jvbi5kYXlfb2ZfbW9udGg7XG4gICAgcmVzdWx0Q3Jvbi5tb250aCA9IGRlZmF1bHRSZXN1bHRDcm9uLm1vbnRoO1xuICAgIHJlc3VsdENyb24uZGF5X29mX3dlZWsgPSBkZWZhdWx0UmVzdWx0Q3Jvbi5kYXlfb2Zfd2VlaztcbiAgICByZXN1bHRDcm9uLnllYXIgPSBkZWZhdWx0UmVzdWx0Q3Jvbi55ZWFyO1xuXG4gICAgLy9TdGFjayB0byBzdG9yZSB0ZW1wZXJvcnkgc3RhdGVzJyBkYXRhXG4gICAgbGV0IHN0YWNrID0gW107XG4gICAgbGV0IGVycm9yID0gXCJcIjtcbiAgICBsZXQgdG9rZW5zID0gdG9rZW5pemVJbnB1dChpbnB1dFN0cmluZyk7XG5cbiAgICBpZih0b2tlbnMgPT0gbnVsbCkge1xuICAgICAgICBlcnJvcis9XCJQbGVhc2UgZW50ZXIgaHVtYW4gcmVhZGFibGUgcnVsZXMgIVxcblwiO1xuICAgIH1cbiAgICBsZXQgbm90RW5kU3RhdGUgPSB0cnVlO1xuICAgIGZvcihsZXQgaT0wOyBub3RFbmRTdGF0ZSAmJiBpPHRva2Vucy5sZW5ndGg7aSsrKSB7XG4gICAgICAgIG5vdEVuZFN0YXRlID0gY2FsbFN0YXRlKHRva2Vuc1tpXSxzdGFjayxlcnJvcik7XG4gICAgfVxuICAgIGlmKG5vdEVuZFN0YXRlID09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBcIkVSUk9SOlwiK2Vycm9yICsgXCJcXHRcXHRcIiArIHN5bnRheFN0cmluZy5yZXBsYWNlKFwiTUlOXCIscmVzdWx0Q3Jvbi5taW4pLnJlcGxhY2UoXCJIT1JcIixyZXN1bHRDcm9uLmhvdXIpLnJlcGxhY2UoXCJET01cIixyZXN1bHRDcm9uLmRheV9vZl9tb250aCkucmVwbGFjZShcIk1PTlwiLHJlc3VsdENyb24ubW9udGgpLnJlcGxhY2UoXCJXRUtcIixyZXN1bHRDcm9uLmRheV9vZl93ZWVrKS5yZXBsYWNlKFwiWUVSXCIscmVzdWx0Q3Jvbi55ZWFyKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBzeW50YXhTdHJpbmcucmVwbGFjZShcIk1JTlwiLHJlc3VsdENyb24ubWluKS5yZXBsYWNlKFwiSE9SXCIscmVzdWx0Q3Jvbi5ob3VyKS5yZXBsYWNlKFwiRE9NXCIscmVzdWx0Q3Jvbi5kYXlfb2ZfbW9udGgpLnJlcGxhY2UoXCJNT05cIixyZXN1bHRDcm9uLm1vbnRoKS5yZXBsYWNlKFwiV0VLXCIscmVzdWx0Q3Jvbi5kYXlfb2Zfd2VlaykucmVwbGFjZShcIllFUlwiLHJlc3VsdENyb24ueWVhcik7XG4gICAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuLy9yZWdleFN0cmluZyBqc29uXG52YXIgcmVnZXhTdHJpbmcgPSB7XG4gICAgZXZlcnkgOiB7XG4gICAgICAgIFwicmVnZXh0ZXN0XCIgOiBcIl4oZXZlcnl8ZWFjaHxhbGx8ZW50aXJlKSRcIlxuICAgIH0sXG4gICAgY2xvY2tUaW1lIDoge1xuICAgICAgICAvL2h0dHBzOi8vcmVnZXhyLmNvbS8zcXFiblxuICAgICAgICBcInJlZ2V4dGVzdFwiIDogXCJeKFswLTldKzopP1swLTldKyAqKEFNfFBNKSR8XihbMC05XSs6WzAtOV0rKSR8KG5vb258bWlkbmlnaHQpXCIsXG4gICAgICAgIC8vaHR0cHM6Ly9yZWdleHIuY29tLzNxcWJ0XG4gICAgICAgIFwicmVnZXhleGVjXCIgOiBbXG4gICAgICAgICAgICBcIl5bMC05XStcIixcbiAgICAgICAgICAgIFwiOlswLTldK1wiLFxuICAgICAgICAgICAgXCJwbVwiLFxuICAgICAgICAgICAgXCJhbVwiLFxuICAgICAgICAgICAgXCIobm9vbnxtaWRuaWdodClcIlxuICAgICAgICBdXG4gICAgfSxcbiAgICB5ZWFyIDoge1xuICAgICAgICBcInJlZ2V4dGVzdFwiIDogXCIoKHllYXJzfHllYXIpfChbMC05XXs0fVswLTldKigoID9hbmQpPyw/ID8pKSspXCIsXG4gICAgICAgIFwicmVnZXhleGVjXCIgOiBbXG4gICAgICAgICAgICBcIl4oeWVhcnN8eWVhcikkXCIsXG4gICAgICAgICAgICBcIlswLTldKlwiLFxuICAgICAgICAgICAgXCJeWzAtOV17NH0kXCJcbiAgICAgICAgXVxuICAgIH0sXG4gICAgZnJlcXVlbmN5V2l0aCA6IHtcbiAgICAgICAgXCJyZWdleHRlc3RcIiA6IFwiXlswLTldKyh0aHxuZHxyZHxzdCkkXCJcbiAgICB9LFxuICAgIGZyZXF1ZW5jeU9ubHkgOiB7XG4gICAgICAgIFwicmVnZXh0ZXN0XCIgOiBcIl5bMC05XSskXCIsXG4gICAgICAgIFwicmVnZXhleGVjXCIgOiBcIl5bMC05XStcIlxuICAgIH0sXG4gICAgbWludXRlIDoge1xuICAgICAgICBcInJlZ2V4dGVzdFwiIDogXCIobWludXRlc3xtaW51dGV8bWluc3xtaW4pXCIsXG4gICAgICAgIFwicmVnZXhleGVjXCIgOiBbXG4gICAgICAgICAgICBcIl4obWludXRlc3xtaW51dGV8bWluc3xtaW4pJFwiXG4gICAgICAgIF1cbiAgICB9LFxuICAgIGhvdXIgOiB7XG4gICAgICAgIFwicmVnZXh0ZXN0XCIgOiBcIihob3VyfGhyc3xob3VycylcIixcbiAgICAgICAgXCJyZWdleGV4ZWNcIiA6IFtcbiAgICAgICAgICAgIFwiXihob3VyfGhyc3xob3VycykkXCJcbiAgICAgICAgXVxuICAgIH0sXG4gICAgZGF5IDoge1xuICAgICAgICAvL2h0dHBzOi8vcmVnZXhyLmNvbS8zcXFjM1xuICAgICAgICBcInJlZ2V4dGVzdFwiIDogXCJeKChkYXlzfGRheSl8KCgobW9uZGF5fHR1ZXNkYXl8d2VkbmVzZGF5fHRodXJzZGF5fGZyaWRheXxzYXR1cmRheXxzdW5kYXl8V0VFS0VORHxNT058VFVFfFdFRHxUSFV8RlJJfFNBVHxTVU4pKCA/YW5kKT8sPyA/KSspKSRcIixcbiAgICAgICAgXCJyZWdleGV4ZWNcIiA6IFtcbiAgICAgICAgICAgIFwiXihkYXl8ZGF5cykkXCIsXG4gICAgICAgICAgICBcIihNT058VFVFfFdFRHxUSFV8RlJJfFNBVHxTVU58V0VFS0VORClcIlxuICAgICAgICBdXG4gICAgfSxcbiAgICBtb250aCA6IHtcbiAgICAgICAgLy9odHRwczovL3JlZ2V4ci5jb20vM3IxbmFcbiAgICAgICAgXCJyZWdleHRlc3RcIiA6IFwiXigobW9udGhzfG1vbnRoKXwoKChqYW51YXJ5fGZlYnJ1YXJ5fG1hcmNofGFwcmlsfG1heXxqdW5lfGp1bHl8YXVndXN0fHNlcHRlbWJlcnxvY3RvYmVyfG5vdmVtYmVyfGRlY2VtYmVyfEpBTnxGRUJ8TUFSfEFQUnxNQVl8SlVOfEpVTHxBVUd8U0VQVHxPQ1R8Tk9WfERFQykoID9hbmQpPyw/ID8pKykpJFwiLFxuICAgICAgICBcInJlZ2V4ZXhlY1wiIDogW1xuICAgICAgICAgICAgXCJeKG1vbnRofG1vbnRocykkXCIsXG4gICAgICAgICAgICBcIihKQU58RkVCfE1BUnxBUFJ8TUFZfEpVTnxKVUx8QVVHfFNFUFR8T0NUfE5PVnxERUMpXCJcbiAgICAgICAgXVxuICAgIH0sXG4gICAgcmFuZ2VTdGFydCA6IHtcbiAgICAgICAgXCJyZWdleHRlc3RcIiA6IFwiKGJldHdlZW58c3RhcnRpbmd8c3RhcnQpXCIgLFxuICAgIH0sXG4gICAgcmFuZ2VFbmQgOiB7XG4gICAgICAgIFwicmVnZXh0ZXN0XCIgOiBcIih0b3x0aHJvdWdofGVuZGluZ3xlbmR8YW5kKVwiICxcbiAgICB9LFxuICAgIHRva2VuaXNpbmcgOiB7XG4gICAgICAgIFwicmVnZXhleGVjXCIgOiBcIihob3VyfGhyc3xob3Vycyl8KG1pbnV0ZXN8bWludXRlfG1pbnN8bWluKXwoKG1vbnRoc3xtb250aCl8KCgoamFudWFyeXxmZWJydWFyeXxtYXJjaHxhcHJpbHxtYXl8anVuZXxqdWx5fGF1Z3VzdHxzZXB0ZW1iZXJ8b2N0b2Jlcnxub3ZlbWJlcnxkZWNlbWJlcnxKQU58RkVCfE1BUnxBUFJ8TUFZfEpVTnxKVUx8QVVHfFNFUFR8T0NUfE5PVnxERUMpKCA/YW5kKT8sPyA/KSspKXxbMC05XSsodGh8bmR8cmR8c3QpfCgoWzAtOV0rOik/WzAtOV0rKCArKT8oQU18UE0pKXwoWzAtOV0rOlswLTldKyl8KG5vb258bWlkbmlnaHQpfCgoZGF5c3xkYXkpfCgoKG1vbmRheXx0dWVzZGF5fHdlZG5lc2RheXx0aHVyc2RheXxmcmlkYXl8c2F0dXJkYXl8c3VuZGF5fFdFRUtFTkR8TU9OfFRVRXxXRUR8VEhVfEZSSXxTQVR8U1VOKSggP2FuZCk/LD8gPykrKSl8KChbMC05XXs0fVswLTldKigoID9hbmQpPyw/ID8pKSspfChbMC05XSspfCh0b3x0aHJvdWdofGVuZGluZ3xlbmR8YW5kKXwoYmV0d2VlbnxzdGFydGluZ3xzdGFydClcIlxuICAgIH1cbn1cblxudmFyIGRlZmF1bHRGbGFncyA9IHtcbiAgICBcImlzUmFuZ2VGb3JEYXlcIiA6IGZhbHNlLFxuICAgIFwiaXNSYW5nZUZvck1vbnRoXCIgOiBmYWxzZSxcbiAgICBcImlzUmFuZ2VGb3JZZWFyXCIgOiBmYWxzZSxcbiAgICBcImlzUmFuZ2VGb3JIb3VyXCIgOiBmYWxzZSxcbiAgICBcImlzUmFuZ2VGb3JNaW5cIiA6IGZhbHNlXG59O1xuXG52YXIgZGVmYXVsdFJlc3VsdENyb24gPSB7XG4gICAgXCJtaW5cIiA6IFwiKlwiLFxuICAgIFwiaG91clwiIDogXCIqXCIsXG4gICAgXCJkYXlfb2ZfbW9udGhcIiA6IFwiKlwiLFxuICAgIFwibW9udGhcIiA6IFwiKlwiLFxuICAgIFwiZGF5X29mX3dlZWtcIiA6IFwiP1wiLFxuICAgIFwieWVhclwiIDogXCIqXCJcbn07XG5cbnZhciBmbGFncyA9IHtcbiAgICBcImlzUmFuZ2VGb3JEYXlcIiA6IGRlZmF1bHRGbGFncy5pc1JhbmdlRm9yRGF5LFxuICAgIFwiaXNSYW5nZUZvck1vbnRoXCIgOiBkZWZhdWx0RmxhZ3MuaXNSYW5nZUZvck1vbnRoLFxuICAgIFwiaXNSYW5nZUZvclllYXJcIiA6IGRlZmF1bHRGbGFncy5pc1JhbmdlRm9yWWVhcixcbiAgICBcImlzUmFuZ2VGb3JIb3VyXCIgOiBkZWZhdWx0RmxhZ3MuaXNSYW5nZUZvckhvdXIsXG4gICAgXCJpc1JhbmdlRm9yTWluXCIgOiBkZWZhdWx0RmxhZ3MuaXNSYW5nZUZvck1pblxufTtcblxudmFyIHJlc3VsdENyb24gPSB7XG4gICAgXCJtaW5cIiA6IGRlZmF1bHRSZXN1bHRDcm9uLm1pbixcbiAgICBcImhvdXJcIiA6IGRlZmF1bHRSZXN1bHRDcm9uLmhvdXIsXG4gICAgXCJkYXlfb2ZfbW9udGhcIiA6IGRlZmF1bHRSZXN1bHRDcm9uLmRheV9vZl9tb250aCxcbiAgICBcIm1vbnRoXCIgOiBkZWZhdWx0UmVzdWx0Q3Jvbi5tb250aCxcbiAgICBcImRheV9vZl93ZWVrXCIgOiBkZWZhdWx0UmVzdWx0Q3Jvbi5kYXlfb2Zfd2VlayxcbiAgICBcInllYXJcIiA6IGRlZmF1bHRSZXN1bHRDcm9uLnllYXJcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcmVnZXhTdHJpbmcsXG4gICAgZGVmYXVsdEZsYWdzLFxuICAgIGRlZmF1bHRSZXN1bHRDcm9uLFxuICAgIGZsYWdzLFxuICAgIHJlc3VsdENyb25cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVnZXhTdHJpbmcgPSByZXF1aXJlKCcuLi9tYXBzJykucmVnZXhTdHJpbmc7XG52YXIgZmxhZ3MgPSByZXF1aXJlKCcuLi9tYXBzJykuZmxhZ3M7XG52YXIgcmVzdWx0Q3JvbiA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZXN1bHRDcm9uO1xuXG4vKmNsb2NrVGltZSBmdW5jdGlvbiB0byBwYXJzZSBhbmQgc3RvcmUgZnJlcXVlbmN5IHZhbHVlIHdpdGhvdXQgbnRoKi9cbmZ1bmN0aW9uIGdldENsb2NrVGltZSh0b2tlbixzdGFjayxlcnJvcikge1xuICAgIC8vcmV0cml2ZSBob3VycyBmcm9tIGNsb2NrdGltZVxuICAgIGxldCByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZy5jbG9ja1RpbWUucmVnZXhleGVjWzBdKTtcbiAgICBsZXQgc3RyID0gdG9rZW4ubWF0Y2gocmVnQnVpbGRlcik7XG5cbiAgICBsZXQgaG91cixtaW47XG4gICAgaWYoc3RyICE9IG51bGwgJiYgc3RyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaG91ciA9IHBhcnNlSW50KHN0clswXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaG91ciA9IDA7XG4gICAgfVxuXG4gICAgLy9yZXRyaXZlIG1pbnV0ZXMgZnJvbSBjbG9ja1RpbWVcbiAgICByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZy5jbG9ja1RpbWUucmVnZXhleGVjWzFdKTtcbiAgICBzdHIgPSByZWdCdWlsZGVyLmV4ZWModG9rZW4pO1xuICAgIGlmKHN0ciAhPSBudWxsICYmIHN0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmKHN0clswXS5pbmRleE9mKCc6JykhPS0xKSB7XG4gICAgICAgICAgICBtaW4gPSBwYXJzZUludChzdHJbMF0uc2xpY2Uoc3RyWzBdLmluZGV4T2YoJzonKSsxKSk7XG4gICAgICAgICAgICBpZihtaW4gPj0gNjApIHtcbiAgICAgICAgICAgICAgICBlcnJvciArPVwiIHBsZWFzZSBlbnRlciBjb3JyZWN0IG1pbnV0ZXMgIVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1pbiA9IDA7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBtaW4gPSAwO1xuICAgIH1cblxuICAgIC8vY2hlY2sgZm9yIGluY3JlbWVudCBvZiBob3VyIGJ5IDEyIGZvciBQTVxuICAgIGxldCByZWdCdWlsZGVyUE0gPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nLmNsb2NrVGltZS5yZWdleGV4ZWNbMl0sJ2lnJyk7XG4gICAgbGV0IHJlZ0J1aWxkZXJBTSA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcuY2xvY2tUaW1lLnJlZ2V4ZXhlY1szXSwnaWcnKTtcbiAgICBpZihyZWdCdWlsZGVyUE0udGVzdCh0b2tlbikpIHtcbiAgICAgICAgaWYoaG91ciA8IDEyKSB7XG4gICAgICAgICAgICBob3VyKz0xMjtcbiAgICAgICAgfSBlbHNlIGlmKGhvdXIgPiAxMiApe1xuICAgICAgICAgICAgZXJyb3IgKz1cIiBwbGVhc2UgY29ycmVjdCB0aGUgdGltZSBiZWZvcmUgUE0gIVwiO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmKHJlZ0J1aWxkZXJBTS50ZXN0KHRva2VuKSl7XG4gICAgICAgIGlmKGhvdXIgPT0gMTIpIHtcbiAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICB9IGVsc2UgaWYoaG91ciA+IDEyICl7XG4gICAgICAgICAgICBlcnJvciArPVwiIHBsZWFzZSBjb3JyZWN0IHRoZSB0aW1lIGJlZm9yZSBBTSAhXCI7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZy5jbG9ja1RpbWUucmVnZXhleGVjWzRdLCdpZycpO1xuICAgIGlmKHJlZ0J1aWxkZXIudGVzdCh0b2tlbikpIHtcbiAgICAgICAgc3RyID0gdG9rZW4ubWF0Y2gocmVnQnVpbGRlcik7XG4gICAgICAgIGlmKHN0ciA9PSBcIm5vb25cIikge1xuICAgICAgICAgICAgaG91ciA9IDEyO1xuICAgICAgICAgICAgbWluID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgbWluID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPIERPOiBjaGVja2VkPT5UZXN0PT0/XG4gICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG4gICAgaWYodG9wRWxlbWVudCAhPSBudWxsKSB7XG4gICAgICAgIC8vQ2hlY2sgaWYgYWxyZWFkeSBhIHJhbmdlIGlzIGRlZmluZWRcbiAgICAgICAgaWYoZmxhZ3MuaXNSYW5nZUZvckhvdXIgPT0gdHJ1ZSB8fCBmbGFncy5pc1JhbmdlRm9yTWluID09IHRydWUpIHtcbiAgICAgICAgICAgIGVycm9yICs9XCIgYWxyZWFkeSBzZXQgZm9yIHJhbmdlIGV4cHJlc3Npb25zLCBzZXBlcmF0ZSBpbnRvIHR3byBjcm9ucyFcIjtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRvcEVsZW1lbnQub3duZXJTdGF0ZSA9PSBcInJhbmdlU3RhcnRcIikge1xuICAgICAgICAgICAgdG9wRWxlbWVudC5ob3VyLnN0YXJ0ID0gaG91cjtcbiAgICAgICAgICAgIHRvcEVsZW1lbnQubWluLnN0YXJ0ID0gbWluO1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHRvcEVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZUVuZFwiKSB7XG4gICAgICAgICAgICBpZih0b3BFbGVtZW50LmhvdXIgPT0gaG91cikge1xuICAgICAgICAgICAgICAgIHRvcEVsZW1lbnQubWluLmVuZCA9IG1pbjtcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1pbiA9IHRvcEVsZW1lbnQubWluLnN0YXJ0ICsgXCItXCIrdG9wRWxlbWVudC5taW4uZW5kO1xuICAgICAgICAgICAgICAgIC8vZmxhZ3MuaXNSYW5nZUZvckhvdXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b3BFbGVtZW50LmhvdXIuZW5kID0gaG91cjtcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmhvdXIgPSB0b3BFbGVtZW50LmhvdXIuc3RhcnQgKyBcIi1cIit0b3BFbGVtZW50LmhvdXIuZW5kO1xuICAgICAgICAgICAgICAgIC8vZmxhZ3MuaXNSYW5nZUZvck1pbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHN0YWNrRWxlbWVudCA9IHtcbiAgICAgICAgXCJvd25lclN0YXRlXCIgOiBcImNsb2NrVGltZVwiLFxuICAgICAgICBcImhvdXJcIiA6IGhvdXIsXG4gICAgICAgIFwibWluXCIgOiBtaW5cbiAgICB9O1xuICAgIHJlc3VsdENyb24ubWluID0gbWluO1xuICAgIGlmKHJlc3VsdENyb24uaG91ciAhPSBcIipcIiAmJiByZXN1bHRDcm9uLmhvdXIgIT0gXCJcIilcbiAgICAgICAgcmVzdWx0Q3Jvbi5ob3VyICs9IFwiLFwiK2hvdXI7XG4gICAgZWxzZVxuICAgICAgICByZXN1bHRDcm9uLmhvdXIgPSBob3VyO1xuICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0Q2xvY2tUaW1lXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZWdleFN0cmluZyA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZWdleFN0cmluZztcbnZhciBmbGFncyA9IHJlcXVpcmUoJy4uL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi4vbWFwcycpLnJlc3VsdENyb247XG5cbi8qZ2V0RGF5IGZ1bmN0aW9uIHRvIHBhcnNlIGRheXMqL1xuZnVuY3Rpb24gZ2V0RGF5KHRva2VuLHN0YWNrLGVycm9yKSB7XG4gICAgLy8gVE8gRE86IGNoZWNrIGZvciBncm91cFxuICAgIGxldCByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZy5kYXkucmVnZXhleGVjWzBdLFwiaWdcIik7XG4gICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAvLyBjaGVjayBmb3Igd29yZCBkYXksZGF5c1xuICAgIGlmKHJlZ0J1aWxkZXIudGVzdCh0b2tlbikpIHtcbiAgICAgICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG4gICAgICAgIHJlc3VsdENyb24uZGF5X29mX3dlZWsgPSBcIj9cIjtcbiAgICAgICAgaWYodG9wRWxlbWVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0b3BFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgICdmcmVxdWVuY3knIDogXCIqXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJmcmVxdWVuY3lPbmx5XCIpIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX21vbnRoID0gXCIwL1wiK3RvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJmcmVxdWVuY3lXaXRoXCIpIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX21vbnRoID0gXCJcIit0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0Q3Jvbi5kYXlfb2ZfbW9udGggPSBcIipcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjaGVjayBmb3IgdmFsdWVzIG9mIGRheXMgYmV0d2VlbiBbTU9OLVNVTl1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVnQnVpbGRlciA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcuZGF5LnJlZ2V4ZXhlY1sxXSxcImlnXCIpO1xuICAgICAgICBsZXQgbWF0Y2hlcyA9IHRva2VuLm1hdGNoKHJlZ0J1aWxkZXIpO1xuICAgICAgICBpZihtYXRjaGVzIT1udWxsICYmIG1hdGNoZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX3dlZWsgPSBcIlwiO1xuICAgICAgICAgICAgZm9yKGxldCBpPTA7IGk8bWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1hdGNoZXNbaV0gPSBtYXRjaGVzW2ldLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUTyBETzogY2hlY2tcbiAgICAgICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5sZW5ndGggPT0gMSAmJiB0b3BFbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIGFscmVhZHkgYSByYW5nZSBpcyBkZWZpbmVkXG4gICAgICAgICAgICAgICAgaWYoZmxhZ3MuaXNSYW5nZUZvckRheSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yICs9XCIgYWxyZWFkeSBzZXQgZm9yIHJhbmdlIGV4cHJlc3Npb25zLCBzZXBlcmF0ZSBpbnRvIHR3byBjcm9ucyFcIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wRWxlbWVudC5kYXkuc3RhcnQgPSBtYXRjaGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRvcEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwicmFuZ2VFbmRcIikge1xuICAgICAgICAgICAgICAgICAgICB0b3BFbGVtZW50LmRheS5lbmQgPSBtYXRjaGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrID0gdG9wRWxlbWVudC5kYXkuc3RhcnQgKyBcIi1cIit0b3BFbGVtZW50LmRheS5lbmQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX21vbnRoID0gXCI/XCI7XG4gICAgICAgICAgICAgICAgICAgIC8vZmxhZ3MuaXNSYW5nZUZvckRheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ01PTicpICYmICFyZXN1bHRDcm9uLmRheV9vZl93ZWVrLmluY2x1ZGVzKCdNT04nKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrICs9IFwiTU9OLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnVFVFJykgJiYgIXJlc3VsdENyb24uZGF5X29mX3dlZWsuaW5jbHVkZXMoJ1RVRScpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX3dlZWsgKz0gXCJUVUUsXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdXRUQnKSAmJiAhcmVzdWx0Q3Jvbi5kYXlfb2Zfd2Vlay5pbmNsdWRlcygnV0VEJykpXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5kYXlfb2Zfd2VlayArPSBcIldFRCxcIjtcbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ1RIVScpICYmICFyZXN1bHRDcm9uLmRheV9vZl93ZWVrLmluY2x1ZGVzKCdUSFUnKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrICs9IFwiVEhVLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnRlJJJykgJiYgIXJlc3VsdENyb24uZGF5X29mX3dlZWsuaW5jbHVkZXMoJ0ZSSScpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX3dlZWsgKz0gXCJGUkksXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdTQVQnKSAmJiAhcmVzdWx0Q3Jvbi5kYXlfb2Zfd2Vlay5pbmNsdWRlcygnU0FUJykpXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5kYXlfb2Zfd2VlayArPSBcIlNBVCxcIjtcbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ1NVTicpICYmICFyZXN1bHRDcm9uLmRheV9vZl93ZWVrLmluY2x1ZGVzKCdTVU4nKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrICs9IFwiU1VOLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnV0VFS0VORCcpICYmICFyZXN1bHRDcm9uLmRheV9vZl93ZWVrLmluY2x1ZGVzKCdTQVQnKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrICs9IFwiU0FULFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnV0VFS0VORCcpICYmICFyZXN1bHRDcm9uLmRheV9vZl93ZWVrLmluY2x1ZGVzKCdTVU4nKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrICs9IFwiU1VOLFwiO1xuICAgICAgICAgICAgLy8gcmVtb3ZlZCBleHRyYSBjb21tYVxuICAgICAgICAgICAgcmVzdWx0Q3Jvbi5kYXlfb2Zfd2VlayA9IHJlc3VsdENyb24uZGF5X29mX3dlZWsuc2xpY2UoMCwtMSk7XG4gICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl9tb250aCA9IFwiP1wiO1xuICAgICAgICAgICAgdmFsdWUgPSBcIlwiK3Jlc3VsdENyb24uZGF5X29mX3dlZWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUTyBETzogcHJvdmlkZSBpbiBmdXR1cmUuIGJ1dCBmb3IgTk9XICBlcnJvclxuICAgICAgICAgICAgZXJyb3IgKz1cIiBJbiB1bnJlc29sdmVkIHN0YXRlIGF0IDI7RGF5ICFcIjtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgc3RhY2tFbGVtZW50ID0ge1xuICAgICAgICBcIm93bmVyU3RhdGVcIiA6IFwiZGF5XCIsXG4gICAgICAgIFwiZGF5X29mX3dlZWtcIiA6IHJlc3VsdENyb24uZGF5X29mX3dlZWssXG4gICAgICAgIFwiZGF5X29mX21vbnRoXCIgOiByZXN1bHRDcm9uLmRheV9vZl9tb250aFxuICAgIH07XG4gICAgc3RhY2sucHVzaChzdGFja0VsZW1lbnQpO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXREYXlcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHJlZ2V4U3RyaW5nID0gcmVxdWlyZSgnLi4vbWFwcycpLnJlZ2V4U3RyaW5nO1xudmFyIGZsYWdzID0gcmVxdWlyZSgnLi4vbWFwcycpLmZsYWdzO1xudmFyIHJlc3VsdENyb24gPSByZXF1aXJlKCcuLi9tYXBzJykucmVzdWx0Q3JvbjtcblxuXG4vKmZyZXF1ZW5jeU9ubHkgZnVuY3Rpb24gdG8gcGFyc2UgYW5kIHN0b3JlIGZyZXF1ZW5jeSB2YWx1ZSB3aXRob3V0IG50aCovXG5mdW5jdGlvbiBnZXRGcmVxdWVuY3lPbmx5KHRva2VuLHN0YWNrLGVycm9yKSB7XG4gICAgbGV0IGZyZXEgPSBwYXJzZUludCh0b2tlbik7XG4gICAgaWYoaXNOYU4odG9rZW4pKSB7XG4gICAgICAgIGVycm9yICs9XCIgdG9rZW4gaXMgbm90IG51bWJlciBpbiBmcmVxdWVuY3kgb25seSAhXCI7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYoc3RhY2subGVuZ3RoID4gMCAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5vd25lclN0YXRlPT1cInJhbmdlRW5kXCIpIHtcbiAgICAgICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHRvcEVsZW1lbnQuZnJlcXVlbmN5LmVuZCA9IGZyZXE7XG4gICAgICAgIHN0YWNrLnB1c2godG9wRWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmKHN0YWNrLmxlbmd0aCA+IDAgJiYgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0ub3duZXJTdGF0ZT09XCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0ID0gZnJlcTtcbiAgICAgICAgc3RhY2sucHVzaCh0b3BFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJmcmVxdWVuY3lPbmx5XCIsXG4gICAgICAgIFwiZnJlcXVlbmN5XCIgOiBmcmVxXG4gICAgfTtcbiAgICBzdGFjay5wdXNoKHN0YWNrRWxlbWVudCk7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8qZnJlcXVlbmN5V2l0aCBmdW5jdGlvbiB0byBwYXJzZSBhbmQgc3RvcmUgZnJlcXVlbmN5IHZhbHVlIHdpdGggbnRoKi9cbmZ1bmN0aW9uIGdldEZyZXF1ZW5jeVdpdGgodG9rZW4sc3RhY2ssZXJyb3IpIHtcbiAgICAvLyBUTyBETzogY2hlY2sgZm9yIGdyb3VwXG4gICAgbGV0IHJlZ0J1aWxkZXIgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nLmZyZXF1ZW5jeU9ubHkucmVnZXhleGVjLFwiaWdcIik7XG4gICAgbGV0IGZyZXEgPSByZWdCdWlsZGVyLmV4ZWModG9rZW4pO1xuICAgIGxldCB2YWx1ZSA9IHBhcnNlSW50KGZyZXEpO1xuICAgIGlmKGlzTmFOKHZhbHVlKSkge1xuICAgICAgICBlcnJvciArPVwiIHRva2VuIGlzIG5vdCBudW1iZXIgaW4gZnJlcXVlbmN5IHdpdGggIVwiO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKHN0YWNrLmxlbmd0aCE9MCAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5vd25lclN0YXRlPT1cInJhbmdlRW5kXCIpIHtcbiAgICAgICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHRvcEVsZW1lbnQuZnJlcXVlbmN5LmVuZCA9IFwiXCIrdmFsdWU7XG4gICAgICAgIHN0YWNrLnB1c2godG9wRWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmKHN0YWNrLmxlbmd0aCA+IDAgJiYgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0ub3duZXJTdGF0ZT09XCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgbGV0IHRvcEVsZW1lbnQgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0ID0gXCJcIit2YWx1ZTtcbiAgICAgICAgc3RhY2sucHVzaCh0b3BFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJmcmVxdWVuY3lXaXRoXCIsXG4gICAgICAgIFwiZnJlcXVlbmN5XCIgOiB2YWx1ZVxuICAgIH07XG4gICAgc3RhY2sucHVzaChzdGFja0VsZW1lbnQpO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldEZyZXF1ZW5jeU9ubHksXG4gICAgZ2V0RnJlcXVlbmN5V2l0aFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVnZXhTdHJpbmcgPSByZXF1aXJlKCcuLi9tYXBzJykucmVnZXhTdHJpbmc7XG52YXIgZmxhZ3MgPSByZXF1aXJlKCcuLi9tYXBzJykuZmxhZ3M7XG52YXIgcmVzdWx0Q3JvbiA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZXN1bHRDcm9uO1xuXG4vKmdldEhvdXIgZnVuY3Rpb24gdG8gcGFyc2UgSG91cnMqL1xuZnVuY3Rpb24gZ2V0SG91cih0b2tlbixzdGFjayxlcnJvcikge1xuICAgIC8vIFRPIERPOiBjaGVjayBmb3IgZ3JvdXBcbiAgICBsZXQgcmVnQnVpbGRlciA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcuaG91ci5yZWdleGV4ZWNbMF0sXCJpZ1wiKTtcbiAgICBsZXQgdmFsdWU7XG4gICAgLy8gY2hlY2sgZm9yIHdvcmQgaG91cnNcbiAgICBpZihyZWdCdWlsZGVyLnRlc3QodG9rZW4pKSB7XG4gICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICBpZih0b3BFbGVtZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIHRvcEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgJ2ZyZXF1ZW5jeScgOiBcIipcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmKHRvcEVsZW1lbnQub3duZXJTdGF0ZSA9PSBcImZyZXF1ZW5jeU9ubHlcIikge1xuICAgICAgICAgICAgdmFsdWUgPSB0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHJlc3VsdENyb24uaG91ciA9IFwiMC9cIit0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICB9IGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwiZnJlcXVlbmN5V2l0aFwiKSB7XG4gICAgICAgICAgICAvL2hvdXIgYWxyZWFkeSBzZXRcbiAgICAgICAgICAgIGlmKHJlc3VsdENyb24uaG91ciAhPSBcIipcIiAmJiByZXN1bHRDcm9uLmhvdXIgIT0gXCJcIilcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmhvdXIgKz0gXCIsXCIrdG9wRWxlbWVudC5mcmVxdWVuY3k7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5ob3VyID0gXCJcIit0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0Q3Jvbi5ob3VyO1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihmbGFncy5pc1JhbmdlRm9ySG91ciA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgKz1cIiBhbHJlYWR5IHNldCBmb3IgcmFuZ2UgZXhwcmVzc2lvbnMsIHNlcGVyYXRlIGludG8gdHdvIGNyb25zIVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwicmFuZ2VTdGFydFwiKSB7XG4gICAgICAgICAgICAgICAgdG9wRWxlbWVudC5ob3VyLnN0YXJ0ID0gdG9wRWxlbWVudC5mcmVxdWVuY3kuc3RhcnQ7XG4gICAgICAgICAgICAgICAgdG9wRWxlbWVudC5mcmVxdWVuY3kuc3RhcnQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9wRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwicmFuZ2VFbmRcIikge1xuICAgICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHRvcEVsZW1lbnQuaG91ci5zdGFydCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0O1xuICAgICAgICAgICAgICAgIHRvcEVsZW1lbnQuaG91ci5lbmQgPSB0b3BFbGVtZW50LmZyZXF1ZW5jeS5lbmQ7XG4gICAgICAgICAgICAgICAgdG9wRWxlbWVudC5mcmVxdWVuY3kuZW5kID0gXCJcIjtcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmhvdXIgPSB0b3BFbGVtZW50LmhvdXIuc3RhcnQgKyBcIi1cIit0b3BFbGVtZW50LmhvdXIuZW5kO1xuICAgICAgICAgICAgICAgIC8vZmxhZ3MuaXNSYW5nZUZvckhvdXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJob3VyXCIsXG4gICAgICAgIFwiaG91clwiIDogdmFsdWVcbiAgICB9O1xuICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRIb3VyXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZWdleFN0cmluZyA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZWdleFN0cmluZztcbnZhciBmbGFncyA9IHJlcXVpcmUoJy4uL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi4vbWFwcycpLnJlc3VsdENyb247XG5cbi8qZ2V0TWludXRlIGZ1bmN0aW9uIHRvIHBhcnNlIG1pbnV0ZXMqL1xuZnVuY3Rpb24gZ2V0TWludXRlKHRva2VuLHN0YWNrLGVycm9yKSB7XG4gICAgLy8gVE8gRE86IGNoZWNrIGZvciBncm91cFxuICAgIGxldCByZWdCdWlsZGVyID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZy5taW51dGUucmVnZXhleGVjWzBdLFwiaWdcIik7XG4gICAgbGV0IHZhbHVlO1xuICAgIC8vIGNoZWNrIGZvciB3b3JkIG1pbnV0ZSxtaW51dGVzXG4gICAgaWYocmVnQnVpbGRlci50ZXN0KHRva2VuKSkge1xuICAgICAgICBsZXQgdG9wRWxlbWVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXTtcbiAgICAgICAgaWYodG9wRWxlbWVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0b3BFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgICdmcmVxdWVuY3knIDogXCIqXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJmcmVxdWVuY3lPbmx5XCIpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdG9wRWxlbWVudC5mcmVxdWVuY3k7XG4gICAgICAgICAgICByZXN1bHRDcm9uLm1pbiA9IFwiMC9cIit0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICB9IGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwiZnJlcXVlbmN5V2l0aFwiKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgcmVzdWx0Q3Jvbi5taW4gPSBcIlwiK3RvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihmbGFncy5pc1JhbmdlRm9yTWludXRlID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBlcnJvciArPVwiIGFscmVhZHkgc2V0IGZvciByYW5nZSBleHByZXNzaW9ucywgc2VwZXJhdGUgaW50byB0d28gY3JvbnMhXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICB0b3BFbGVtZW50Lm1pbi5zdGFydCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0O1xuICAgICAgICAgICAgICAgIHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRvcEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHRvcEVsZW1lbnQub3duZXJTdGF0ZSA9PSBcInJhbmdlRW5kXCIpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICB0b3BFbGVtZW50Lm1pbi5zdGFydCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0O1xuICAgICAgICAgICAgICAgIHRvcEVsZW1lbnQubWluLmVuZCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5LmVuZDtcbiAgICAgICAgICAgICAgICB0b3BFbGVtZW50LmZyZXF1ZW5jeS5lbmQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHJlc3VsdENyb24ubWluID0gdG9wRWxlbWVudC5taW4uc3RhcnQgKyBcIi1cIit0b3BFbGVtZW50Lm1pbi5lbmQ7XG4gICAgICAgICAgICAgICAgLy9mbGFncy5pc1JhbmdlRm9yTWluID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgc3RhY2tFbGVtZW50ID0ge1xuICAgICAgICBcIm93bmVyU3RhdGVcIiA6IFwibWludXRlXCIsXG4gICAgICAgIFwibWluXCIgOiB2YWx1ZVxuICAgIH07XG4gICAgc3RhY2sucHVzaChzdGFja0VsZW1lbnQpO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldE1pbnV0ZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVnZXhTdHJpbmcgPSByZXF1aXJlKCcuLi9tYXBzJykucmVnZXhTdHJpbmc7XG52YXIgZmxhZ3MgPSByZXF1aXJlKCcuLi9tYXBzJykuZmxhZ3M7XG52YXIgcmVzdWx0Q3JvbiA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZXN1bHRDcm9uO1xuXG4vKmdldE1vbnRoIGZ1bmN0aW9uIHRvIHBhcnNlIG1vbnRocyovXG5mdW5jdGlvbiBnZXRNb250aCh0b2tlbixzdGFjayxlcnJvcikge1xuICAgIC8vIFRPIERPOiBjaGVjayBmb3IgZ3JvdXBcbiAgICBsZXQgcmVnQnVpbGRlciA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcubW9udGgucmVnZXhleGVjWzBdLFwiaWdcIik7XG4gICAgbGV0IHZhbHVlID0gXCJcIjtcbiAgICAvLyBjaGVjayBmb3Igd29yZCBtb250aCxtb250aHNcbiAgICBpZihyZWdCdWlsZGVyLnRlc3QodG9rZW4pKSB7XG4gICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICBpZih0b3BFbGVtZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIHRvcEVsZW1lbnQgPSB7XG4gICAgICAgICAgICAgICAgJ2ZyZXF1ZW5jeScgOiBcIipcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJmcmVxdWVuY3lPbmx5XCIpIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggPSBcIjAvXCIrdG9wRWxlbWVudC5mcmVxdWVuY3k7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgfSBlbHNlIGlmKHRvcEVsZW1lbnQub3duZXJTdGF0ZSA9PSBcImZyZXF1ZW5jeVdpdGhcIikge1xuICAgICAgICAgICAgcmVzdWx0Q3Jvbi5tb250aCA9IFwiXCIrdG9wRWxlbWVudC5mcmVxdWVuY3k7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggPSBcIipcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjaGVjayBmb3IgdmFsdWVzIG9mIG1vbnRocyBiZXR3ZWVuIFtKQU4tREVDXVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBUTyBETzogY2hlY2sgZm9yIGdyb3VwXG4gICAgICAgIHJlZ0J1aWxkZXIgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nLm1vbnRoLnJlZ2V4ZXhlY1sxXSxcImlnXCIpO1xuICAgICAgICBsZXQgbWF0Y2hlcyA9IHRva2VuLm1hdGNoKHJlZ0J1aWxkZXIpO1xuICAgICAgICBpZihtYXRjaGVzIT1udWxsICYmIG1hdGNoZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggPSBcIlwiO1xuICAgICAgICAgICAgZm9yKGxldCBpPTA7IGk8bWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1hdGNoZXNbaV0gPSBtYXRjaGVzW2ldLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUTyBETzogY2hlY2tcbiAgICAgICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuXG4gICAgICAgICAgICBpZihtYXRjaGVzLmxlbmd0aCA9PSAxICYmIHRvcEVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgYWxyZWFkeSBhIHJhbmdlIGlzIGRlZmluZWRcbiAgICAgICAgICAgICAgICBpZihmbGFncy5pc1JhbmdlRm9yTW9udGggPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciArPVwiIGFscmVhZHkgc2V0IGZvciByYW5nZSBleHByZXNzaW9ucywgc2VwZXJhdGUgaW50byB0d28gY3JvbnMhXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwiZnJlcXVlbmN5T25seVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdENyb24uZGF5X29mX21vbnRoID0gdG9wRWxlbWVudC5mcmVxdWVuY3k7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHRvcEVsZW1lbnQub3duZXJTdGF0ZSA9PSBcImZyZXF1ZW5jeVdpdGhcIikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl9tb250aCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wRWxlbWVudC5tb250aC5zdGFydCA9IG1hdGNoZXNbMF07XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9wRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZUVuZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRvcEVsZW1lbnQuZnJlcXVlbmN5LmVuZCAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl93ZWVrID0gXCI/XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRDcm9uLmRheV9vZl9tb250aCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0ICsgXCItXCIgKyB0b3BFbGVtZW50LmZyZXF1ZW5jeS5lbmQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdG9wRWxlbWVudC5tb250aC5lbmQgPSBtYXRjaGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoID0gdG9wRWxlbWVudC5tb250aC5zdGFydCArIFwiLVwiK3RvcEVsZW1lbnQubW9udGguZW5kO1xuICAgICAgICAgICAgICAgICAgICAvL2ZsYWdzLmlzUmFuZ2VGb3JNb250aCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ0pBTicpICYmICFyZXN1bHRDcm9uLm1vbnRoLmluY2x1ZGVzKCdKQU4nKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoICs9IFwiSkFOLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnRkVCJykgJiYgIXJlc3VsdENyb24ubW9udGguaW5jbHVkZXMoJ0ZFQicpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggKz0gXCJGRUIsXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdNQVInKSAmJiAhcmVzdWx0Q3Jvbi5tb250aC5pbmNsdWRlcygnTUFSJykpXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5tb250aCArPSBcIk1BUixcIjtcbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ0FQUicpICYmICFyZXN1bHRDcm9uLm1vbnRoLmluY2x1ZGVzKCdBUFInKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoICs9IFwiQVBSLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnTUFZJykgJiYgIXJlc3VsdENyb24ubW9udGguaW5jbHVkZXMoJ01BWScpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggKz0gXCJNQVksXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdKVU4nKSAmJiAhcmVzdWx0Q3Jvbi5tb250aC5pbmNsdWRlcygnSlVOJykpXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5tb250aCArPSBcIkpVTixcIjtcbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ0pVTCcpICYmICFyZXN1bHRDcm9uLm1vbnRoLmluY2x1ZGVzKCdKVUwnKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoICs9IFwiSlVMLFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnQVVHJykgJiYgIXJlc3VsdENyb24ubW9udGguaW5jbHVkZXMoJ0FVRycpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggKz0gXCJBVUcsXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdTRVBUJykgJiYgIXJlc3VsdENyb24ubW9udGguaW5jbHVkZXMoJ1NFUFQnKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoICs9IFwiU0VQVCxcIjtcbiAgICAgICAgICAgIGlmKG1hdGNoZXMuaW5jbHVkZXMoJ09DVCcpICYmICFyZXN1bHRDcm9uLm1vbnRoLmluY2x1ZGVzKCdPQ1QnKSlcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLm1vbnRoICs9IFwiT0NULFwiO1xuICAgICAgICAgICAgaWYobWF0Y2hlcy5pbmNsdWRlcygnTk9WJykgJiYgIXJlc3VsdENyb24ubW9udGguaW5jbHVkZXMoJ05PVicpKVxuICAgICAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggKz0gXCJOT1YsXCI7XG4gICAgICAgICAgICBpZihtYXRjaGVzLmluY2x1ZGVzKCdERUMnKSAmJiAhcmVzdWx0Q3Jvbi5tb250aC5pbmNsdWRlcygnREVDJykpXG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi5tb250aCArPSBcIkRFQyxcIjtcbiAgICAgICAgICAgIC8vIHJlbW92ZWQgZXh0cmEgY29tbWFcbiAgICAgICAgICAgIHJlc3VsdENyb24ubW9udGggPSByZXN1bHRDcm9uLm1vbnRoLnNsaWNlKDAsLTEpO1xuICAgICAgICAgICAgdmFsdWUgPSBcIlwiK3Jlc3VsdENyb24ubW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUTyBETzogcHJvdmlkZSBpbiBmdXR1cmUuIGJ1dCBmb3IgTk9XICBlcnJvclxuICAgICAgICAgICAgZXJyb3IgKz1cIiBJbiB1bnJlc29sdmVkIHN0YXRlIGF0IDI7TW9udGggIVwiO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJtb250aFwiLFxuICAgICAgICBcIm1vbnRoXCIgOiByZXN1bHRDcm9uLm1vbnRoLFxuICAgIH07XG4gICAgc3RhY2sucHVzaChzdGFja0VsZW1lbnQpO1xuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldE1vbnRoXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZWdleFN0cmluZyA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZWdleFN0cmluZztcbnZhciBmbGFncyA9IHJlcXVpcmUoJy4uL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi4vbWFwcycpLnJlc3VsdENyb247XG5cblxuLypyYW5nZVN0YXJ0U3RhdGUgZnVuY3Rpb24gZm9yIHJhbmdlIGlucHV0Ki9cbmZ1bmN0aW9uIHJhbmdlU3RhcnRTdGF0ZSh0b2tlbixzdGFjayxlcnJvcikge1xuICAgIGlmKGZsYWdzLmlzUmFuZ2VGb3JEYXkgfHwgZmxhZ3MuaXNSYW5nZUZvck1pbiB8fCBmbGFncy5pc1JhbmdlRm9yTW9udGggfHwgZmxhZ3MuaXNSYW5nZUZvclllYXIgfHwgZmxhZ3MuaXNSYW5nZUZvckhvdXIpIHtcbiAgICAgICAgZXJyb3IgKz1cIiBhbHJlYWR5IHJhbmdlIGV4cHJlc3Npb25zICFcIjtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgc3RhY2tFbGVtZW50ID0ge1xuICAgICAgICBcIm93bmVyU3RhdGVcIiA6IFwicmFuZ2VTdGFydFwiLFxuICAgICAgICBcIm1pblwiOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJob3VyXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXlcIiA6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIiA6IFwiXCIsXG4gICAgICAgICAgICBcImVuZFwiIDogXCJcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1vbnRoXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJ5ZWFyXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmcmVxdWVuY3lcIiA6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIiA6IFwiXCIsXG4gICAgICAgICAgICBcImVuZFwiIDogXCJcIlxuICAgICAgICB9XG4gICAgfTtcbiAgICBzdGFjay5wdXNoKHN0YWNrRWxlbWVudCk7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8qcmFuZ2VFbmRTdGF0ZSBmdW5jdGlvbiBmb3IgcmFuZ2UgaW5wdXQqL1xuZnVuY3Rpb24gcmFuZ2VFbmRTdGF0ZSh0b2tlbixzdGFjayxlcnJvcikge1xuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJyYW5nZUVuZFwiLFxuICAgICAgICBcIm1pblwiOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJob3VyXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXlcIiA6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIiA6IFwiXCIsXG4gICAgICAgICAgICBcImVuZFwiIDogXCJcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1vbnRoXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJ5ZWFyXCIgOiB7XG4gICAgICAgICAgICBcInN0YXJ0XCIgOiBcIlwiLFxuICAgICAgICAgICAgXCJlbmRcIiA6IFwiXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJmcmVxdWVuY3lcIiA6IHtcbiAgICAgICAgICAgIFwic3RhcnRcIiA6IFwiXCIsXG4gICAgICAgICAgICBcImVuZFwiIDogXCJcIlxuICAgICAgICB9XG4gICAgfTtcbiAgICBsZXQgdG9wRWxlbWVudCA9IHN0YWNrW3N0YWNrLmxlbmd0aC0xXTtcbiAgICBpZih0b3BFbGVtZW50IT1udWxsKSB7XG4gICAgICAgIHN3aXRjaCh0b3BFbGVtZW50Lm93bmVyU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJmcmVxdWVuY3lXaXRoXCIgOlxuICAgICAgICAgICAgY2FzZSBcImZyZXF1ZW5jeU9ubHlcIiA6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgc3RhY2tFbGVtZW50LmZyZXF1ZW5jeS5zdGFydCA9IHRvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgICAgIHN0YWNrRWxlbWVudC5vd25lclN0YXRlID0gXCJyYW5nZUVuZFwiO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY2xvY2tUaW1lXCIgOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHN0YWNrRWxlbWVudC5ob3VyLnN0YXJ0ID0gdG9wRWxlbWVudC5ob3VyO1xuICAgICAgICAgICAgICAgIHN0YWNrRWxlbWVudC5taW4uc3RhcnQgPSB0b3BFbGVtZW50Lm1pbjtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQub3duZXJTdGF0ZSA9IFwicmFuZ2VFbmRcIjtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN0YWNrRWxlbWVudClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInJhbmdlU3RhcnRcIiA6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgdG9wRWxlbWVudC5vd25lclN0YXRlID0gXCJyYW5nZUVuZFwiO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godG9wRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtb250aFwiIDpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQub3duZXJTdGF0ZSA9IFwicmFuZ2VFbmRcIjtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQubW9udGguc3RhcnQgPSB0b3BFbGVtZW50Lm1vbnRoO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1pbnV0ZVwiIDpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQub3duZXJTdGF0ZSA9IFwicmFuZ2VFbmRcIjtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQuZnJlcXVlbmN5LnN0YXJ0ID0gc3RhY2tFbGVtZW50Lm1pbi5zdGFydCA9IHRvcEVsZW1lbnQubWluO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImhvdXJcIiA6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgc3RhY2tFbGVtZW50Lm93bmVyU3RhdGUgPSBcInJhbmdlRW5kXCI7XG4gICAgICAgICAgICAgICAgc3RhY2tFbGVtZW50LmZyZXF1ZW5jeS5zdGFydCA9IHN0YWNrRWxlbWVudC5ob3VyLnN0YXJ0ID0gdG9wRWxlbWVudC5ob3VyO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImRheVwiIDpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQub3duZXJTdGF0ZSA9IFwicmFuZ2VFbmRcIjtcbiAgICAgICAgICAgICAgICBzdGFja0VsZW1lbnQuZGF5LnN0YXJ0ID0gdG9wRWxlbWVudC5kYXlfb2Zfd2VlaztcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN0YWNrRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ5ZWFyXCIgOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHN0YWNrRWxlbWVudC5vd25lclN0YXRlID0gXCJyYW5nZUVuZFwiO1xuICAgICAgICAgICAgICAgIHN0YWNrRWxlbWVudC55ZWFyLnN0YXJ0ID0gdG9wRWxlbWVudC55ZWFyO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goc3RhY2tFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJhbmdlU3RhcnRTdGF0ZSxcbiAgICByYW5nZUVuZFN0YXRlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCByZWdleFN0cmluZyA9IHJlcXVpcmUoJy4uL21hcHMnKS5yZWdleFN0cmluZztcbnZhciBmbGFncyA9IHJlcXVpcmUoJy4uL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi4vbWFwcycpLnJlc3VsdENyb247XG5cblxuLypnZXRZZWFyIGZ1bmN0aW9uIHRvIHBhcnNlIHllYXIqL1xuZnVuY3Rpb24gZ2V0WWVhcih0b2tlbixzdGFjayxlcnJvcikge1xuICAgIC8vIFRPIERPOiBjaGVjayBmb3IgZ3JvdXBcbiAgICBsZXQgcmVnQnVpbGRlciA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcueWVhci5yZWdleGV4ZWNbMF0sXCJpZ1wiKTtcbiAgICBsZXQgdmFsdWUgPSBcIlwiO1xuICAgIC8vIGNoZWNrIGZvciB3b3JkIHllYXIseWVhcnNcbiAgICBpZihyZWdCdWlsZGVyLnRlc3QodG9rZW4pKSB7XG4gICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICByZXN1bHRDcm9uLnllYXIgPSBcIj9cIjtcbiAgICAgICAgaWYodG9wRWxlbWVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0b3BFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgICdmcmVxdWVuY3knIDogXCIqXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJmcmVxdWVuY3lPbmx5XCIpIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24ueWVhciA9IFwiMC9cIit0b3BFbGVtZW50LmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICB9IGVsc2UgaWYodG9wRWxlbWVudC5vd25lclN0YXRlID09IFwiZnJlcXVlbmN5V2l0aFwiKSB7XG4gICAgICAgICAgICByZXN1bHRDcm9uLnllYXIgPSBcIlwiK3RvcEVsZW1lbnQuZnJlcXVlbmN5O1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRDcm9uLnllYXIgPSBcIipcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjaGVjayBmb3IgdmFsdWVzIG9mIHllYXJzXG4gICAgZWxzZSB7XG4gICAgICAgIHJlZ0J1aWxkZXIgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nLnllYXIucmVnZXhleGVjWzFdLFwiaWdcIik7XG4gICAgICAgIGxldCByZWdCdWlsZGVyMiA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcueWVhci5yZWdleGV4ZWNbMl0sXCJpZ1wiKVxuICAgICAgICBsZXQgbWF0Y2hlcyA9IHRva2VuLm1hdGNoKHJlZ0J1aWxkZXIpO1xuICAgICAgICBsZXQgZXhhY3RNYXRjaGVzID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IobGV0IGk9MDsgaTxtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZihyZWdCdWlsZGVyMi50ZXN0KG1hdGNoZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgZXhhY3RNYXRjaGVzLmFkZChtYXRjaGVzW2ldLm1hdGNoKHJlZ0J1aWxkZXIyKVswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE8gRE86IGNoZWNrXG4gICAgICAgIGxldCB0b3BFbGVtZW50ID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICBpZihleGFjdE1hdGNoZXMuc2l6ZSA9PSAxICYmIHRvcEVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgLy9DaGVjayBpZiBhbHJlYWR5IGEgcmFuZ2UgaXMgZGVmaW5lZFxuICAgICAgICAgICAgaWYoZmxhZ3MuaXNSYW5nZUZvclllYXIgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGVycm9yICs9XCIgQ2Fubm90IGhhbmRsZSBtdWx0aXBsZSByYW5nZSBleHByZXNzaW9ucywgc2VwZXJhdGUgaW50byB0d28gY3JvbnMhXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZVN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICB0b3BFbGVtZW50LnllYXIuc3RhcnQgPSBBcnJheS5mcm9tKGV4YWN0TWF0Y2hlcylbMF07XG4gICAgICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh0b3BFbGVtZW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZih0b3BFbGVtZW50Lm93bmVyU3RhdGUgPT0gXCJyYW5nZUVuZFwiKSB7XG4gICAgICAgICAgICAgICAgdG9wRWxlbWVudC55ZWFyLmVuZCA9IEFycmF5LmZyb20oZXhhY3RNYXRjaGVzKVswXTtcbiAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICByZXN1bHRDcm9uLnllYXIgPSB0b3BFbGVtZW50LnllYXIuc3RhcnQgKyBcIi1cIit0b3BFbGVtZW50LnllYXIuZW5kO1xuICAgICAgICAgICAgICAgIC8vZmxhZ3MuaXNSYW5nZUZvclllYXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKGV4YWN0TWF0Y2hlcy5zaXplICE9IDApIHtcbiAgICAgICAgICAgIHJlc3VsdENyb24ueWVhciA9IFwiXCI7XG4gICAgICAgICAgICBleGFjdE1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbih5cil7XG4gICAgICAgICAgICAgICAgcmVzdWx0Q3Jvbi55ZWFyICs9IHlyK1wiLFwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyByZW1vdmVkIGV4dHJhIGNvbW1hXG4gICAgICAgICAgICByZXN1bHRDcm9uLnllYXIgPSByZXN1bHRDcm9uLnllYXIuc2xpY2UoMCwtMSk7XG4gICAgICAgICAgICB2YWx1ZSA9IFwiXCIrcmVzdWx0Q3Jvbi55ZWFyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVE8gRE86IHByb3ZpZGUgaW4gZnV0dXJlLiBidXQgZm9yIE5PVyAgZXJyb3JcbiAgICAgICAgICAgIGVycm9yICs9XCIgSW4gdW5yZXNvbHZlZCBzdGF0ZSBhdCAyO3llYXIgIVwiO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdGFja0VsZW1lbnQgPSB7XG4gICAgICAgIFwib3duZXJTdGF0ZVwiIDogXCJ5ZWFyXCIsXG4gICAgICAgIFwieWVhclwiIDogcmVzdWx0Q3Jvbi55ZWFyXG4gICAgfTtcbiAgICBzdGFjay5wdXNoKHN0YWNrRWxlbWVudCk7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldFllYXJcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHJlZ2V4U3RyaW5nID0gcmVxdWlyZSgnLi9tYXBzJykucmVnZXhTdHJpbmc7XG52YXIgZmxhZ3MgPSByZXF1aXJlKCcuL21hcHMnKS5mbGFncztcbnZhciByZXN1bHRDcm9uID0gcmVxdWlyZSgnLi9tYXBzJykucmVzdWx0Q3Jvbjtcbi8vdG9rZW5pemVJbnB1dCBmdW5jdGlvbiB0byBzZXBlcmF0ZSBvdXQgYWxsIHRva2Vuc1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB0b2tlbml6ZUlucHV0IDogZnVuY3Rpb24oaW5wdXRTdHJpbmcpe1xuICAgICAgICBsZXQgcmVnQnVpbGRlciA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcudG9rZW5pc2luZy5yZWdleGV4ZWMsXCJpZ1wiKTtcbiAgICAgICAgbGV0IG1hdGNoZXMgPSBpbnB1dFN0cmluZy5tYXRjaChyZWdCdWlsZGVyKTtcbiAgICAgICAgaWYobWF0Y2hlcyA9PSBudWxsIHx8IG1hdGNoZXMubGVuZ3RoID09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBpPTA7aTxtYXRjaGVzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgIG1hdGNoZXNbaV0gPSAobWF0Y2hlc1tpXStcIlwiKS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgfVxufTtcbiJdfQ==
