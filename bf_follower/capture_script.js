const max_percent = 1000;
const min_percent = 0;
let gar_percent = 0;
let cis_percent = 0;

var cis_events = [];
var gar_events = [];
const default_events_cis = [
	"General Grievous has joined the battle.",
	"Count Dooku has joined the battle.",
	"An AAT has been spotted near the battlefield.",
	"A hailfire droid has been spotted near the battlefield.",
	"A spider droid has been spotted near the battlefield.",
	"Assajj Ventress has joined the battle.",
	"A droidika has joined the battle.",
	"A droidika has been spotted near the battlefield."
];
const default_events_gar = [
	"An AT-TE has been deployed to the battlefield.",
	"An AT-RT has been deployed to the battlefield.",
	"A Jedi has joined the battle.",
	"A BARC speeder has been deployed to the battlefield.",
	"A Jet Trooper has joined the battle.",
	"A Juggernaut has joined the battle.",
	"A TX-427 has been deployed to the battlefield.",
	"Master Mace Windu has joined the battle."
];
let current_cis = cis_events;
let current_gar = gar_events;

function addLog(message) {
	$("#spambox").prepend("<p>" + message + "</p>");
}
function addAdvert(message) {
	$("#advertbox").prepend("/advert " + message+"<br>");
}


function addEvent(allegiance, event) {
	addLog("Added event: " + event + " to " + allegiance);
	if (allegiance == "cis") {
		cis_events.push(event);
		var newEvent = "<div class='event'><p>" + event + "</p> <button class='remove_event' onclick='removeEvent(\"cis\", \"" + event + "\")'>Remove</button></div>";
		$("#cis-events").append(newEvent);
		
		current_cis = cis_events;
	} else if (allegiance == "gar") {
		gar_events.push(event);

		var newEvent = "<div class='event'><p>" + event + "</p> <button class='remove_event' onclick='removeEvent(\"gar\", \"" + event + "\")'>Remove</button></div>";
		$("#gar-events").append(newEvent);

		current_gar = gar_events;
	}
}

function removeEvent(allegiance, event) {
	if (allegiance == "cis") {
		cis_events.splice(cis_events.indexOf(event), 1);
		let succ = false;
		$("#cis-events").children().each(function() {
			if ($(this).find("p").text() == event) {
				succ = true;
				$(this).remove();
			}
		});
		if (!succ) {
			addLog("Failed to remove event: " + event + " from " + allegiance);
			return;
		}
		current_cis = cis_events;
	} else if (allegiance == "gar") {
		let succ = false;
		gar_events.splice(gar_events.indexOf(event), 1);
		$("#gar-events").children().each(function() {
			if ($(this).find("p").text() == event) {
				succ = true;
				$(this).remove();
			}
		});
		if (!succ) {
			addLog("Failed to remove event: " + event + " from " + allegiance);
			return;
		}
		current_gar = gar_events;
	}
	addLog("Removed event: " + event + " from " + allegiance);
}

let event_announced = false;
function event_cis() {
	if (current_cis.length == 0) {
		current_cis = cis_events;
	}
	if (event_announced) {
		return;
	}
	let event = current_cis[Math.floor(Math.random() * current_cis.length)];
	current_cis.splice(current_cis.indexOf(event), 1);
	event_announced = true;
	addLog(event);
	addAdvert(event);
}
function event_gar() {
	if (current_gar.length == 0) {
		current_gar = gar_events;
	}
	if (event_announced) {
		return;
	}
	let event = current_gar[Math.floor(Math.random() * current_gar.length)];
	current_gar.splice(current_gar.indexOf(event), 1);
	event_announced = true;
	addLog(event);
	addAdvert(event);
}

function conq_balance() {
	let cis_captured = 0;
	let gar_captured = 0;
	$(".capture_point").each(function() {
		let span = $(this).find("span");
		if (span.hasClass("cis")) {
			cis_captured++;
		} else if (span.hasClass("republic")) {
			gar_captured++;
		}
	});
	$("#gar_points").text(gar_captured);
	$("#cis_points").text(cis_captured);
	return (cis_captured - gar_captured) / 2;
}

