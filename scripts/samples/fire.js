var locatorRef = new Firebase("https://buslocator.firebaseio.com/335E_ITPL");
// Attach an asynchronous callback to read the data at our posts reference
locatorRef.on('value', function (snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log('The read failed: ' + errorObject.code);
});