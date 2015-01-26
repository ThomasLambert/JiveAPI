
// In order to use this script you have to fill in the API key and the userId in BunchballLogin() function.

function getGroup( groupName ){
  var method =   'group.getUsers&returnCount=100&groupName=' + groupName;
  var sk = bunchballLogin();
  var result;
  var users = [];
  var url='https://solutions.nitro.bunchball.net/nitro/json?method=' + method + '&sessionKey=' + sk;
  result = bunchballLaunch(url);
  if( result.Nitro.res = "ok"){
    var table = result.Nitro.users.User
    for( var i in table ){
      users[i] = table[i].userId;
    }
  }
  return users;
}



function userMgmt(userId, groupName , quit) {
// add or removes a user to/from a group
  if( quit == false){
    var method = "user.leaveGroup"; // choose the method corresponding to desired action
  }else{
    var method = "user.joinGroup";
  }
  var sk = bunchballLogin();
  var url='https://solutions.nitro.bunchball.net/nitro/json?method=' + method + '&userId=' + userId + '&groupName=' + groupName + '&sessionKey=' + sk;
  var result = bunchballLaunch(url);
  Logger.log( userId + " " + method +  " " + groupName +  " " + result.Nitro.res );
  return result.Nitro.res
}



function logAction( userId , action , value ) {
  // Test the result of a bunchball action

  var sk = bunchballLogin();
  var method =   'user.logAction&userId=' + userId + '&tags=' + action;
  if( typeof value != 'undefined' ) method = method + "&value=" + value;
  var url='https://solutions.nitro.bunchball.net/nitro/json?method=' + method + '&sessionKey=' + sk;
  var result = bunchballLaunch(url);
  Logger.log(result);
  return result.Nitro.res;
}




function getPoints( pointsCategory) {
   var sk = bunchballLogin();
   var method =   'user.getPointsBalance&start=0&criteria=credits&pointCategory=' + pointsCategory;
   var url='https://solutions.nitro.bunchball.net/nitro/json?method=' + method + '&sessionKey=' + sk;
   bunchballLaunch(url);
}


function bunchballLogin() {
  // Authenticate the user in "userID". Return the session key.
  
  var method =   'user.login';
  var apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  var userId = 'xxxxxx';
  var url='https://solutions.nitro.bunchball.net/nitro/json?method=' + method + '&apiKey=' + apiKey + '&userId=' + userId;
    var options = {
      "contentType" : "application/json",
      "method" : "get",
      "muteHttpExceptions":true,
    };
  var json = UrlFetchApp.fetch(url, options).getContentText();  
  var dataJson = Utilities.jsonParse(json)
  var sessionKey = dataJson.Nitro.Login.sessionKey
  return sessionKey
}


function bunchballLaunch( url ){
  // Executes the API command and returns json data
     var options = {
      "contentType" : "application/json",
      "method" : "get",
      "muteHttpExceptions":true,
   };
  var json = UrlFetchApp.fetch(url, options).getContentText();  
  var dataJson = Utilities.jsonParse(json);
  return dataJson;
}
