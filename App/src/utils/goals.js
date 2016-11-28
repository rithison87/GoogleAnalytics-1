import AyxStore from '../stores/AyxStore'
import {toJS} from 'mobx' 


const accountId = '226181'
const webPropertyId = 'UA-226181-9'
const profileId = '31055553'
const goalsUri = 'https://www.googleapis.com/analytics/v3/management/accounts'
const goalsRequestUri = 'https://www.googleapis.com/analytics/v3/management/accounts/'+accountId+'/webproperties/'+webPropertyId+'/profiles/' +profileId+'/goals' 
const accessToken = 'ya29.CjGkA_MNlXR6u5VIqrIuFHOfenuTrFKZ3rSkLsHRRQaqjojLP734szWNjK0CvAS-Kgxr'

// get goals for all profiles
const getGoalsListAjaxCall = (accessToken) => {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": goalsRequestUri,
        "method": "GET",
        "dataType": "json",
        "headers": {
            "Authorization": 'Bearer ' + accessToken,
            "cache-control": "private, max-age=0, must-revalidate, no-transform",
            "content-type": "application/json; charset=UTF-8" 
        } 
    }
    return $.ajax(settings)
}

const populateGoalsList = (store) => {
	
	const fetchGoals = getGoalsListAjaxCall(store.accessToken);
	
	const parseGoals = (results) => {
		console.log(results)
    	const goals = results.items.filter( (d) => d.active != false)
		const goalsList = goals.map((d) => {
      return {
      			uiobject: d.name, 
      			dataname: d.id,
      			type: d.type}
    })
    return goalsList
  }

   	fetchGoals

  		.then(parseGoals)
  		.done((results) => {console.log(results)})
  	
}
	
const goalsStorePush = (results) => {
    result.map( (d) => {
        const newUiObj = d.substring(3, d.length)
        store.goalsList.stringList.push({uiobject: newUiObj, dataname: d})
    })
    console.log(toJS(store.goalsList.stringList) )
}
	

export { populateGoalsList, goalsStorePush };