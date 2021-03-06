////////////////////////////////////////////////inputs
//start global ************************************************************************************************
function defaultData(voiceIndex) {

	defaultPitch_Input(voiceIndex);
	defaultDuration_Input(voiceIndex);
}

function defaultPitch_Input(voiceIndex){
//default load  for Pitch_Input and Pitch_Mapping	
		var $voiceNum = $("#pitchPanel" + voiceIndex);
		var grandParent = $voiceNum.closest('div[class]').attr("class").split(" ")[0];

		var $nCount = $voiceNum.find('[id^=note_count]');
		var $area = $voiceNum.find('[id^=areaPitch]');

		//pitch_input
		call_pitch("Sine",24,$area.attr('id'));
		//writeNoteCount(24,$nCount.attr('id'));
		mapWriteOutput($nCount.attr('id'),24);
		//pitch_mapping
		writeRangeOut(1,88, voiceIndex);
		call_pitch_Mapping($voiceNum, voiceIndex);
}

function defaultDuration_Input(voiceIndex){	
		var $voiceNum = $("#dPitchPanel" + voiceIndex);
		//var grandParent = $voiceNum.closest('div[class]').attr("class").split(" ")[0];;

		var $idName = $voiceNum.attr("id");
		var $area = $voiceNum.find('[id^=dAreaMap]');

		//duration_input
		call_pitch("Quarter Notes",24,$area.attr('id'));//not reflecting duration input 

		//duration_mapping
		dWriteRangeOut(0,6, voiceIndex);
		call_dur_Mapping($voiceNum, voiceIndex);		
}

function call_pitch(userChoice,noteCount,areaN){// areaN = text area to write to, section?
	
	var selectedAlgorithm = algorithmFactory.createSequence(userChoice);//get from user
	musicAlgorithms.setAlgorithm(selectedAlgorithm);
	var currData = musicAlgorithms.getValues(noteCount);
	
	if(userChoice != "Custom")
	{
		mapWriteOutput(areaN,currData);		
	}	
}

function writeNoteCount(count,areaN){// what is this for? Not necessary
	$(".pitch_input #"+areaN).val(count);
}

function mapWriteOutput($textArea,data){ // text area is passed in as text. should be the text area itself
	$("#"+$textArea).val(data);
}

function getNoteCount(textArea){
	var voiceNum = getVoiceNumber(textArea);
	return $('#note_count'+voiceNum).val();;
}

//This grabs values out of the text box, strips negatives and and spaces, and splits by the comma delimiter.
function getTextAreaData(textArea){

	var value = textArea.val(); //value is a String
	if(value.length > 0) {
	value = value.replace(/,,/g,''); 
	value = value.split(",").map(Number); //value is now an array
	var newData = new Array();

	for(var i = 0; i < value.length; i++)
	{
		if(!isNaN(value[i]))
			newData.push(value[i]);
	}
	
	return newData;
	}
	else {
		value = [];
		return value;
	}
}

function getDataArray(textArea){
	var $noteCount = $("#note_count"+getVoiceNumber(textArea));
	
	var value = textArea.val();
	value = value.replace(/,,/g,'');
	value = value.split(",").map(Number);
	
	return value.slice(0, $noteCount.val());
}

function validatePanel(textArea, voiceNum){
	validateTextArea(textArea);
	validateNoteCount(textArea, voiceNum); 
}

//This function checks the values in the text area
function validateTextArea(textArea){
	var data = getTextAreaData(textArea);
	var newData = new Array();
	var isValid = true; //Not sure if this value actually does anything --Evan
	for(var i = 0; i < data.length; i++)
	{
		if(isNaN(data[i]))
		{
			isValid = false;
		}
		else
		{
			newData.push(data[i]);
		}
	}
	printArray(textArea, newData); 
}

