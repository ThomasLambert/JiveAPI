
function getPlaces(){
  // Get places : this function is useful to get the ID of a PLACE
  // Ajust filters, launch search and view results in the log
  // https://developers.jivesoftware.com/api/v3/cloud/rest/PlaceService.html#getPlaces(List<String>, String, int, int, String)

  // Filters
  //   ?filter=search(test,report)
  //   recentlyviewed
  //   ?filter=type()   = space, blog, group ...
  
  var result = fetch( BASEURL + "/places/?filter=type(group)&filter=search(test collaboration)&count=100" , options("get")).list; 
  for(var i in result){
   Logger.log(i + " " + result[i].name + " " + result[i].placeID); 
  }
}



function getPlaceDisplayName(placeId , logJson){
  return fetch( BASEURL + "/places/" + placeId , options("get") , logJson).displayName;
}



function getFollowersFromPlace( placeId , logJson ){
  return fetch( BASEURL + "/places/" + placeId + "/followers?count=1000" , options("get")).list;
}



function moveAllContent(){
  // plus d'info ici sur l'API "move" : https://community.jivesoftware.com/thread/263422
  var sourcePlaceId = 89172;
  var targetPlaceId = 89176;
  var allContent = fetch( BASEURL + "/contents?filter=place(" + BASEURL + "/places/" + sourcePlaceId + ")&count=100" , options("get")).list;
  
  var targetPlace = fetch( BASEURL + "/places/" + targetPlaceId , options("get"));
  for( var i in allContent){
  allContent[i].parent = targetPlace.resources.self.ref
  Logger.log( allContent[i] )
  var result = fetch( allContent[i].resources.self.ref , options("put" , allContent[i]));
  }

}
