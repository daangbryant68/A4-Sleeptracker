--Readme document for *author(s)*, *email(s)*, *UCI id(s)*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

*/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 1/2 Following good principles of mobile design
- 1/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
13 Hours


3. What online resources did you consult when completing this assignment? (list specific URLs)
https://youtu.be/vb7fkBeblcw?si=rGzST-zOCwF-t9gS - IndexedDB and Ionic Storage Help
https://ionicframework.com/docs/angular/navigation - Page Routing
https://stackoverflow.com/questions - General Questions, mostly on the live server


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
I did not consult anyone else.


5. Is there anything special we need to know in order to run your code?
Nothing special to know.


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
I designed my app around a busy user, who needs to keep their habit tracking as minimal as possible. I wanted the app
to be quick and easy to use, while also giving useful information.


7. Did you design your app specifically for iOS or Android, or both?
The app was designed to be cross-platform using ionic's web view philosophy.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
A person only needs to press the log overnight sleep button, select the dates/time, and confirm to make a log. I used
this flow, since it felt the most intuitive for the user.


9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
Similar to the sleep log, user's press the home page button, choose a described value 1-7, and confirm. I wanted the
steps to be simple and to have the scale well described for the user.


10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
The data can be seen after pressing the corresponding homepage button, after which users can sort between the overnight
logs or the sleepiness logs, both of which are in chronological order. The chronological order was most intuitive for
the user to see their most recent sleep habits and the separation allowed for differentiation in the logs.


11. Which feature choose--using a native device resource, backing up logged data, or both?
Backing up logged data


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
N/A


13. If you backed up logged data, where does it back up to?
ionic storage

14. How does your app implement or follow principles of good mobile design?
The front page provides a self-explanatory initial view, telling the user exactly what they should do and giving them
a brief summary of how they're sleep logs have been going. There is error prevention in the logs in order to prohibit
users from using incorrect dates.