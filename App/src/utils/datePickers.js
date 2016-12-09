import {toJS} from 'mobx'
import * from 'moment'

const getDate = (arg) => {
	let today = new Date()
	let day = today.getDate()
	let month = today.getMonth() + 1 //January is 0
	let year = today.getFullYear()

	if (day < 10) {
		day = '0' + day
	}

	if (month < 10) {
		month = '0' + month
	}



	let date = year + '-' + month + '-' + day

	if(!arg) {
		return date
	} else if (arg === 'yesterday') {
		day
	}
}

// When a pre-defined date is selected, populate startDatePicker and endDatePicker
const setDates = preDefValue => {
	switch(preDefValue) {
		case 'last7':
			break;
		case 'last30':
			break;
		case 'lastWeek':

	}
}



// When either startDatePicker or endDatePicker value is updated, check
// to see if the new value matches the result of the currently selected
// pre-defined date. if not, clear the pre-defined date selection