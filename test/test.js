
/*
AWS: https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
Run at 10:00 am (UTC) every day
Run at 12:15 pm (UTC) every day
Run at 6:00 pm (UTC) every Monday through Friday
Run at 8:00 am (UTC) every 1st day of the month
Run every 15 minutes
Run every 10 minutes Monday through Friday
Run every 5 minutes Monday through Friday between 8:00 am and 5:55 pm (UTC)

Natural-cron-expression: https://github.com/bpolaszek/natural-cron-expression/blob/master/tests/ExpressionTest.php
each day
every day
every 25th day
every 3rd of January
7pm every Thursday
midnight on tuesdays
every 5 minutes on Tuesdays
midnight
noon
5:15am every Tuesdays
every day at 17:25


every 3rd day at 2:55 am from January to August in 2019 and 2020 =>  "55 2 3 JAN-AUG ? 2019,2020"
*/
