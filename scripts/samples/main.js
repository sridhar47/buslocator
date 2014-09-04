//$(document).ready(function (){
    //google.maps.event.addDomListener(window,'load', initialize);  
//});

function initialize(position){
     var myLatlng = new google.maps.LatLng(position.latitude,position.longitude);
     var myOptions = {
         zoom: 10,
         center: myLatlng,
         mapTypeId: google.maps.MapTypeId.ROADMAP
         }
      map = new google.maps.Map(document.getElementById("map"), myOptions);
      // var markers = documentElement.getElementsByTagName("marker");
      var marker = new google.maps.Marker({
          position: myLatlng, 
          map: map,
      title:"Fast marker"
     });
} 



 jQuery.ajax({
            url: "http://54.187.220.194:3000/buses/locations",
            type: "GET",

            contentType: 'application/json; charset=utf-8',
            success: function(resultData) {
                    resultData = [
                                    {location:{latitude:12.9718915, longitude:77.64115449999997}},
                                    {location:{latitude:12.9718915, longitude:81.64115449999997}},
                                    {location:{latitude:16.9718915, longitude:85.64115449999997}},
                                    {location:{latitude:20.9718915, longitude:78.64115449999997}},
                                    {location:{latitude:34.9718915, longitude:79.64115449999997}},
                                    {location:{latitude:15.9718915, longitude:80.64115449999997}},
                                ]
                    resultData.forEach(function(bus){
                       if(bus.location){
                            initialize(bus.location);
                       } 
                    });
                
            },
            error : function(jqXHR, textStatus, errorThrown) {
            },

            timeout: 120000,
        });