function validateNoteCount(textArea, voiceNum){ 	//check the text area against the note count box
	var data = getTextAreaData(textArea); 			//Grabs stuff from text box
	var $inputBox = $("#note_count"+voiceNum); 		//Grabs stuff from the note count

	if($inputBox.val() != data.length) 				//If the note count does not match the length of data from the text box...
	{
		var pitchInputCount = getTextAreaData($('#areaPitch'+voiceNum)).length; //the true length of the text area(the number of notes)
		var durationInputCount = getTextAreaData($('#dAreaMap'+voiceNum)).length;
		
		//Make sure note count doesn't exceed cap
		if(pitchInputCount > 2000)
		{
			pitchInputCount = 2000;
		}
		if(durationInputCount > 2000)
		{
			durationInputCount = 2000;
		}
		var pitchSelection = $('#input_set'+voiceNum+'').find('option:selected').text(); //[CHANGED]
		var durationSelection = $('#dInput_set'+voiceNum).find('option:selected').text();

		if(pitchSelection == "Custom" && durationSelection == "Custom")
		{
			if(pitchInputCount < durationInputCount)
				$inputBox.val(pitchInputCount);
			else
				$inputBox.val(durationInputCount);
		}
		else if(pitchSelection == "Custom" && durationSelection != "Custom")
		{
			$inputBox.val(pitchInputCount);
		}
		else if(pitchSelection != "Custom" && durationSelection == "Custom")
		{
			$inputBox.val(durationInputCount);
		}
	
	} 
}

function printArray(textArea, data){
	var csv = "";
	for(var i = 0; i < data.length - 1; i++)
	{
		csv += data[i] + ",";
	}
	if(data.length > 0)
	{
		csv += data[data.length - 1];
		textArea.val(csv);
	}
	else
	{
		textArea.text();
	}
}

function getVoiceNumber($parentId){
	var $idName = $parentId.attr("id");	
	return $idName.substring($idName.length-1,$idName.length); //returns voice number
}
//pitch input

////////////////////////////////////////////////////////////////////end inputs/////////////////////////
//start mapping area
function call_pitch_Mapping($parentId,voiceNum){ //$voiceNum makes no sense. currVoice should be voiceNum
	//var $noteCount = $parentId.find('[id^=note_count]');
//	validatePanel($("#areaPitch"+voiceNum), voiceNum);
	var $algorithmChosen = $parentId.find('[id^=input_set]');
	var $selectedUserChoice = $("#input_set").find("option:selected");;//$algorithmChosen.find("option:selected");
	//current voice for mapping
	var $currMapPanel = $("#mappingPanel"+voiceNum);
	var $selectedMapPanel = $currMapPanel.find('[id^=compressType]');
	var $compressChoice = $selectedMapPanel.find("option:selected");
	var $range = $currMapPanel.find('[id^=range]');
	var $to = $currMapPanel.find('[id^=to]');
	var $currArea = $currMapPanel.find("#mapArea"+voiceNum);
	var selectedAlgorithm = algorithmFactory.createSequence($selectedUserChoice.text());
	musicAlgorithms.setAlgorithm(selectedAlgorithm);
	var normalizeChoice = normalizeFactory.createNormalizer($compressChoice.text());//factory
	musicNormalize.setAlgorithm(normalizeChoice);
	var currData = getDataArray($("#areaPitch"+voiceNum));//= musicAlgorithms.getValues($noteCount.val());//get value from Input
	var transformedData = musicNormalize.normalize(currData,$range.val(),$to.val());
	mapWriteOutput($currArea.attr("id"),transformedData);	
	doScaleOptions(voiceNum);
}
//2,7,1,8,2,8,1,8,2,8,4,5,9,0,4,5,2,3,5,3,6,0,2,8
function call_dur_Mapping($parentId,currVoice){
//	validatePanel($("#dAreaMap"+currVoice), currVoice);
	var $noteCount = $("#note_count"+currVoice);
	var $algorithmChosen = $parentId.find('[id^=dInput_set]');
	var $selectedUserChoice = $algorithmChosen.find("option:selected");
	//current voice for mapping
	var $currMapPanel = $("#dMappingPanel"+currVoice);
	var $selectedMapPanel = $currMapPanel.find('[id^=dCompressType]');
	var $compressChoice = $selectedMapPanel.find("option:selected");
	var $range = $currMapPanel.find('[id^=dRange]');
	var $to = $currMapPanel.find('[id^=dTo]');
	var $currArea = $currMapPanel.find("#dMapArea"+currVoice);
	var selectedAlgorithm = algorithmFactory.createSequence($selectedUserChoice.text());
	musicAlgorithms.setAlgorithm(selectedAlgorithm);
	var normalizeChoice = normalizeFactory.createNormalizer($compressChoice.text());//factory
	musicNormalize.setAlgorithm(normalizeChoice);
	var currData = getDataArray($("#dAreaMap"+currVoice));//musicAlgorithms.getValues($noteCount.val());//get value from Input
	var transformedData = musicNormalize.normalize(currData,$range.val(),$to.val());
	mapWriteOutput($currArea.attr("id"),transformedData);
}

