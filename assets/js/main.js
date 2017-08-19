/*
	Alpha by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		wide: '(max-width: 1680px)',
		normal: '(max-width: 1280px)',
		narrow: '(max-width: 980px)',
		narrower: '(max-width: 840px)',
		mobile: '(max-width: 736px)',
		mobilep: '(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$banner = $('#banner');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on narrower.
			skel.on('+narrower -narrower', function() {
				$.prioritize(
					'.important\\28 narrower\\29',
					skel.breakpoint('narrower').active
				);
			});

		// Dropdowns.
			$('#nav > ul').dropotron({
				alignment: 'right'
			});

		// Off-Canvas Navigation.

			// Navigation Button.
				$(
					'<div id="navButton">' +
						'<a href="#navPanel" class="toggle"></a>' +
					'</div>'
				)
					.appendTo($body);

			// Navigation Panel.
				$(
					'<div id="navPanel">' +
						'<nav>' +
							$('#nav').navList() +
						'</nav>' +
					'</div>'
				)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'left',
						target: $body,
						visibleClass: 'navPanel-visible'
					});

			// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#navButton, #navPanel, #page-wrapper')
						.css('transition', 'none');

		// Header.
		// If the header is using "alt" styling and #banner is present, use scrollwatch
		// to revert it back to normal styling once the user scrolls past the banner.
		// Note: This is disabled on mobile devices.
			if (!skel.vars.mobile
			&&	$header.hasClass('alt')
			&&	$banner.length > 0) {

				$window.on('load', function() {

					$banner.scrollwatch({
						delay:		0,
						range:		0.5,
						anchor:		'top',
						on:			function() { $header.addClass('alt reveal'); },
						off:		function() { $header.removeClass('alt'); }
					});

				});

			}

	});

})(jQuery);

$contactForm = $('#contact');

$nameErrorField = $('#name-error');
$emailErrorField = $('#email-error');
$messageErrorField = $('#message-error');

$nameField = $('#name');
$emailField = $('#email');
$messageField = $('#message');
$submitButton = $('#submitButton');

$(function () {
    $submitButton.click(function (e) {
    	var name = $nameField.val();
		var email = $emailField.val();
		var message = $messageField.val();

		if (!validate(name, email, message)) {
			return false;
		}

        sendEmail(name, email, message);
    });
});

function validate(name, email, message) {
	$nameErrorField.addClass('hidden');
	$emailErrorField.addClass('hidden');
	$messageErrorField.addClass('hidden');

	var okay = true;

	if (name === '') {
		$nameErrorField.removeClass('hidden');
		$nameErrorField.val('Your name is required.');
		
		okay = false;
	}

	if (email === '') {
		$emailErrorField.removeClass('hidden');
		$emailErrorField.val('Your email is required.');

		okay = false;
	} else if (!validateEmail(email)) {
		$emailErrorField.removeClass('hidden');
		$emailErrorField.val('The provided email is invalid.');

		okay = false;
	}

	if (message === '') {
		$messageErrorField.removeClass('hidden');
		$messageErrorField.val('A message is required.');

		okay = false;
	}

	return okay;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function sendEmail(name, email, message) {
	AWS.config.region = 'us-east-1';
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    	IdentityPoolId: 'us-east-1:efd91b25-7af9-4141-9f5f-62d5f6dfc904',
	});

	var payload = {
		"subject": "Steltra Fitness: You have a new contact request",
		"message": message,
		"from": email,
		"name": name
	}

	console.log('Sending Payload: ' + payload);

	var lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2017-08-01'});
	// create JSON object for parameters for invoking Lambda function
	var params = {
	  FunctionName : 'sendEmail',
	  InvocationType : 'RequestResponse',
	  LogType : 'None',
	  Payload : JSON.stringify(payload)
	};
	// create variable to hold data returned by the Lambda function
	var results;

	lambda.invoke(params, function(error, data) {
	  if (error) {
	  	console.log(error);
	  	alert('Sorry, an error occurred. Please refresh the page and try again.');
	    return;
	  } else {
	    alert('Thank you! I will be in touch with you shortly.');
	  }
	});
}
