// All functions around the persons

function getMultiplePeopleById( userIdList , numberOfResults , logJson ){
  var idsStr = "";
  for( var i in userIdList ){
    idsStr = idsStr + userIdList[i];
    if( i  < userIdList.length - 1 ) idsStr = idsStr + ",";
  }
  Logger.log( BASEURL + "/people/?count=100&ids=" + idsStr  );
  return fetch( BASEURL + "/people/?count=100&ids=" + idsStr, options("get"), logJson );
}




function disableUser(userId, logJson) {
  Logger.log( userId );
  // The Jive object insinde the people object will be set to non enabled
  var person = fetch( BASEURL + "/people/" + userId, options("get"), logJson);
  var disabled = {
    "name" : person.name,
    "emails" : person.emails,
    "jive" : {
      "username" : person.jive.username,
      "enabled" : false
    }
  };  
  return fetch( BASEURL +  "/people/" + userId, options( "put" , disabled ), logJson).jive.enabled;
}

function getEnabledStatus( userId , logJson ){
  return fetch( BASEURL + "/people/" + userId , options("get"), logJson).jive.enabled;
}

function getPersonByEmail(email , logJson){
    return fetch( BASEURL + "/people/email/" + email , options("get"), logJson);
}

function getUserId(email , logJson){
    return fetch( BASEURL + "/people/email/" + email , options("get"), logJson).id;
}

function getUserEmail(email , logJson){
  // the email passed in argument is actually the username which can be different than the email
  // The username is based on the email, but can NEVER change. The email has sometimes changed in Lafarge
  // (ext user being hired, someone get married)
    return fetch( BASEURL + "/people/email/" + email , options("get"), logJson);
}


function getMembership(){
  
  var userId = 18824;
  var url =   BASEURL + "/members/people/" + userId + "?count=100";
  
  var result = fetch( url , options("get") );
  for(var i in result.list )
    Logger.log( result.list[i].group.displayName );

}



function createPerson(logJson){
  // fill the following object and launch the function in order to create a new person in the system
  // => not functionnal, returns a 500 error ??
  var newPerson =
    {
      "emails" : [ {
          "value" : "",
          "type" : "work",
          "primary" : true,
          "jive_label" : "Email"
      } ],
      "jive" : {
          "password" : "",
          "username" : ""
      },
      "name" : {
      "familyName" : "Contact",
      "givenName" : "Test"
      }
    };

  var result = fetch( BASEURL + "/people/", options( "post" , newPerson) , logJson );
}

