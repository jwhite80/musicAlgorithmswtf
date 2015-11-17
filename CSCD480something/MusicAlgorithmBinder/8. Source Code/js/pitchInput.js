
$(document).ready(function(){
	
	//Could be removed? -- Evan
	// This event must be separate to clear the text box if custom is selected
	$('.pitch_input').on('change', '[id^=input_set]', function() {	
		var $parentId =  $(this).closest('div[id]');
		var $area = $parentId.find('[id^=areaPitch]');
		var $selectionBox = $parentId.find('[id^=input_set]');	
		var $selected = $selectionBox.find("option:selected");
		
		//NOTE: This segment below will fill the text box with content once the Custom setting is selected --Evan
		if($selected.text() == "Custom")
		{
			$area.val("");		
		}
	});
	
	//This event gets thrown when the selected input algorithm changes (there is no on input event for listboxes, so this method had to be created)
	$('.pitch_input').on('change', '[id^=input_set]', function() {
		var $parentId =  $(this).closest('div[id]');
		var $countId = $parentId.find('[id^=note_count]');
		var $area = $parentId.find('[id^=areaPitch]');	
		var $selectionBox = $parentId.find('[id^=input_set]');	
		var $selected = $selectionBox.find("option:selected");
		var voiceNumber = getVoiceNumber($parentId); //All of this stuff is needed for logic.
		
		if($selected.text() == "Custom") {
			$area.prop("readonly", false);
			//Possibly make text box blank here instead of new method
		}
		else {
			$area.prop("readonly", true);
		}
		
		validatePanel($area, getVoiceNumber($parentId));
		
		var $durId = $('#dInput_set'+voiceNumber).closest('div[id]');
		var $durArea = $durId.find('[id^=dAreaMap]');
		var $durSelectionBox = $durId.find('[id^=dInput_set]');
		var $durSelection = $durSelectionBox.find("option:selected");
		
		call_pitch($selected.text(),$countId.val(),$area.attr('id')); 		//Gets the appropriate numbers from selected algorithm and fills text box with the right amount.
		call_pitch($durSelection.text(),$countId.val(),$durArea.attr('id'));
		
		updatePitchMapData($parentId,voiceNumber);
		updateTooltipVals($parentId);
		updateDurationMapTooltip($parentId);
	});

	//This event gets thrown when the text area (container for note values) is changed. This should only happen after user types with Custom enabled.
	$('.pitch_input').on('change', '[id^=areaPitch]', function () {
		var $parentId =  $(this).closest('div[id]');
		var $countId = $parentId.find('[id^=note_count]');
		var $area = $parentId.find('[id^=areaPitch]');	
		var $selectionBox = $parentId.find('[id^=input_set]');	
		var $selected = $selectionBox.find("option:selected");
		var voiceNumber = getVoiceNumber($parentId);
		var $durId = $('#dInput_set'+voiceNumber).closest('div[id]');
		var $durArea = $durId.find('[id^=dAreaMap]');
		var $durSelectionBox = $durId.find('[id^=dInput_set]');
		var $durSelection = $durSelectionBox.find("option:selected");
		
		tooltip($parentId);
		
		if($durSelection.text() == "Custom") { //We want to make sure that if duration input is on custom, the number of default values is kept in line with pitch input
			$durArea.val(populateDurationCustomText(getTextAreaData($('#areaPitch'+voiceNumber)).length));
		}
		
		validatePanel($area, getVoiceNumber($parentId));

		call_pitch($durSelection.text(),$countId.val(),$durArea.attr('id'));
		
		updatePitchMapData($parentId,voiceNumber);
		updateTooltipVals($parentId);
		updateDurationMapTooltip($parentId);
	})
	
	//This event gets thrown when the note count changes, it gets thrown as the user types.
	$('.pitch_input').on('input', '[id^=note_count]', function() {	
		var $parentId =  $(this).closest('div[id]');
		var $countId = $parentId.find('[id^=note_count]');
		var $area = $parentId.find('[id^=areaPitch]');	
		var $selectionBox = $parentId.find('[id^=input_set]');	
		var $selected = $selectionBox.find("option:selected");
		var voiceNumber = getVoiceNumber($parentId);
		var $durId = $('#dInput_set'+voiceNumber).closest('div[id]');
		var $durArea = $durId.find('[id^=dAreaMap]');
		var $durSelectionBox = $durId.find('[id^=dInput_set]');
		var $durSelection = $durSelectionBox.find("option:selected");
		
		tooltip($parentId);
		noteCountTest($countId);
		
		if($durSelection.text() == "Custom") { //We want to make sure that if duration input is on custom, the number of default values is kept in line with pitch input
			$durArea.val(populateDurationCustomText($countId.val()));
		}
		
		validatePanel($area, getVoiceNumber($parentId));

		call_pitch($selected.text(),$countId.val(),$area.attr('id')); 	
		call_pitch($durSelection.text(),$countId.val(),$durArea.attr('id'));
		
		updatePitchMapData($parentId,voiceNumber);
		updateTooltipVals($parentId);
		updateDurationMapTooltip($parentId);
	});
	
	
	
	function tooltip($parentId){
		$infoTooltip = $parentId.find('[id^=pitchInfo]');
		var $input = $parentId.find('[id^=input_set]');		
		var $selected = $input.find("option:selected");
		var tooltipText = information.getText($selected.text());
	
		$infoTooltip.attr("data-original-title",tooltipText); 
	}		
	//Ensures that the note count is not higher than the cap (2000) or less than zero
	function noteCountTest($countId){
		var maxNoteCount = 2000;
		var defaultCount = 24;
		var noteVal = $countId.val();	

		if(noteVal < 0 || noteVal > maxNoteCount){
			$countId.val(defaultCount);
		}
	}
	
	//NOTE: THIS FUNCTION ALSO EXISTS IN durationInput.js, BUT FOR SOME REASON THE FUNCTION IS NOT GLOBAL.
	//This function fills the durationInput textbox with the appropriate number of notes (1 by default) in order to match the number of notes in the pitch section.
	function populateDurationCustomText(noteCount) {
		var noteString = "";
			for(var i = 0; i < noteCount - 1; i++)
			{
				noteString += 1 + ",";
			}	
			
			if(noteCount > 0)
			{
				noteString += "1";
			}
		return noteString;		
	}//end function

});



	
	
	