function percent_think() {
	if (cis_percent == gar_percent) {
		if (cis_percent != ( max_percent + min_percent ) / 2) {
			cis_percent = ( max_percent + min_percent ) / 2;
			gar_percent = ( max_percent + min_percent ) / 2;
			addLog("CIS and GAR are equal, resetting to 50%");

			$("#gar_percent").text(gar_percent * 100 / max_percent);
			$("#cis_percent").text(cis_percent * 100 / max_percent);
		}
	}
	if (cis_percent == max_percent || gar_percent == max_percent) {
		console.log("Game over");
		return;
	}
	let balance = conq_balance();
	if (balance == 0) {
		setTimeout(update_percent, 1000);
		return;
	}
	cis_percent += balance; // balance is negative if gar is winning || +- = - | ++ = +
	gar_percent -= balance; // balance is positive if gar is winning || -- = + | -+ = -
	if (cis_percent < min_percent) {
		cis_percent = min_percent;
		gar_percent = max_percent;
		addLog("CIS is has lost all points, GAR wins");
	} else if (gar_percent < min_percent) {
		cis_percent = max_percent;
		gar_percent = min_percent;
		addLog("GAR has lost all points, CIS wins");
	} else if (cis_percent > max_percent) {
		cis_percent = max_percent;
		gar_percent = min_percent;
		addLog("CIS has won all points, CIS wins");
	} else if (gar_percent > max_percent) {
		cis_percent = min_percent;
		gar_percent = max_percent;
		addLog("GAR has won all points, GAR wins");
	}
	if (cis_percent == max_percent || gar_percent == max_percent) {
		addLog("Game over! " + (cis_percent == max_percent ? "CIS" : "GAR") + " wins");
		addAdvert("Game over! " + (cis_percent == max_percent ? "CIS" : "GAR") + " wins");
		return;
	}

	if (balance > 0) {
		addLog("CIS is winning, moving " + balance + " points ahead");
		if (cis_percent % 5 == 0) {
			if (!event_announced)
				event_cis();
		} else {
			event_announced = false;
		}
	} else {
		addLog("GAR is winning, moving " + balance + " points ahead");
		if (gar_percent % 5 == 0) {
			if (!event_announced)
				event_gar();
		} else {
			event_announced = false;
		}
	}

	$("#gar_percent").text(gar_percent * 100 / max_percent);
	$("#cis_percent").text(cis_percent * 100 / max_percent);

	$(".cis_percent").css("grid-column", "span " + (cis_percent * 100 / max_percent));
	$(".gar_percent").css("grid-column", "span " + (gar_percent * 100 / max_percent));

	setTimeout(update_percent, 1000);
}

function update_percent() {
	percent_think();
}

$().ready(function() {
	update_percent();
	// Setting up for when the user click on one of the .capture_point elements it changes allegiance
	$(".capture_point").click(function() {
		let span = $(this).find("span");
		let img = $(this).find("img");
		if (span.hasClass("cis")) {
			span.removeClass("cis");
			span.addClass("republic");
			span.html("Republic");
			img.attr("src", "./bf_follower/Republic_Emblem.svg");
			addLog("Changed allegiance of " + $(this).attr("id") + " to GAR");
			addAdvert("GAR has captured " + $(this).attr("id"));
		} else if (span.hasClass("republic")) {
			span.removeClass("republic");
			span.addClass("cis");
			span.html("CIS");
			img.attr("src", "./bf_follower/cis_emblem.png");
			addLog("Changed allegiance of " + $(this).attr("id") + " to CIS");
			addAdvert("CIS has captured " + $(this).attr("id"));
		}
	});
	$("#add_gar_event").click(function() {
		let event = $("#add_gar").val();
		if (event != "") {
			addEvent("gar", event);
		}
	});
	$("#add_cis_event").click(function() {
		let event = $("#add_cis").val();
		if (event != "") {
			addEvent("cis", event);
		}
	});

	default_events_cis.forEach(function(event) {
		addEvent("cis", event);
	});
	default_events_gar.forEach(function(event) {
		addEvent("gar", event);
	});
});
