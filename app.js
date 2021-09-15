'use strict';
var readlineSync = require('readline-sync');
var parser = require('csv-parse/lib/sync');

var fs = require('fs');

if (!fs.existsSync('debug.txt')) {
    fs.writeFileSync('debug.txt','');
}

let conOrcsv = readlineSync.question("Would you like to use the console or input .csv file? (con/csv)");
if (conOrcsv == 'con') {
    let name1 = readlineSync.question("Input name 1: ");
    numCheck(name1);
    let name2 = readlineSync.question("Input name 2: ");
    numCheck(name2);

    console.log(printCompatabilityOfPlayers(name1, name2));
} else if (conOrcsv == 'csv') {
    try {
        let fileName = readlineSync.question("Full file name (E.g. foo.csv)");
        const fileData = fs.readFileSync('./' + fileName, { encoding: 'utf8', flag: 'r' });

        const records = parser(fileData, {
            rows: true,
            skip_empty_lines: true
        })

        pairMaleFemale(records);
    } catch {
        console.log("File does not exist or there are formatting errors in the file");
        fs.appendFileSync("debug.txt", new Date() + ": Given file name does not exist. If file does exist check formatting of items \n");
        process.exit();
    }
    

} else {
    console.log("Please only put 'con' or 'csv'");
    process.exit();
}



function pairMaleFemale(data) {
    let males = [];
    let females = [];
    let pairResults = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].length > 2) {
            console.log("Only input the name and gender separated by a comma (E.g. John, m)");
            fs.appendFileSync("debug.txt", new Date() + ": Formatting error in .csv file (should only be in format 'name, [m/f]' != "+ data[i] +"\n");
            process.exit();
        }
        numCheck(data[i][0]);
        let gender = data[i][1].replace(/\s+/g, '');
        switch (gender) {
            case 'f':
                females.push(data[i][0]);
                break;
            case 'm':
                males.push(data[i][0]);
                break;
            default:
                console.log("Gender must be 'f' or 'm'");
                fs.appendFileSync("debug.txt", new Date() + ": Gender must be 'f' or 'm' \n");
                process.exit();
                break;
        }
    }
    males = removeDuplicatesAndSort(males);
    females = removeDuplicatesAndSort(females);
    for (let i = 0; i < males.length; i++) {
        for (let j = 0; j < females.length; j++) {
            let compat = getCompatabilityOfPlayers(males[i], females[j]);
            pairResults.push([compat,males[i], females[j]])
        }
    }
    pairResults = pairResults.sort(function (a, b) { return b[0] - a[0]; });
    let txt = toTextFile(pairResults);
    var file = fs.createWriteStream('output.txt');

    txt.forEach(function (v) { file.write(v + '\n'); });
    file.end();
    //return [males, females];
}

///Older code for console use.
 function printCompatabilityOfPlayers(n1, n2) {
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

function getCompatabilityOfPlayers(n1, n2) {
    let finalString = n1 + "matches" + n2;

    finalString = finalString.toLowerCase();
    finalString = finalString.replace(/\s+/g, '');
    let compatArray = getCompatablity(characterCounter(finalString));
    let compatString = '';
    for (let i = 0; i < compatArray.length; i++) {
        compatString += compatArray[i];
    }
    let retVal = parseFloat(compatString);
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
        if (s[i].match(/[A-Z|a-z]/i) == null) {
            console.log("Names can only be letters");
            fs.appendFileSync("debug.txt", new Date() + ": An incorrect name was given '" + s +"' \n");
            process.exit();
        }
    }
}

function getCompatablity(numArray) {
    let workingArray = [];
    numArray = splitNumArray(numArray);
    if (numArray.length <= 2)
        return numArray;

    while (numArray.length > 0) {
        let num1 = numArray.shift();
        let num2 = numArray.pop() || 0;
        workingArray.push(num1 + num2);
    }
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

function removeDuplicatesAndSort(arr) {
    return [...new Set(arr)].sort();
}


function toTextFile(arr) {
    let retArray =[]
    for (let i = 0; i < arr.length; i++)
        retArray.push(arr[i][0] > 80 ? arr[i][1] + ' matches ' + arr[i][2] + ' ' + arr[i][0] + '%, good match' : arr[i][1] + ' matches ' + arr[i][2] + ' ' + arr[i][0] + '%');
    return retArray;
}
