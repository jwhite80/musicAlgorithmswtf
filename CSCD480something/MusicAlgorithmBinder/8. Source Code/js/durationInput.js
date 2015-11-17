
$(document).ready(function(){


	$('.duration_input').on('change', '[id^=dInput_set]', function() {	
		var $parentId =  $(this).closest('div[id]');
		var $area = $parentId.find('[id^=dAreaMap]');
		var $selectionBox = $parentId.find('[id^=dInput_set]');	
		var $selected = $selectionBox.find("option:selected");
		
		
		 //NOTE: The below segment will insert text into the text box when 'Custom' is selected. --Evan
		 //It matches the number of notes in pitch input, filling duration input with 1's
		if($selected.text() == "Custom")
		{
			
			var voiceCount = getVoiceNumber($parentId); //Number of voices currently active.
			
			//We want to count how many notes are in pitchinput so that we can fill the duration input with the right amount
			var pitchInputCount = getTextAreaData($('#areaPitch'+voiceCount)).length;
			
			var noteString = populateDurationCustomText(pitchInputCount);
			
			$area.val(noteString);
		}
		
	});
	
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
	$('.duration_input').on('change', '[id^=dInput_set], [id^=dAreaMap]', function() {
		var $parentId =  $(this).closest('div[id]');
		var currVoiceNum = getVoiceNumber($parentId);
		var $area = $parentId.find('[id^=dAreaMap]');	
		var $selected = $parentId.find("option:selected");
		

		tooltip($parentId);

		if($selected.text() == "Custom")
		{
			$area.prop("readonly", false);
			//alert("text area is editable");
		}
		else
		{
			$area.prop("readonly", true);
			//alert("text area is not editable");
		}

		validatePanel($area, getVoiceNumber($parentId));
		var $noteCount = getNoteCount($area);
		call_pitch($selected.text(),$noteCount,$area.attr('id'));
		var $pitId = $('#input_set'+currVoiceNum).closest('div[id]');
		var $pitArea = $pitId.find('[id^=areaPitch]');
		var $pitSelection = $pitId.find("option:selected");//.find('[id^=dInput_Set]');
		validatePanel($area, getVoiceNumber($parentId));
		call_pitch($pitSelection.text(),$noteCount,$pitArea.attr('id'));
		
		var $range = $(".duration_mapping").closest('div[id]').find('[id^=dRange]');
		var $to = $(".duration_mapping").closest('div[id]').find('[id^=dTo]');
		dWriteRangeOut($range.val(),$to.val(),currVoiceNum);
		call_dur_Mapping($(this).closest('div[id]'),currVoiceNum);
		call_pitch_Mapping($(this).closest('div[id]'),currVoiceNum);

		updateDurationMappingData($parentId,currVoiceNum);
		updateTooltipVals($parentId);
	});


	function tooltip($parentId){
		$infoTooltip = $parentId.find('[id^=durPitchInfo]');
		var $input = $parentId.find('[id^=dInput_set]');		
		var $selected = $input.find("option:selected");

		var tooltipText = information.getText($selected.text());
	
		$infoTooltip.attr("data-original-title",tooltipText); 
	}		
});



	
	
	

