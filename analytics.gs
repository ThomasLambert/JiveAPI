

//#####################################
// Title: Jive Data Export Service scripts
// Description : Using the Analytics (Jive Data Export Service) API from Google Apps Script
// Author: Thomas Lambert
// Date : 01/26/2015
// Version : 1.0
//#####################################
// API and access Documentation : https://community.jivesoftware.com/docs/DOC-99916#jive_content_id_Show_Me_an_Example
// Be careful, you have to change 2 parameters in order to switch to production or test environnement 
// - The BASEURL constant
// - The clientId and clientSecret variables in the getAuthKey script
// Then you will be able to launch the getAuthKey script. Copy and paste the authKey from the log to the AUTHKEY variable
// Please use this script inside a spreadsheet as the results will be inserted into a spreadsheet
//#####################################

// Test
//var BASEURL = "https://api-eu.jivesoftware.com/analytics";

// Production
var BASEURL = "https://api.jivesoftware.com/analytics";


var COUNT = 200; // number of results 


function getActivityForUser() {

  var ui = SpreadsheetApp.getUi();
  var user = ui.prompt('What user would you like to get activity for ? (ex: John Smith)');
  var url = BASEURL + "/v1/export/activity?filter=activity(View)&filter=user(" + user.getResponseText() + ")&count=" + COUNT;
  
  launchJDES(url);
}


function getActivityForPlace() {

  var ui = SpreadsheetApp.getUi();
  var place = ui.prompt('What place would you like to get activity for ?');
  var url = BASEURL + "/v1/export/activity?filter=activity(View)&filter=place(" + place.getResponseText() + ")&count=" + COUNT;
  
  launchJDES(url);

}

function getActivityForPlaceAndUser() {

  var ui = SpreadsheetApp.getUi();
  var user = ui.prompt('What user would you like to get activity for ? (ex: John Smith)');
  var place = ui.prompt('What place would you like to get activity for ?');
  var url = BASEURL + "/v1/export/activity?filter=activity(View)&filter=user(" + user.getResponseText() + ")&filter=place(" + place.getResponseText() + ")&count=" + COUNT;
  
  launchJDES(url);

}





function launchJDES( url ) {

  var JiveActivityAccess = SpreadsheetApp.getActiveSpreadsheet();
  
  var dataList = fetchJDES(url, true);

  JiveActivityAccess.getSheetByName('userActivity').getRange('A2:F').clear();
  
  for( var i in dataList){

    Logger.log( "i " + i );
    if (typeof dataList[i].activity != "undefined") {
      var object = dataList[i].activity.actionObject;
          var date = timeConverter(dataList[i].activity.activityTime );
    }


    var actor = dataList[i].activity.actor;
    if (typeof dataList[i].activity.destination != "undefined") {
      var destination = dataList[i].activity.destination.name;
    }
    var logValue = [[actor.name , actor.username , date , destination, object.objectType, object.url]];
    var rangeNumber = parseInt(i) + 2;
    JiveActivityAccess.getSheetByName('userActivity').getRange('A' + rangeNumber + ':F' + rangeNumber).setValues(logValue);
  
  }
}



function fetchJDES( url, log ){
  
  var scriptProperties = PropertiesService.getScriptProperties();
  var authKey = scriptProperties.getProperty('AUTH_KEY');

  
  // if the Auth Key is still valid then good, if not, get a new one
  try {
    var options = setHeaders("get", authKey);
    var json = UrlFetchApp.fetch(url, options).getContentText();

    var dataJson = JSON.parse(json);
  } catch (e) {
    getAuthKey();
    var authKey = scriptProperties.getProperty('AUTH_KEY');
    var options = setHeaders("get", authKey);
    var json = UrlFetchApp.fetch( url, options).getContentText();
    //Logger.log(json);
    try{
      var dataJson = JSON.parse(json);
    }catch(e){
      Logger.log(json);
      throw new Error({'Error in launchJDES':'Please see log'}) 
    }
  }
  var dataList =  dataJson.list
  
  if(log){ Logger.log( dataJson.list ); }
  
  return dataList;
  
}


function timeConverter(timestamp){
 var a = new Date(timestamp);
 var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = a.getDate();
     var hour = a.getHours();
     var min = a.getMinutes();
     var sec = a.getSeconds();
     var time = date+', '+month+' '+year+' '+hour+':'+min+':'+sec ;
     return time;
 }

function setHeaders(method, authKey) {
  
  
  var headers = {
    "Authorization" : authKey
  };

  var options = {
    "contentType" : "application/json",
    "method" : method,
    "muteHttpExceptions":true,
    "headers" : headers,
  };
  
 return options; 
}



function getAuthKey() {
  //Lafarge Test
  //var clientId = "xxxxxxxxxxxxxxxxxxxxxxxxxxx.i";
  //var clientSecret = "xxxxxxxxxxxxxxxxxxxxxxxxx.s";
  
  //Lafarge Production
  var clientId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx.i";
  var clientSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxx.s";
 
  
  var options = {
    "contentType" : "application/json",
    "method" : "post",
    "muteHttpExceptions":true,
  };
  
  var url = BASEURL + "/v1/auth/login?clientId=" + clientId + "&clientSecret=" + clientSecret;
  
  
  var authKey = UrlFetchApp.fetch(url, options).getContentText();  

  Logger.log(authKey);
  PropertiesService.getScriptProperties().setProperty('AUTH_KEY', authKey);
  
}


//Install scripts menus @ each spreadsheet opening
function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Activity')
  .addItem('Get User Activity', 'getActivityForUser')
    .addItem('Get Place Activity', 'getActivityForPlace')
  .addItem('Get User/Place Activity', 'getActivityForPlaceAndUser')
      .addSubMenu(ui.createMenu('Reporting templates')
          .addItem('test2', 'menutest2'))*/
      .addToUi();
}
