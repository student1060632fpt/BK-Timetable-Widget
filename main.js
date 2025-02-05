/* --------------------------------------------------------------
Script: bk-timetable-widget
Author: DatDaDev
Version: 0.0.1

Description:
- Displays the today's and tomorrow's timetable of subjects for students studying at Ho Chi Minh University of Techology (HCMUT).
- Works with medium-sized iOS widget only.
- Restricted displaying 3 subjects for each day.

Usage:
1. Visit https://mybk.hcmut.edu.vn/stinfo/ then login into your account.
2. Click at timetable tab.
3. Copy all your timetable in the selected semeter as text, except for the row header.
4. Paste it into the parameter text field of the medium-sided widget.
-------------------------------------------------------------- */

const widget = new ListWidget();

const currentDate = new Date();
// The widget will be refreshed in every 1 hour.
widget.refreshAfterDate = new Date(currentDate.now + (3600*1000));

// Get weekNumber of current week
startDate = new Date(currentDate.getFullYear(), 0, 1);
var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
var weekNumber = Math.ceil(days / 7);
const weekDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const currentDay = currentDate.getDay()+1;

let gradient = new LinearGradient();
const colorA = Color.dynamic(new Color("EFCDDF"), Color.orange())
const colorB = Color.dynamic(new Color("FFED80"), Color.blue())
gradient.colors = [colorA, colorB];
gradient.locations = [-2.5,2.5]

widget.backgroundGradient = gradient;

Script.setWidget(widget);
Script.complete();

function Error(){
  let gradient = new LinearGradient();
  gradient.colors = [Color.black(), Color.black()];
  widget.backgroundGradient = gradient;
  
  const stack = widget.addStack();
  stack.addSpacer();
	const alert = stack.addText(text);
	alert.centerAlignText();
  alert.font = Font.boldSystemFont(20);
  alert.textColor = Color.red();
  stack.addSpacer();
	widget.presentMedium();
	return;
}

let text = "Please input your timetable correctly in widget's parameter!";
let timetable = String(args.widgetParameter);
if(timetable != "")
{
  // Analyze the information
  let subjectsDetail = [];
	subjects = timetable.split(/\ (?=[A-Z0-9]{6}\t)/)
	for(let i = 0; i < subjects.length; i++)
  	subjectsDetail.push(subjects[i].split(/\t/));
  
  let stack = widget.addStack();
  let hStack = widget.addStack();
  hStack.layoutHorizontally();
  let vStack1 = hStack.addStack();
  hStack.addSpacer();
  let vStack2 = hStack.addStack();
  vStack1.layoutVertically();
  vStack2.layoutVertically();
  
  function Calculation(week, day, i, j, vStack)
  {
  	if(week == subjectsDetail[i][10][j])
    {
      if(parseInt(subjectsDetail[i][5]) == day)
    	{
        vStack.addSpacer(7.5)
      	subject = vStack.addText(subjectsDetail[i][1]);
      	subject.font = Font.boldSystemFont(14)
      	detail = vStack.addText(subjectsDetail[i][7] + ` [${subjectsDetail[i][8]}]`);
      	detail.font = Font.systemFont(10);
    	}
    }
  }
  
  // Throw error if somethings went wrong
  try{
  // Checking date&time then output
  for(let i = 0; i < subjectsDetail.length; i++)
  {
   	if(subjectsDetail[i][10].match(/\w+\|/gm) != null)
    {
      let arr = subjectsDetail[i][10].match(/\w+\|/gm).map(
    		function(n){ 
      		return parseInt(n.replace(/\|/g,''));
    		}
  		);
  		// Replace the parsed studyWeek into the its former index
  		subjectsDetail[i].splice(10, 1, Array.from(arr));
    }
    
    for(let j = 0; j < subjectsDetail[i][10].length; j++)
    {
      Calculation(weekNumber, currentDay, i, j, vStack1);
      
      let nextWeekNumber = weekNumber;
      let nextDay = currentDay + 1;
      if(currentDay == 8)
      {
      	nextWeekNumber++;
        nextDay = 2;
      }
      Calculation(nextWeekNumber, nextDay, i, j, vStack2);
    }
  }}catch(e){
    Error();
    return;
  }

	// Titile showing weekNumber and currentDay
  stack.addSpacer();
  const weekText = stack.addText("Week " + String(weekNumber) + " - " + weekDay[currentDay - 1]);
  weekText.centerAlignText();
  weekText.font = Font.blackSystemFont(18);
  stack.addSpacer();
  
  widget.addSpacer();
	widget.presentMedium();
}
else
{
  return Error();
}
