// Fairly simple form validation, on submission. 
function formValidates(mode){

  // The stream mode operates without dates and any subject is searchable, so no validation needs to be done.
  if (mode == '/streamTweets'){ 
    return true;               
  }                        
  
  // Set these up to validate the date for the RESTful Twitter search.
  var start = document.getElementById('startdate').value; 
  var end = document.getElementById('enddate').value; 
  var startObj = new Date(start); 
  var endObj = new Date(end); 
  // Note that the next two are initialized in index.html, giving them global scope for later use with the DOM. 
  startErrMsg = ''; 
  endErrMsg = ''; 

  // One '&' forces all to be checked, hence all error messages updated. '&&'' would stop checking if first returns false.
  return (withinWeek() & validStart() & hasFormat()); 

  // Use JS date subtraction to verify that the gap between now (current time) and the entered start date is less than 
  // 7 days (a week as per "Week", which is assigned in "initGlobals"). Add an error message if the condition fails. 
  function withinWeek(){ 
    var now = new Date(); 
    if ((now - startObj) < Week){ 
      return true; 
    } else {
       startErrMsg += 'That start date is too long ago. Twitter only allows searches that go roughly a week back. ';
      return false; 
    }
  }

  // For a date range to be valid, the end can't be earlier than the start. Use "Date" subtraction to check this. 
  function validStart(){ 
    if ((endObj - startObj) > 0){ 
      return true; 
    } else {
        endErrMsg += 'Please make sure your end date is after your start date. ';
      return false; 
    }
  }

  // "validStart" and "withinWeek" already validate the date numerically. Check for 'month/day/year' format
  // (single digit month and day values are fine). 
  function hasFormat(){ 
    // Use "checkFormat" to see if both end and start dates have the valid format. 
    var startIsValid = checkFormat(start);
    var endIsValid = checkFormat(end);
    // This error message is standard to both input boxes, so given scope outside the helper "setMsg".
    var formatErrMsg = 'Your format is incorrect. Please stick to month/day/year.';
    // Set error messages. These will be empty strings if the validation succeeded.
    startErrMsg = setMsg(startIsValid, startErrMsg)
    endErrMsg = setMsg(endIsValid, endErrMsg)
    // If format for both is are ok, return true. If either fails, return false.
    return (startIsValid && endIsValid) ? true : false;

    // Validate the format by splitting around '/', making sure there are three string chunks in the returned
    // array, and checking that each chunk has the expected length (1 or 2 for month or date, 4 for year).
    function checkFormat(date){
      date = date.split('/');
      // This precludes the chance that any following logic validates the input. Return false.
      if (date.length != 3){
        return false;
      } else {
        if ( (date[0].length > 0 && date[0].length < 3) 
          && (date[1].length > 0 && date[1].length < 3)
          && (date[2].length === 4)){
          return true;
        }
      } 
      // In case anything slips through the cracks, make a default return of false.  
      return false;
    }

    // If the condition is false, see if the error message already is started, and if so, add 'Also: ', and 
    // always add "errMsg". If the condition is true, return "errMsg" unchanged.
    function setMsg(condition, errMsg){
      if (!condition){
        if(errMsg.length > 0){
          errMsg += 'Also: ';
        }
        errMsg += formatErrMsg;
      }
      return errMsg;
    }
  }
}  