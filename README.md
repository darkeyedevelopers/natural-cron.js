# natural-cron.js
Pure JS library for converting natural English phrases into Cron expressions.


![demo.gif](https://github.com/darkeyedevelopers/natural-cron.js/blob/master/resources/demo.gif)


## Usage

#### Browser

    <!-- link dist/natural-cron.min.js -->
    <script src="pathToLibrary/natural-cron.min.js"></script>
    
    <!-- call getCronString() from JS code whenever required-->
    <script>
        btn.onclick = function(){
            let str = inputBox.value;
            res.value = getCronString(str);
        };
    </script>
    
#### with NodeJS
* Download repository
* Start terminal in downloaded folder and run...

        nodejs --harmony_array_includes src/readableToCron.js "INPUT_NATURAL_PHRASE_HERE"
    
### Flexible outputs
Output result pattern can be specified while calling `getCronString()` function.

| Parameter | Type | Default value | Description |
| --- | --- | --- | --- |
| Input string&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp; | | **Required**. English phrase that has to be<br/> converted to corresponding Cron expression |
| Output pattern&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;String&nbsp;&nbsp;&nbsp; | `'MIN HOR DOM MON WEK YER'` | **Optional**. Specifies the output pattern in<br/> which cron expression should be generated.<br/><br/> `MIN` => Minutes<br/> `HOR` => Hours<br/> `DOM` => Day of Month<br/> `MON` => Month(s)<br/> `WEK` => Weekday(s)<br/> `YER` => Year |

### Examples
* _getCronString('every 3rd day at 2:55 am from January to August');_
<br/>=> `55 2 3 JAN-AUG ? *`
* _getCronString('every 3rd day at 2:55 am from January to August', 'DOM MON YER');_
<br/>=> `3 JAN-AUG *`
* _getCronString('every 3rd day at 2:55 am from January to August', 'DOM YER MON HOR');_
<br/>=> `3 * JAN-AUG 2`
* _getCronString('every 3rd day at 2:55 am from January to August', '{DOM) some text MON :)');_
<br/>=> `{3) some text JAN-AUG :)`

## Implemented using Push Down Automata
![design.png](https://github.com/darkeyedevelopers/natural-cron.js/blob/master/resources/design.png)
