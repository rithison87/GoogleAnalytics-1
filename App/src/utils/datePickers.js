import {toJS} from 'mobx'
import moment from 'moment'

const relDates = () => {
	return {
		'today': moment().format('YYYY-MM-DD'),
		'yesterday': moment().subtract(1,'days'),
	}
}

// Enforce start date must be BEFORE end date.

// When a pre-defined date is selected, populate startDatePicker and endDatePicker
const setDates = preDefValue => {
	switch(preDefValue) {
		case 'today':
			break;
		case 'yesterday':
			break;
		case 'last7Days':
			break;
		case 'lastWeek':
			break;
		case 'last30Days':
			break;
		case 'lastMonth':
			break;
		case 'monthToDate':
			break;
		case 'yearToDate':
			break;
		case 'lastYear':
			break;
		default 'custom'
			break;						
	}
}



// When either startDatePicker or endDatePicker value is updated, check
// to see if the new value matches the result of the currently selected
// pre-defined date. if not, clear the pre-defined date selection