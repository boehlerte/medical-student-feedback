$(document).ready(function() {
	url = $(location).attr('href');
	console.log(url);
	query = '/getSurvey' + url.split('html')[1];
	console.log(query);

	$.get(query, function(response) {
		render_survey(response);
	});

	$("body").on('click', '.survey-submit', function() {
		this_survey = $(this).parents('.survey');
		survey_response = collect_response(this_survey);
		console.log(survey_response);
		$.post('/logAssessment', JSON.stringify(survey_response), function(){ console.log("i think it was logged successfully"); }, "JSON");
	});
});


function confirm_selections(pid, parent_container) {
	evaluator_id = $(parent_container).find($("input[type=email]")).attr("evaluatorid");
	var selected_activities = [];
	($(parent_container).find($(".active"))).each(function(index, activity) {
		selected_activities.push($(activity).prop('id'));
		console.log('button id = ' + $(activity).prop('id'));
	});

	api_call = '/getSurvey?pid=' + pid + '&evid=' + evaluator_id + '&activities=' + selected_activities.join('-');
	$.get(api_call, function(response) {
		$(parent_container).attr('survey', response);
		console.log(response);
	});
	
}

function render_survey(survey_obj) {
	console.log(survey_obj);
	survey_obj = JSON.parse(survey_obj);
	individual_container = $('<div class="survey" id="survey-' + (survey_obj.evid) + '"></div>');
	text_field_name = $('<div class="observer-name">First Name: <input class="first-name" type="text" value="' + (survey_obj.first_name || "") + '"></input>Last Name: <input class="last-name" type="text" value="' + (survey_obj.last_name || "") + '"></input></div>');
	if ((survey_obj.first_name != null) && (survey_obj.last_name != null)) {
		$(text_field_name).find('input[type=text]').prop('disabled', true);
	}
	dropdown_position = $('<div class="observer-position">Position: <select id="position"><option>Resident</option><option>Faculty</option><option>Patient</option></select>')
	questions_container = $('<div class="questions"></div>');
	survey_obj.activities.forEach(function(activity) {
		question_and_responses = $('<div class="question-and-responses" activity_number=' + activity.aNum + '></div>');
		question_div = $('<div class="question">Level of Entrustability for ' + activity.aContent + '</div>');
		radio_set = $('<div class="radio-set"></div>');
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="0">N/A</input></div>'));
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="1">' + activity.c1Content + "</input></div>"));
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="2">' + activity.c2Content + "</input></div>"));
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="3">' + activity.c3Content + "</input></div>"));
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="4">' + activity.c4Content + "</input></div>"));
		$(radio_set).append($('<div class="radio-div"><input type="radio" name="' + survey_obj.evid + '-' + activity.aNum + '" value="5">' + activity.c5Content + "</input></div>"));
		text_response = $('<textarea class="comment" id="' + survey_obj.evid + '-' + activity.aNum + '" placeholder="Enter specific observations related to activity here."></textarea>');
		$(question_and_responses).append($(question_div));
		$(question_and_responses).append($(radio_set));
		$(question_and_responses).append($(text_response));
		$(questions_container).append($(question_and_responses));
	});
	$(individual_container).append($(text_field_name));
	$(individual_container).append($(dropdown_position));
	$(individual_container).append($(questions_container));
	$(individual_container).append($('<button class="survey-submit" id="submit-' + survey_obj.evid + '">Submit survey for ' + (survey_obj.name || survey_obj.email) + '</button>'));
	$("#survey-container").append($(individual_container));
}

function show_survey(id){
	console.log("show survey id: " + id);
	var survey_id = "survey-" + id;
	$(".survey").hide();
	$("#"+survey_id).show();
}

function collect_response() {
	survey_response = {};
	question_responses = [];
	survey_response.pid = pid;
	survey_response.evaluator_id = $('.survey').prop('id').split('-')[1];
	survey_response.evaluator_fname = $('.first-name').val();
	survey_response.evaluator_lname = $('.last-name').val();
	survey_response.evaluator_type = $('#position').val();
	$('.question-and-responses').each(function() {
		answer = {};
		answer.activity_id = $(this).attr('activity_number');
		answer.choice = $(this).find('input[type=radio]:checked').val();
		answer.comment = $(this).find('.comment').val();
		question_responses.push(answer);
	});
	survey_response.responses = question_responses;
	return survey_response;
}