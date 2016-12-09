import {toJS} from 'mobx'
import moment from 'moment'

const getDates = () => {
	const today 		= moment().format('YYYY-MM-DD')
	const yesterday 	= moment().subtract(1, 'days').format('YYYY-MM-DD')
	const L7DStart 		= moment().subtract(7, 'days').format('YYYY-MM-DD')
	const LWEnd 		= moment().subtract(moment().day() + 1, 'days').format('YYYY-MM-DD')
	const LWStart 		= moment(LWEnd).subtract(6, 'days').format('YYYY-MM-DD')
	const L30DStart 	= moment(yesterday).subtract(29, 'days').format('YYYY-MM-DD')
	const LMEnd 		= moment().subtract(moment().date(), 'days').format('YYYY-MM-DD')
	const LMStart 		= moment(LMEnd).subtract(moment(LMEnd).date() - 1, 'days').format('YYYY-MM-DD')
	const CurMonStart 	= moment().startOf('month').format('YYYY-MM-DD')
	const CurYearStart 	= moment().startOf('year').format('YYYY-MM-DD')
	const LYStart 		= moment().startOf('year').subtract(1, 'years').format('YYYY-MM-DD')
	const LYEnd 		= moment().startOf('year').subtract(1, 'days').format('YYYY-MM-DD')

	return {
		'today': {
			'start': today,
			'end': today
		},
		'yesterday': {
			'start': yesterday,
			'end': yesterday
		},
		'last7Days': {
			'start': L7DStart,
			'end': yesterday
		},
		'lastWeek': {
			'start': LWStart,
			'end': LWEnd
		},
		'last30Days': {
			'start': L30DStart,
			'end': yesterday
		},
		'lastMonth': {
			'start': LMStart,
			'end': LMEnd
		},
		'monthToDate': {
			'start': CurMonStart,
			'end': yesterday
		},
		'yearToDate': {
			'start': CurYearStart,
			'end': yesterday
		},
		'lastYear': {
			'start': LYStart,
			'end': LYEnd
		},
	}
}

// Enforce start date must be BEFORE end date.

// When a pre-defined date is selected, populate startDatePicker and endDatePicker
const setDates = preDefValue => {
	const date = getDates()

	const yeah = date.preDefValue

	switch(preDefValue) {
		case 'today':
			return date.today
			break;
		case 'yesterday':
			return date.yesterday
			break;
		case 'last7Days':
			return date.last7Days
			break;
		case 'lastWeek':
			return date.lastWeek
			break;
		case 'last30Days':
			return date.last30Days
			break;
		case 'lastMonth':
			return date.lastMonth
			break;
		case 'monthToDate':
			return date.monthToDate
			break;
		case 'yearToDate':
			return date.yearToDate
			break;
		case 'lastYear':
			return date.lastYear
			break;
		default:
			break;						
	}
}

export { getDates, setDates }



// When either startDatePicker or endDatePicker value is updated, check
// to see if the new value matches the result of the currently selected
// pre-defined date. if not, clear the pre-defined date selection