function writeRangeOut(range,to,i){
	var $currMapPanel = $('#mappingPanel'+i);
	var $range = $currMapPanel.find('[id^=range]');
	var $to = $currMapPanel.find('[id^=to]');
	$range.val(range);
	$to.val(to);
}

function dWriteRangeOut(range,to,i){
	var $currMapPanel = $('#dMappingPanel'+i);
	var $range = $currMapPanel.find('[id^=dRange]');
	var $to = $currMapPanel.find('[id^=dTo]');
	$range.val(range);
	$to.val(to);
}



//end mapping area

//Used in Pitch_mapping and Duration_mapping
function replaceValue($parentId){	
		var $textArea = $parentId.find("textarea");
		var currentData = $textArea.val().split(",");
		
		var $inputList = $parentId.find("input");

		var $range = $inputList.filter(function() {
			return this.id.match(/[Rr]ange\d+$/);
		});
		var $to = $inputList.filter(function() {
			return this.id.match(/[Tt]o\d+$/);
		});

	
		var $modiAll = $inputList.filter(function() {
			return this.id.match(/[Mm]odiAll\d+$/);
		});			
		var $modiWith = $inputList.filter(function() {
			return this.id.match(/[Mm]odiWith\d+$/);
		});


	 
		var fieldCheck = !isNaN(parseInt($modiAll.val())) && !isNaN(parseInt($modiWith.val()));
		var replaceValInlist = -1 < currentData.indexOf($modiAll.val());


		var withinRange = (parseInt($range.val()) <= parseInt($modiAll.val()) && parseInt($modiAll.val()) <= parseInt($to.val())) && (((parseInt($range.val())) <= parseInt($modiWith.val()) || parseInt($modiWith.val()) === 0) && parseInt($modiWith.val()) <= parseInt($to.val())) 
	
		
		if(fieldCheck && replaceValInlist && withinRange ){
			
			for(var i = 0; i< currentData.length; i++){
				if(currentData[i] == parseInt($modiAll.val())){
					currentData[i] = parseInt($modiWith.val())
				}
			}		

			mapWriteOutput($textArea.attr("id"),currentData);
			
			var stringArray = $textArea.attr("id").split('');
			doScaleOptions(stringArray[stringArray.length - 1]);/* This takes the mapArea id,
            which has a number at the end of the textArea.attr('id') that is associated
            with the voice that is being modified. This gets split into a char array and 
            since the voice number is at the end of the array, we can send the voice id to 
            do scales options method which allows the pitch mapping to be updated in the
            scale options tab.*/
	
		}
		else{
			showWarning($parentId,fieldCheck,replaceValInlist,withinRange);
		}

	}


function showWarning($parentId,fieldCheck,replaceValInlist,withinRange){
//	alert(fieldCheck+","+replaceValInlist+","+withinRange);
	var $button = $parentId.find("button");

	if(!fieldCheck){
		$button.attr("data-content","Please fill \"Modifications\" section with a value to modify output values.");

	}
	else{
		if(!replaceValInlist){
			$button.attr("data-content","The value you are replacing is not found in the output value list." );
		}

		
		if(!withinRange){
			$button.attr("data-content","Please make sure your values are within range.");
		}

	}

	$button.popover("show");
	setTimeout(function(){$button.popover("hide")},3500);		
}


function updateTooltipVals($parent){
	var targetArea;
	var $textArea =  $parent.find("textarea");
	var $textAreaId = $textArea.attr("id");
	var voiceCount = getVoiceNumber($parent);

	if("areaPitch" === $textAreaId.substring(0,$textAreaId.length-1)){
		targetArea = "mapArea"+voiceCount;
	}	
	else{
		targetArea = "dMapArea"+voiceCount;
	}

//	alert($textAreaId+","+targetArea+":"+$textArea.val());

	$("#"+targetArea).popover("hide");
	$("#"+targetArea).attr("data-content","<textarea readonly>"+$textArea.val()+"</textarea>");	
}


function disableAllVoices(boolean){	
	var voicePanels = $('textarea,select,[id^=modify],[id^=dModify],[id^=note_count],[id^=range],[id^=to],[id^=dRange],[id^=dTo],[id^=modiAll],[id^=modiWith],[id^=dModiAll],[id^=dModiWith],.player-play');

	if(boolean){	
		voicePanels.prop('disabled',true);
	}
	else{
		voicePanels.prop('disabled',false);
	}
}




