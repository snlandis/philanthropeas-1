$(document).ready(function (){
	//console.log('loaded')
$('.content').load('home.html');

	var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
		auth: {
			params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes
		}

	});

	$('body').on('click', '.btn-login', function(e) {
	  e.preventDefault();
	  lock.show();
	});

	 $('body').on('click', '.btn-logout', function(e) {
	   e.preventDefault();
	   logout();
	 });

	lock.on("authenticated", function(authResult) {
	    lock.getProfile(authResult.idToken, function(error, profile) {
	      if (error) {
	        // Handle error
	        return;
	      };
	     // getUser(profile);
	  console.log(authResult.idToken);
	  console.log(profile);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('userId', profile.user_id);
      // Display user information
      show_profile_info(profile);
      validateUser();
	    });
	  });
//this is call back to backend - front
  var validateUser = function(){
      var idToken = localStorage.getItem('id_token');
      var request = $.ajax({
        url: 'http://localhost:3000/dbapi',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + idToken
        }
    });


     // might need data{title: }

		request.done(function(res){
		console.log('page loaded: ', res);
		//$('.content').html(doner_homepage.html);

		if(res === 'donerhtml'){
			callPage('donorlanding.html')
			} else if (res === 'charhtml'){
				callPage('charitylanding.html')
					} else { callPage('newaccount.html')
							}
		});

        // if(results === 'newaccount.html'){
        // 	// redirect to new account page
        // 	location.replace('/newaccount.html');
        // }
	};

  //retrieve the profile:
  var retrieve_profile = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error getting the profile: ' + err.message);
        }
        // Display user information
        show_profile_info(profile);
      });
    }
  };

  var show_profile_info = function(profile) {
     $('.nickname').text(profile.nickname);
     $('.btn-login').hide();
     $('.avatar').attr('src', profile.picture).show();
     $('.btn-logout').show();
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = "/";
  };

  retrieve_profile();



$('body').on('click','a',function(e){
	e.preventDefault();
	var pageRef = $(this).attr('href');
	console.log(pageRef)
	callPage(pageRef)
});

$('body').on('click','.donor_login',function(e){
	e.preventDefault();
	console.log('clicked')
	callPage('newdonor.html')
});

$('body').on('click','.charity_login',function(e){
	e.preventDefault();
	callPage('newcharity.html')
});

$('body').on('click','#newdonor',function(e){
	e.preventDefault();
	newDonor();
});

$('body').on('click', '#editdonor', function(e){
	e.preventDefault();
	editDonor();
})

$('body').on('click','#newcharity',function(e){
	e.preventDefault();
	newCharity();
});

function callPage(pageRefInput){

	$.ajax({
		url: pageRefInput,
		type: 'GET',
		dataType: 'html',

		success: function(res){
			console.log('page loaded: ', res);
			$('.content').html(res);
		},

		error: function(err) {
			console.log('page not loaded: ', err)
		},

		complete: function( xhr, status) {
			console.log('completed request')
		}

	});

}

function newDonor(){
	var idToken = localStorage.getItem('id_token');
	var fullName = $('.fullName').val(),
		email = $('.email').val(),
		address = $('.address').val(),
		state = $('.state').val(),
		zip = $('.zip').val(),
		importance = $('.importance').val(),
		cause = $('.cause').val(),
		userId = localStorage.getItem('userId')
	$.ajax({
		url: 'http://localhost:3000/dbapi',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + idToken
        },
        data: {
        	fullName: fullName,
        	email: email,
        	address: address,
        	state: state,
        	zip: zip,
        	importance: importance,
        	cause: cause,
        	userId:	userId
        }
	});

};

function editDonor(){
	var idToken = localStorage.getItem('id_token');
	var fullName = $('.fullName').val(),
		email = $('.email').val(),
		address = $('.address').val(),
		state = $('.state').val(),
		zip = $('.zip').val(),
		importance = $('.importance').val(),
		cause = $('.cause').val(),
		userId = localStorage.getItem('userId')
	$.ajax({
		url: 'http://localhost:3000/dbapi',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + idToken
        },
        data: {
        	fullName: fullName,
        	email: email,
        	address: address,
        	state: state,
        	zip: zip,
        	importance: importance,
        	cause: cause,
        	userId:	userId
        }
	});

};

function newCharity(){
	var idToken = localStorage.getItem('id_token');
	var fullName = $('.fullName').val(),
		email = $('.email').val(),
		address = $('.address').val(),
		state = $('.state').val(),
		zip = $('.zip').val(),
		importance = $('.importance').val(),
		cause = $('.cause').val(),
		userId = localStorage.getItem('userId')
	$.ajax({
		url: 'http://localhost:3000/dbapi',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + idToken
        },
        data: {
        	fullName: fullName,
        	email: email,
        	address: address,
        	state: state,
        	zip: zip,
        	importance: importance,
        	cause: cause,
        	userId:	userId
        }
	});

};

};





});


