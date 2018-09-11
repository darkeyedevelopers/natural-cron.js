'use strict';
const regexString = require('./maps').regexString;
var defaultFlags = require('./maps').defaultFlags;
var defaultResultCron = require('./maps').defaultResultCron;
var flags = require('./maps').flags;
var resultCron = require('./maps').resultCron;

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
