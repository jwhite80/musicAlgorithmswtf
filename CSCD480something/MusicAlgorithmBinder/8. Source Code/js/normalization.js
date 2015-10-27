//Algorithm Strategy section*******************************************************************************************************************************


//Division class
var Division = function(){
	
	this.normalize = function(data,minValue,maxValue)
	{
	    var resolution = 0;// resolution is the incrementor used for creating the translation table that contains all possible values.
	    var translationList = new Array();// this is the translation table list which is a list of objects knows as TranslationKey.
	    var finalTranslation = new Array();// this is the raw data array that has been translated.

	    var keyboardRange = Range(minValue, maxValue);// This call gets the range of the keyboard and duration values.
	    var algorithmInput = 0;// this is the range that is derived from the incoming values for algorithm or user.

	    var minimumDataValue = Math.min.apply(Math, data);
	    var maximumDataValue = Math.max.apply(Math, data);
	    
	    if (minimumDataValue < 0)
	    {// This is a special case for negative values from the raw data array.
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
	        {
	            resolution = 1;
	        }
	    }
	    else
	    {
	        resolution = keyboardRange / algorithmInput;
	    }

	    translationList = CreateTranslationTable(minimumDataValue, algorithmInput,minValue, resolution);// creates a complete list of values derived from the raw data. This is the translation table.
	    finalTranslation = CreateFinalList(data,translationList);// this creates the translated version of the raw data array.
	    
	    return finalTranslation;
	};

	/*
		Used to match up values in the raw data list to the complete translation table. Finder helps with this.
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
	Creates a complete translation table starting from the min value from data array to max value, this is inclusive.
	*/
	function CreateTranslationTable(min, range, base, unit)
	{
	    var translated = 0;
	    var temporaryList = new Array();
	    incrementor = +min;

	    for(var x = 0; x < range; x++)
	    {
	        temporaryList.push(new TranslationKey(incrementor, (x * +unit) + +base));
	        incrementor++;
	    }
	   
	    return temporaryList;
	}
    /*
        Range method gets range from keyboard and duration values.
    */
	function Range(min, max) {
	    return (+max - +min) + 1;
	}

    /*
        NegativeRange and PositiveRange methods are for building translation table.
    */
	function NegativeRange(min, max){
	    return (+min * -1) + (+max + 1);
	}

	function PositiveRange(min, max){
	    return (+max + 1) - +min;
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
		var _value = new Array();		
		var modNum = +maxValue - +minValue + 1;
		
		for(var i = 0; i < data.length; i++)
		{
		    if(+data[i] < 0)
		    {
		        _value.push(parseInt(+minValue +(+data[i] * -1) % +modNum));
		    }
		    else {
		        _value.push(parseInt(+minValue + +data[i] % +modNum));
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



