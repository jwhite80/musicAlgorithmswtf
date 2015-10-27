//Algorithm Strategy section*******************************************************************************************************************************


//Division class
var Division = function(){
	
	this.normalize = function(data,minValue,maxValue)
	{
	    var resolution = 0; // This is the variable used for creating the translation list.
	    var translationList = new Array();// This array contains a translationlist with original values mapped to translated values.
	    var finalTranslation = new Array();// This is the data array translated to the new translated values.

	    var keyboardRange = Range(minValue, maxValue); // This is the range used to determine how many keys are playable.
	    var algorithmInput = 0;// This is a variable that gets range of variation from the data array.

	    var minimumDataValue = Math.min.apply(Math, data);
	    var maximumDataValue = Math.max.apply(Math, data);
	    
	    if (minimumDataValue < 0)
	    {// if there are negative values, this is called. It's a special case.
	        algorithmInput = NegativeRange(minimumDataValue, maximumDataValue);
	    }
	    else
	    {
	        algorithmInput = PositiveRange(minimumDataValue, maximumDataValue);
	    }

	    if(maximumDataValue <= maxValue && algorithmInput < keyboardRange)
	    {
	        resolution = keyboardRange / algorithmInput;

	        if(resolution === 0)
	        {// if the resolution is 0, it must change to 1 in order to make the translation happen. 
	            resolution = 1;
	        }
	    }
	    else
	    {
	        resolution = keyboardRange / algorithmInput;
	    }

	    translationList = CreateTranslationTable(minimumDataValue, algorithmInput, resolution); // This creates the translation table array.
	    finalTranslation = CreateFinalList(data,translationList);// this provides the final output.
	    
	    return finalTranslation;
	};
	
	/*
	This method creates the final list. It utilizes a Finder method that takes the raw data and matches values in the translation 
	table and moves the translation value to a new array that will be returned as finalTranslation.
	*/
	function CreateFinalList(originalList,translatedList)
	{
	    var temporaryList = new Array();

	    for(var x = 0; x < originalList.length; x++)
	    {
	        temporaryList.push(parseInt(Finder(translatedList,originalList[x])));
	    }
	    return temporaryList;
	}
	/*
	Finder is used to help create the finalTranslation array.
	*/
	function Finder(translatedTable, value)
	{
	    var counter = 0;

	    while(value !== translatedTable[counter].originalValue)
	    {
	        counter++;
	    }

	    return translatedTable[counter].translatedValue;
	}
	/*
	This creates a list of all possible values in the range specified by the raw data array. It assigns a value to each 
	of these values and then an object is created to contain dependant values. Original -> Translation.
	*/
	function CreateTranslationTable(min, range, unit)
	{
	    var temporaryList = new Array();
	    incrementor = min;

	    for(var x = 0; x < range; x++)
	    {
	        temporaryList.push(new TranslationKey(incrementor, x * unit));
	        incrementor++;
	    }
	    return temporaryList;
	}
    /*
        Range method gets range from keyboard and duration values.
    */
	function Range(min, max) {
	    return (max - min) + 1;
	}

    /*
        NegativeRange and PositiveRange methods are for building translation table.
    */
	function NegativeRange(min, max){
	    return (min * -1) + (max + 1);
	}

	function PositiveRange(min, max){
	    return (max + 1) - min;
	}
};

/*
Translation object for division class. original is the key, translatedvalue is new value per
constraints.
*/
function TranslationKey(original, translation) {
    this.originalValue = original;
    this.translatedValue = translation;
}

//Modulo class
var Modulo = function(){
	
	this.normalize = function(data,minValue,maxValue)
	{	
		var _value = new Array();// the array that will contained modded values 		
		var modNum = maxValue - minValue + 1;// This is the value retrieved from the keyboard or duration values. It is the max basically.
		
		for(var i = 0; i < data.length; i++)
		{
		    if(data[i] < 0)
		    {// This deals with values that are negative. Technically, negative values can't be modulo'd in programming, but it is legit in math
		        _value.push(parseInt((data[i] * -1) % modNum));
		    }
		    else {
		        _value.push(parseInt(data[i] % modNum));
		    }
		}		
		
		return _value;
	};	
};


//Logarithmic class
var Logarithmic = function(){
	
	this.normalize = function(data,minValue,maxValue)
	{
		var dataMin = Math.min.apply(Math,data);
		var dataMax = 0.0000000001;//min number greater than zero
		var _value = new Array();		
  		  
		//scale to positives and take log
		for (var i=0; i < data.length;i++)
		{
			_value.push(Math.log(data[i] - dataMin + 1));
		}	

		
		var maxInValue = Math.max.apply(Math,_value);
		dataMax =  maxInValue < dataMax ? dataMax : maxInValue;   

		
		for (var i=0; i < _value.length;i++)
		{
			_value[i] *= (maxValue - minValue)/ dataMax;
			_value[i] = parseInt(Math.round(_value[i]) + +minValue);
		}

		return _value; 		
	};	
	
};



//End of Algorithm Strategy section***********************************************************************************************************************

//START SIMPLE FACTORY PATTERN ##############################################################################################################################

//Instantiate new object and return according to case
var NormalizeFactory = function(choosenStrategy){

	this.createNormalizer = function(choosenStrategy){
			
		switch(choosenStrategy){
			case "Division":
					return new Division();
			case "Modulo":
					return new Modulo();							
			case "Logarithmic":
					return new Logarithmic();			
		}
	
		return "Error";	
	};
};

//END SIMPLE FACTORY PATTERN ##############################################################################################################################

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
//NO NEED TO MODIFY THIS SECTION
var MusicNormalize = function(){
	this.strategy="";
}; 

//The MusicAlgorithm class inherits an object
MusicNormalize.prototype = {
	//The context in which we use our different algorithms. 
	setAlgorithm: function(strategy){
		this.strategy = strategy;
	},

	normalize:function(data,minValue,maxValue){
		return this.strategy.normalize(data,minValue,maxValue);
	}	
};



var musicNormalize = new MusicNormalize();
var normalizeFactory = new NormalizeFactory();
//NO NEED TO MODIFY THIS SECTION
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


function testNormalizeScale(){
/*
	var selectedAlgorithm = algorithmFactory.createSequence("Phi");
	musicAlgorithms.setAlgorithm(selectedAlgorithm);

	var normalizeChoice = normalizeFactory.createNormalizer("Modulo");
	musicNormalize.setAlgorithm(normalizeChoice);
	
	var currData = musicAlgorithms.getValues(4);
	alert("Hello "+musicNormalize.normalize(currData,1,88));
*/	

//	musicAlgorithms.getValues(23);

/*
	var compressedObject = document.getElementById("compressType");
	alert("ha:"+compressedObject.options[compressedObject.selectedIndex].text);

*/	
//alert("ha:"+factory(compressedObject.options[algorithm.selectedIndex].text));

}



