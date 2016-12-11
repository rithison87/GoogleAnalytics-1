import moment from 'moment'

// Build relative dates object based on today's date
const getDates = () => {
  const today = moment().format('YYYY-MM-DD')
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
  const L7DStart = moment().subtract(7, 'days').format('YYYY-MM-DD')
  const LWEnd = moment().subtract(moment().day() + 1, 'days').format('YYYY-MM-DD')
  const LWStart = moment(LWEnd).subtract(6, 'days').format('YYYY-MM-DD')
  const L30DStart = moment(yesterday).subtract(29, 'days').format('YYYY-MM-DD')
  const LMEnd = moment().subtract(moment().date(), 'days').format('YYYY-MM-DD')
  const LMStart = moment(LMEnd).subtract(moment(LMEnd).date() - 1, 'days').format('YYYY-MM-DD')
  const CurMonStart = moment().startOf('month').format('YYYY-MM-DD')
  const CurYearStart = moment().startOf('year').format('YYYY-MM-DD')
  const LYStart = moment().startOf('year').subtract(1, 'years').format('YYYY-MM-DD')
  const LYEnd = moment().startOf('year').subtract(1, 'days').format('YYYY-MM-DD')

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
    'custom': {
      'start': '',
      'end': ''
    }
  }
}

// When a pre-defined date is selected, populate startDatePicker and endDatePicker
const setDates = preDefValue => {
  if (preDefValue !== 'custom') {
    const date = getDates()

    switch (preDefValue) {
      case 'today':
        return date.today
      case 'yesterday':
        return date.yesterday
      case 'last7Days':
        return date.last7Days
      case 'lastWeek':
        return date.lastWeek
      case 'last30Days':
        return date.last30Days
      case 'lastMonth':
        return date.lastMonth
      case 'monthToDate':
        return date.monthToDate
      case 'yearToDate':
        return date.yearToDate
      case 'lastYear':
        return date.lastYear
      default:
        return date.custom
    }
  }
}

export { getDates, setDates }
