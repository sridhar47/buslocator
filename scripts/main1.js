var base_api_url="http://54.187.220.194:3000/";
var boardingFrom;
var route;
var info="Your bus information will display here";
document.getElementById('bus_time').innerHTML=info;
function initialize() {
	var myLatlng = new google.maps.LatLng(13.0238238, 77.6430931);
	var myOptions = {
		zoom: 15,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP

	}
	window.map = new google.maps.Map(document.getElementById("map"), myOptions);
}

initialize();

function locator(){
	if(!route || !boardingFrom)
		return;
	var firebaseURL = "https://buslocator.firebaseio.com/"+route.bus_no+"_"+route.to;
	var locatorRef = new Firebase(firebaseURL);
	var markers = [];
	// Attach an asynchronous callback to read the data at our posts reference
	locatorRef.on('value', function (snapshot) {
		snapshot = snapshot.val();
		// console.log(snapshot)

		markers.forEach(function(marker){
			marker.setMap(null);

		});
		markers = [];
		
		for (var reg_no in snapshot) {
			if (snapshot.hasOwnProperty(reg_no)) {
				var bus = snapshot[reg_no];
				if(bus.location){
					var latlng = new google.maps.LatLng(bus.location.latitude, bus.location.longitude);
					var marker = new google.maps.Marker({position: latlng, map: map, icon:"img/bus_pointer3.png"});
					markers.push(marker);
					var origin = new google.maps.LatLng(bus.location.latitude, bus.location.longitude),
						destination = new google.maps.LatLng(boardingFrom.location.latitude,boardingFrom.location.longitude),
    				service = new google.maps.DistanceMatrixService();

						service.getDistanceMatrix(
					    {
					        origins: [origin],
					        destinations: [destination],
					        travelMode: google.maps.TravelMode.DRIVING,
					        avoidHighways: false,
					        avoidTolls: false
					    }, 
					    timecalc
					);
						function timecalc(response,status){
							var avg_speed=parseFloat("32.45 km/hr");
							if(status=="OK"){
								var distance=parseFloat(response.rows[0].elements[0].distance.text);
								var time=Math.round((distance/avg_speed)*60);
								info = bus.bus_no+' bus will take '+time+' minutes to reach '+boardingFrom.name;
								document.getElementById('bus_time').innerHTML=info;
						}
					}
				} 
			}
		}
	}, function (errorObject) {
		console.log('The read failed: ' + errorObject.code);
	});
}


var options, a;
jQuery(function(){
	var url = base_api_url+'buses/suggest/';
	options = { 
							serviceUrl:url, 
							onSelect: function(value){ 
								route = value.data;
								locator();
							},
							transformResult: function(response) {
								response = JSON.parse(response);
								var buses = [];
		        		response.forEach(function(bus){
		        			var display = bus.bus_no + " going to "+bus.to;
		        			buses.push({value:display, data:bus});
		        		});
				        return {
				          suggestions: buses
				        };
					    }
						};
	$('#bus_search').autocomplete(options);
}); 

var options, a;
jQuery(function (){
	var url = base_api_url+'busstops/suggest/';
	options = { 
							serviceUrl:url, 
							// autoFocus: true,
							// autoSelect: true,
							matchCase:true,
							onSelect: function(value){ 
								boardingFrom=value.data;
								locator();
							},
							transformResult: function(response) {
								response = JSON.parse(response);
								var busstops = [];
		        		response.forEach(function(busstop){
		        			var display = busstop.name + ", "+busstop.Area;
		        			busstops.push({value:display, data:busstop});
		        		});
				        return {
				          suggestions: busstops
				        };
					    }
						};

	$('#Boarding-search').autocomplete(options);
}); 