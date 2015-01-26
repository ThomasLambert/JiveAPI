//#####################################
// Title: Wrapper for API (standard Jive REST API v3)
// Description : Thie file contains all functions for fetch and building options
// Thanks to these, calling an API is really simple (see places.gs and persons.gs)
// Author: Thomas Lambert
// Date : 01/26/2015
// Version : 1.0
// REST API Examples : https://community.jivesoftware.com/docs/DOC-71539
//#####################################

var BASEURL='https://yourcommunity.jiveon.com/api/core/v3'
var PWD = "yourpassword";


function options( method , data){
  // construct the HTTP options

  var user = Session.getActiveUser().getEmail();
  
  var pwd;
  if( PWD == "" ){

    var ui = SpreadsheetApp.getUi();
    var pwd = ui.prompt('Please enter password', 'What is the password for ' + user + " on " + BASEURL + " ?", ui.ButtonSet.OK);
   //pwd = Browser.inputBox('What is the password for ' + user + " on " + BASEURL + " ?");
  }else{
    pwd = PWD;
  }
  if( typeof data === "undefined"){
    var options = {
      "contentType" : "application/json",
      "method" : method,
      "muteHttpExceptions":true,
      "headers" : {
        "Authorization": "Basic "+ Utilities.base64Encode(user+":"+pwd)
      }
    
    };
  }else{
    
    var options = {
      "contentType" : "application/json",
      "method" : method,
      "muteHttpExceptions":true,
      "headers" : {
        "Authorization": "Basic "+ Utilities.base64Encode(user+":"+pwd)
      },
      "payload" :  Utilities.jsonStringify(data)
    };
  }
  return options;
}


function fetch( url , options, logJson) {
  // fecth the url with corresponding options
  // if logJson is set to true, you will log raw json data
  
  var json = UrlFetchApp.fetch(url, options).getContentText();  
  if( logJson ) Logger.log(json ) ;
  if (options.method != "put" && options.method != "PUT" ){ 
    json = json.slice(43);

  }

  if(json.length == 0) throw "Error at authentification, please check login and password";
  var dataJson = JSON.parse(json);
  if(typeof dataJson.error != "undefined"){
    throw dataJson.error.status + " error during fetch : " + dataJson.error.message;
  }
  
  return dataJson;

}