///end global****************************************************************************************



$(document).ready(function(){
	// This only happens on init
	var voiceCount = 1;
	changeVoiceCount(22, voiceCount);
	
	// This happens when you change the voice count
	$("#welcomeChoice").change(function () 
	{
		var oldVoiceCount = voiceCount;
		voiceCount = +$(this).find('option:selected').text();

		changeVoiceCount(oldVoiceCount, voiceCount);
		
		if($("#tabs_container").css('visibility') != "hidden")
			$("#options ul li").find("#tab").click();
			
		$(".choose-instrument").find("select").each(function() {
				$(this).change();
		});
	});

	
function changeVoiceCount(previousCount, currentCount){
	if(previousCount == 22) // Init
	{
		pitchInput(1);
		durationInput(1);
		pitchMapping(1);
		durationMapping(1);
		scaleOptions(1);
		play(1);
		defaultData(1);
	}
	else if(previousCount > currentCount) // Remove voice
	{
		var amountToRemove = previousCount - currentCount;
		for(var i = previousCount; i > currentCount; i--)
		{
			removeVoice(i);
		}
	}
	else // Add voice
	{
		var amountToAdd = currentCount - previousCount;
		for(var i = 1; i <= amountToAdd; i++)
		{
			pitchInput(+previousCount + +i);
			durationInput(+previousCount + +i);
			pitchMapping(+previousCount + +i);
			durationMapping(+previousCount + +i);
			scaleOptions(+previousCount + +i);
			play(+previousCount + +i);
			defaultData(+previousCount + +i);
		}
	}
	displayImage();
	getOutput();
}	

function removeVoice(voiceIndex){
	$( ("#pitchPanel" + voiceIndex) ).remove();
	$( ("#mappingPanel" + voiceIndex) ).remove();
	$( ("#dPitchPanel" + voiceIndex) ).remove();
	$( ("#dMappingPanel" + voiceIndex) ).remove();
	$( ("#scaleOptionsPanel" + voiceIndex) ).remove();
	$( ("#voiceContainer" + voiceIndex) ).remove();
}

function pitchInput(voiceCount){
		var $voice ="\
		<div id='pitchPanel"+voiceCount+"' class='full_view well well-sm'>\
			<fieldset>\
				<legend><h3>Voice "+voiceCount+"</h3></legend>\
				<label for='inputSet'>Input Set:</label>\
					<select id='input_set"+voiceCount+"' name='inputSet' >\
					<option>Sine</option>\
					<option>Fibonacci</option>\
					<option>Integers</option>\
					<option>Pascal</option>\
					<option>Phi</option>\
					<option>Pi</option>\
					<option>Powers</option>\
					<option>E Constant</option>\
					<option>Custom</option>\
				</select>\
				<img id='pitchInfo"+voiceCount+"'> \
				<label >Note Count:</label>\
				<input type='text' id='note_count"+voiceCount+"'></input><br>\
				<label>Input:</label><br>\
				<textarea readonly id='areaPitch"+voiceCount+"'></textarea>\
			</fieldset>\
		</div>\
		";

		$( ".pitch_input" ).append( $voice );
}

function durationInput(voiceCount){
		var $voice ="\
		<div id='dPitchPanel"+voiceCount+"' class='full_view well well-sm'>\
			<fieldset>\
				<legend><h3>Voice "+voiceCount+"</h3></legend>\
					<label>Input Set:</label>\
					<select id='dInput_set"+voiceCount+"' name='inputSet' >\
					<option>Quarter Notes</option>\
					<option>Sine</option>\
					<option>Fibonacci</option>\
					<option>Integers</option>\
					<option>Pascal</option>\
					<option>Phi</option>\
					<option>Pi</option>\
					<option>Powers</option>\
					<option>E Constant</option>\
					<option>Custom</option>\
				</select>\
				<img id='durPitchInfo"+voiceCount+"'> \
				<label>Input:</label><br>\
				<textarea readonly id='dAreaMap"+voiceCount+"'></textarea>\
			</fieldset>\
		</div>\
		";
		$( ".duration_input" ).append( $voice );
}

function pitchMapping(voiceCount){
		var $voice ="\
		<div id='mappingPanel"+voiceCount+"' class='full_view well well-sm'>\
			<fieldset>\
				<legend><h3>Voice "+voiceCount+"</h3></legend>\
				<label>Mapping using:</label>\
				<select id='compressType"+voiceCount+"'>\
					<option>Division</option>\
					<option>Logarithmic</option>\
					<option>Modulo</option>\
				</select>\
				<img id='pitchMapInfo"+voiceCount+"'> \
				<br /><label>Range:</label><input type='number' id='range"+voiceCount+"' name='Range'>\
				<label>to:</label><input type='number' id='to"+voiceCount+"' name='to'>\
				<img  id='pRangeImg"+voiceCount+"'>\
				<br /><label>Output:</label>\
				<textarea readonly id='mapArea"+voiceCount+"'></textarea>\
				<fieldset>\
					<legend>Modifications</legend>\
					<label>Replace all:</label><input type='text' id='modiAll"+voiceCount+"' >\
					<label>with:</label><input type='text' id='modiWith"+voiceCount+"'>\
			<!--		<input name='addSilence' type='checkbox'><label>Add Silence</label>\
					<label>Value of silence:</label><input type='text' name='valueSilence' >\
					<img id='silenceImg"+voiceCount+"'>\
			-->		<br /><button type='button' id='modify"+voiceCount+"' value='Modify'>Modify Output</button>\
				</fieldset>\
			</fieldset>\
		</div>\
		";
		$( ".pitch_mapping" ).append( $voice );
}

function durationMapping(voiceCount){
		var $voice ="\
		<div id='dMappingPanel"+voiceCount+"' class='full_view well well-sm'>\
			<fieldset>\
				<legend><h3>Voice "+voiceCount+"</h3></legend>\
				<label>Mapping using:</label>\
				<select id='dCompressType"+voiceCount+"'>\
					<option>Division</option>\
					<option>Logarithmic</option>\
					<option>Modulo</option>\
				</select>\
				<img id='durMapInfo"+voiceCount+"'> \
				<br /><label>Range:</label><input type='number' id='dRange"+voiceCount+"' name='Range'>\
				<label>to:</label><input type='number' id='dTo"+voiceCount+"' name='to'>\
				<img  id='dRangeImg"+voiceCount+"'>\
				<br /><label>Output:</label>\
				<textarea readonly id='dMapArea"+voiceCount+"'></textarea>\
				<fieldset>\
					<legend>Modifications</legend>\
					<label>Replace all:</label><input type='text' id='dModiAll"+voiceCount+"' >\
					<label>with:</label><input type='text' id='dModiWith"+voiceCount+"'>\
					<br /><button type='button' id='dModify"+voiceCount+"' value='Modify'>Modify Output</button>\
				</fieldset>\
			</fieldset>\
		</div>\
		";
		$( ".duration_mapping" ).append( $voice );
}

function scaleOptions(voiceCount){
		var $voice ="\
		<div id='scaleOptionsPanel"+voiceCount+"' class='full_view well well-sm'>\
			<fieldset>\
				<legend><h3>Voice "+voiceCount+"</h3></legend>\
				<label>Scale By:</label>\
				<select id='so_scale_options"+voiceCount+"'>\
					<option>Chromatic</option>\
					<option>Blues</option>\
					<option>Major</option>\
					<option>Minor</option>\
					<option>Pentatonic1</option>\
					<option>Pentatonic2</option>\
					<option>Whole Tone</option>\
					<option>Morph</option>\
				</select>\
				<label>Key:</label>\
				<select id='so_key_options"+voiceCount+"'>\
					<option>C</option>\
					<option>C&#9839;/D&#9837;</option>\
					<option>D</option>\
					<option>D&#9839;/E&#9837;</option>\
					<option>E</option>\
					<option>F</option>\
					<option>F&#9839;/G&#9837;</option>\
					<option>G</option>\
					<option>G&#9839;/A&#9837;</option>\
					<option>A</option>\
					<option>A&#9839;/B&#9837;</option>\
					<option>B</option>\
				</select>\
				<label>Output:</label><br />\
				<textarea readonly id='so_text_area"+voiceCount+"'></textarea>\
			</fieldset>\
		</div>\
		";
		$( ".scale_options" ).append( $voice );
}

function play(voiceCount){
		var $voice="\
		<div class='voice cf' id='voiceContainer"+voiceCount+"'>\
			<div class='play_voiceStyle cf'><label style='float:left;'>Pitch: </label>\
			\
			<div class='overflowDiv'> \
			<input type='text' class='outputRight' id='voice"+voiceCount+"_pitch' disabled >\
			</div> \
			\
			<input type='text' class='cur' id='voice"+voiceCount+"_curpitch' disabled > \
			\
			<div class='overflowDiv'> \
			<input type='text' class='outputLeft' id='voice"+voiceCount+"_pitchplayed'  disabled ></div> \
			</div> \
			\
			\
			<div class='play_voiceStyle cf'><label style='float:left;'>Duration: </label> \
			\
			<div class='overflowDiv'> \
			<input type='text' class='outputRight duration' id='voice"+voiceCount+"_duration' disabled> \
			</div> \
			\
			<input type='text' class='cur'id='voice"+voiceCount+"_curduration' disabled >\
			\
			<div class='overflowDiv'> \
			<input type='text' class='outputLeft duration' id='voice"+voiceCount+"_durationplayed' disabled></div>\
			</div>\
			\
			<div class='choose-mute'>Mute Track: <input type='checkbox' name='mute' id='mute"+voiceCount+"' onclick='muteTrack($(this))'></div>\
				<div class='choose-instrument'>Instrument: <select class='instrument"+voiceCount+"' onchange='selectInstrument("+voiceCount+")'>\
					<option>Piano</option>\
					<option>Guitar</option>\
					<option>Bass</option>\
					<option>Alto Sax</option>\
					<option>Violin</option>\
					<option>Trumpet</option>\
					<option>Synth Drum</option>\
				</select></div>\
			</div>\
			";
		
			$("#voice_container_div").append($voice);
			var width=90/(+$(this).find('option:selected').text())+"%";
}

function displayImage(){//name could change			
	$(".full_view").each(function(){//Gives every image in the index an image 
		var $parentId = $(this)
		var $img = $parentId.find("img");
		var $modifyButton = $parentId.find("button");
		var noteCount = $("[id^=note_count]");

		//Note: "Undefined" not being checked because it does not seem to produce an error in jquery.  
		$img.attr({src:"images/info.png"});
		$img.tooltip({title:"Default",placement:"right",
		html:"true"});
		
		$modifyButton.popover({title:"Attention!",placement:"top",
		html:"true",content:"Default",trigger:"manual"});

		noteCount.tooltip({title:"Max note count is 2000",placement:"top"});

		initialInfo($parentId);	
	});

	popoverPitchValue();
}

function popoverPitchValue(){
	$("textarea").filter(function(){ 
		return this.id.match(/\w+apArea\d+$/);
	}).each(function(){
		var $parent= $(this).closest("div[id]");
		var $voice = $parent.find('h3');
		var targetArea;
		var $textAreaId = $parent.find("textarea").attr("id");
		var voiceCount = getVoiceNumber($parent);
		var voiceName;

		if("mapArea" === $textAreaId.substring(0,$textAreaId.length-1)){
			targetArea = "areaPitch"+voiceCount;
			voiceName = "Pitch Input";
		}	
		else{
			targetArea = "dAreaMap"+voiceCount;
			voiceName = "Duration Input";
		}
	

		$(this).popover({trigger: 'focus', title:$voice.text()+" "+voiceName,placement:"top",
		html:"true",content:"<textarea  readonly>"+$("#"+targetArea).val()+"</textarea>"});	

		$(this).tooltip({title:"Click text area",placement:"bottom"});		
	});
}


function initialInfo($parentId){
	var groupImg = $parentId.find("img");
	var imgCount = groupImg.length;
	var tooltip;

	if(imgCount > 0){
		var $currInfo = groupImg.filter(function() {
			return this.id.match(/\w+Info\d+$/);
		});

		var $selectedBox = $parentId.find("select");
		var $selected = $selectedBox.find("option:selected");

		tooltip = information.getText($selected.text());
		$currInfo.attr("data-original-title",tooltip);
	}

	if(imgCount == 3 || imgCount == 2 ){
		var $currRangeInfo = groupImg.filter(function() {
			return this.id.match(/\w+RangeImg\d+$/);
		});

		if(imgCount == 3){					
			tooltip = information.getText("PitchMap");
		}
		else
		{
			tooltip = information.getText("durationMap");
		}		

		$currRangeInfo.attr("data-original-title",tooltip);
	}


	if(imgCount > 2){
		var $silenceInfo = groupImg.filter(function() {
			return this.id.match(/silenceImg\d+$/);
		});

		tooltip = information.getText("silence");
		$silenceInfo.attr("data-original-title",tooltip);
	}
}
});
	
	
	

