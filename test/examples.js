/*This file contains data of example phrases and results for testing*/

var exampleData = [
    {
        "srno" : 1,
        "inputPhrase" : "Run at 10:00 am every day",
        "desiredOutput" : "0 10 * * ? *"
    },
    {
        "srno" : 2,
        "inputPhrase" : "Run at 12:15 pm every day",
        "desiredOutput" : "15 12 * * ? *"
    },
    {
        "srno" : 3,
        "inputPhrase" : "Run at 6:00 pm every Monday through Friday",
        "desiredOutput" : "0 18 ? * MON-FRI *"
    },
    {
        "srno" : 4,
        "inputPhrase" : "Run at 8:00 am every 1st day of the month",
        "desiredOutput" : "0 8 1 * ? *"
    },
    {
        "srno" : 5,
        "inputPhrase" : "Run every 15 minutes",
        "desiredOutput" : "0/15 * * * ? *"
    },
    {
        "srno" : 6,
        "inputPhrase" : "Run every 10 minutes Monday through Friday",
        "desiredOutput" : "0/10 * ? * MON-FRI *"
    },
    {
        "srno" : 7,
        "inputPhrase" : "Run every 5 minutes Monday through Friday between 8:00 am and 5:55 pm",
        "desiredOutput" : "0/5 8-17 ? * MON-FRI *"
    },
    {
        "srno" : 8,
        "inputPhrase" : "7pm every Thursday",
        "desiredOutput" : "0 19 ? * THU *"
    },
    {
        "srno" : 9,
        "inputPhrase" : "midnight on tuesdays",
        "desiredOutput" : "0 0 ? * TUE *"
    },
    {
        "srno" : 10,
        "inputPhrase" : "every 5 minutes on Tuesdays",
        "desiredOutput" : "0/5 * ? * TUE *"
    },
    {
        "srno" : 11,
        "inputPhrase" : "midnight",
        "desiredOutput" : "0 0 * * ? *"
    },
    {
        "srno" : 12,
        "inputPhrase" : "noon",
        "desiredOutput" : "0 12 * * ? *"
    },
    {
        "srno" : 13,
        "inputPhrase" : "5:15am every Tuesdays",
        "desiredOutput" : "15 5 ? * TUE *"
    },
    {
        "srno" : 14,
        "inputPhrase" : "every day at 17:25",
        "desiredOutput" : "25 17 * * ? *"
    },
    {
        "srno" : 15,
        "inputPhrase" : "every 3rd day at 2:55 am from January to August in 2019 and 2020",
        "desiredOutput" : "55 2 3 JAN-AUG ? 2019,2020"
    }
];
