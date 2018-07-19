# natural-cron.js
Pure JS library for converting natural english phrases into cron expressions.


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
    
(Make sure you have nodejs installed)


## Implemented using Push Down Automata
![design.png](https://github.com/darkeyedevelopers/natural-cron.js/blob/master/resources/design.png)
