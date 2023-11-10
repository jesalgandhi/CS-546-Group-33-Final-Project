import {ObjectId} from 'mongodb';
import {validate} from 'email-validator';

const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} is an invalid object ID`;
    return id;
  },

  checkDate(eventDate) {
    /* Validate eventDate */
    const dateArr = eventDate.split("/");
    if (dateArr.length !== 3 || dateArr[0].length !== 2 || dateArr[1].length !== 2 || dateArr[2].length !== 4) {
      throw "Error: eventDate is incorrectly formatted (MM/DD/YYYY format expected)";
    }
    // date validation function from here: https://www.freecodecamp.org/news/how-to-validate-a-date-in-javascript/ 
    const dateObj = new Date(eventDate);
    if (isNaN(dateObj)) {
      throw "Error: eventDate is not a valid date";
    }
    if (dateObj < (new Date())) {
      throw "Error: eventDate should be in the future";
    }
  },

  checkEventLocation(eventLocation) {
    if (Object.keys(eventLocation).length !== 4) {
      throw "Error: Please ensure eventLocation contains exactly 4 keys (streetAddress, city, state, zip)";
    }
    if ((!eventLocation.hasOwnProperty('streetAddress')) || (!eventLocation.hasOwnProperty('city')) ||
        (!eventLocation.hasOwnProperty('state')) || (!eventLocation.hasOwnProperty('zip'))) {
          throw "Error: Please ensure eventLocation contains proper keys (streetAddress, city, state, zip)";
    }
    if ((typeof eventLocation.streetAddress !== 'string') || (typeof eventLocation.city !== 'string') || 
        (typeof eventLocation.state !== 'string') || (typeof eventLocation.zip !== 'string')) {
          throw "Error: Please ensure all fields of eventLocation are strings";
    }
    if (eventLocation.streetAddress.length < 3) {
      throw "Error: Please ensure the length of eventLocation.streetAdress is greater than 3 characters";
    }
    if (eventLocation.city.length < 3) {
      throw "Error: Please ensure the length of eventLocation.city is greater than 3 characters";
    }
    const validStates = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 
    'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
    'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 
    'WV', 'WI', 'WY' ];
    eventLocation.state = eventLocation.state.toUpperCase();
    if (!(validStates.includes(eventLocation.state))) {
      throw "Error: Please ensure eventLocation.state is a valid U.S. state abbreviation";
    }
    if (eventLocation.zip.length !== 5) {
      throw "Error: Please ensure eventLocation.zip is a valid 5-digit zip code";
    }
    /* https://stackoverflow.com/questions/8935632/check-if-character-is-number to check if char is number */
    for (let z of eventLocation.zip) {
      if (!(z >= '0' && z <= '9')) {
        throw "Error: Please ensure eventLocation.zip is a valid 5-digit zip code";
      }
    }
  },

  /* Validation of request fields of POST /events route */
  postEventsCheckFields(eventData) {
    /* ensure eventData actually exists and contains keys */
    if (!eventData || Object.keys(eventData) === 0) {
        return res.status(400).json({error: 'There are no fields in the request body'});
      }
    /* Ensure eventData has exactly 10 keys and contains all required keys */
    if (
    (Object.keys(eventData).length !== 10) ||
    !(eventData.hasOwnProperty('eventName')) ||
    !(eventData.hasOwnProperty('description')) ||
    !(eventData.hasOwnProperty('eventLocation')) ||
    !(eventData.hasOwnProperty('contactEmail')) ||
    !(eventData.hasOwnProperty('maxCapacity')) ||
    !(eventData.hasOwnProperty('priceOfAdmission')) ||
    !(eventData.hasOwnProperty('eventDate')) ||
    !(eventData.hasOwnProperty('startTime')) ||
    !(eventData.hasOwnProperty('endTime')) ||
    !(eventData.hasOwnProperty('publicEvent'))
    ) throw 'The request body should contain exactly 10 fields';

    /* publicEvent maxCapacity, priceOfAdmission, eventLocation checks */
    if (typeof eventData.publicEvent !== 'boolean') throw "Error: publicEvent should be a boolean";
    if (typeof eventData.maxCapacity !== 'number') throw "Error: maxCapacity should be a number";
    if (typeof eventData.priceOfAdmission !== 'number') throw "Error: priceOfAdmission should be a number";
    if (typeof eventData.eventLocation !== 'object') throw "Error: Please ensure eventLocation is an object";

    /* Ensure keys that should contain strings as values are indeed strings */
    if (
        (typeof eventData.eventName !== 'string') ||
        (typeof eventData.description !== 'string') ||
        (typeof eventData.contactEmail !== 'string') ||
        (typeof eventData.eventDate !== 'string') ||
        (typeof eventData.startTime !== 'string') ||
        (typeof eventData.endTime !== 'string')
    ) throw 'One of the following keys does not contain a string as its value: eventName, description, contactEmail, eventDate, startTime, endTime';

    /* Trim values of keys containing strings + ensure they are not non-empty */
    eventData.eventName = eventData.eventName.trim();
    eventData.description = eventData.description.trim();
    eventData.contactEmail = eventData.contactEmail.trim();
    eventData.eventDate = eventData.eventDate.trim();
    eventData.startTime = eventData.startTime.trim();
    eventData.endTime = eventData.endTime.trim();
    if (
        (eventData.eventName.length === 0) ||
        (eventData.description.length === 0) ||
        (eventData.contactEmail.length === 0) ||
        (eventData.eventDate.length === 0) ||
        (eventData.startTime.length === 0) ||
        (eventData.endTime.length === 0) 
    ) throw 'One of the following keys contains an empty value: eventName, description, contactEmail, eventDate, startTime, endTime';

    /* Check eventName, description lengths and validate contactEmail */
    if (eventData.eventName.length < 5) throw "Error: eventName field should be at least 5 characters";
    if (eventData.description.length < 25) throw "Error: description field should be at least 25 characters";
    if (!validate(eventData.contactEmail)) throw "Error: contactEmail is in an incorrect format";

    /* validate date and time */
    this.checkDate(eventData.eventDate);
    this.checkStartTimeEndTime(eventData.startTime, eventData.endTime);

    /* Check maxCapacity and priceOfAdmission */
    if ((eventData.maxCapacity <= 0) || (!(eventData.maxCapacity % 1 === 0))) throw "Error: Please ensure maxCapacity is a positive whole number";
    if ((eventData.priceOfAdmission < 0)) throw "Error: Please ensure priceOfAdmission is a non-negative number";
    const pOAStr = eventData.priceOfAdmission.toString();
    if (pOAStr.includes(".") && pOAStr.split('.')[1].length > 2) throw "Error: Please ensure priceOfAdmission has 2 decimal places";

    /* eventLocation validation checks */
    this.checkEventLocation(eventData.eventLocation);
  }

};

export default exportedMethods;