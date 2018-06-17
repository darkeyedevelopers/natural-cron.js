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
