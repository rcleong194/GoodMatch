'use strict';
var readlineSync = require('readline-sync');

let name1 = readlineSync.question("Input name 1: ");
numCheck(name1);
let name2 = readlineSync.question("Input name 2: ");
numCheck(name2);

console.log(getCompatabilityOfPlayers(name1, name2));

function getCompatabilityOfPlayers(n1,n2) {
    

    let finalString = n1 + "matches" + n2;

    finalString = finalString.toLowerCase();
    finalString = finalString.replace(/\s+/g, '');
    let compatArray = getCompatablity(characterCounter(finalString));
    let compatString = '';
    for (let i = 0; i < compatArray.length; i++) {
        compatString += compatArray[i];
    }
    let retVal = parseFloat(compatString) > 80 ? n1 + ' matches ' + n2 + ' ' + compatString + '%, good match' : n1 + ' matches ' + n2 + ' ' + compatString + '%';
    return retVal;
}

function characterCounter(s) {
    
    let numArray = [];
    while (s.length > 0) {
        let counter = 0;
        for (let j = 0; j < s.length; j++) {
            
            if (s[0] == s[j]) {
                counter++;
            }
        }
        let reg = new RegExp(s[0], 'g');
        s = s.replace(reg, '');
        numArray.push(counter);
    }
    return numArray;
}

function numCheck(s) {
    for (let i = 0; i < s.length; i++) {
        if (s[i].match(/[A-Z|a-z]/i)==null) {
            console.log("Please only input letters");
            process.exit();
        }
    }
}

function getCompatablity(numArray) {
    let workingArray = [];
    //console.log(numArray);
    numArray = splitNumArray(numArray);
    if (numArray.length <= 2)
        return numArray;

    while (numArray.length > 0) {
        let num1 = numArray.shift();
        let num2 = numArray.pop() || 0;
        workingArray.push(num1 + num2);
    }
    console.log(workingArray);
    return getCompatablity(workingArray);
}

function splitNumArray(numArray) {
    let string = '';
    for (let i = 0; i < numArray.length; i++) {
        string += numArray[i];
    }
    let splitArr = string.split("");
    return splitArr.map(x => parseFloat(x));
}

//console.log(percentage(name1));
