import AyxStore from '../stores/AyxStore'
console.log('metrics.js file exported')
// hard-coded IDs may be temp (discuss further)
const profileId = '113553943'
const accountId = '226181'
const webPropertyId = 'UA-226181-9'
const metadataRequestUri = 'https://www.googleapis.com/analytics/v3/metadata/ga/columns'
const customMetricsMetadataRequestUri = 'https://www.googleapis.com/analytics/v3/management/accounts/'+accountId+'/webproperties/'+webPropertyId+'/customMetrics'
const accessToken = 'ya29.Ci-XAz0oDLbyzBrYi_r7lBBnJHvOI09hIqwKUPsvjpAocWTatFLGG1FyPmjstk92kA'

// configure settings to hit Metadata API
const getMetricsMetadata = (accessToken) => {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": metadataRequestUri,
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

// remove deprecated metrics from metrics metadata array
const filterMetricsMetadata = (response) => {
    const filteredMetadataItems = response.items.filter( (d) => d.attributes.status != 'DEPRECATED')
    const standardMetrics = filteredMetadataItems.map( (d) => d.id )
    // console.log(metricMap)
    // console.log("MetricMap")
    // console.log(metricMap)
	return standardMetrics
}

// configure settings to get custom metrics 
const getCustomMetricsMetadata = (accessToken) => {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": customMetricsMetadataRequestUri,
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

const filterCustomMetricsMetadata = (response) => {
        //console.log(response)
        const filteredCustomMetricsMetadataItems = response.items.filter( (d) => d.active != false)
        const customMetrics = filteredCustomMetricsMetadataItems.map( (d) => d.id )
        // console.log(customMetricMap)
        return customMetrics
    }

const combinedMetricsMetadata = (accessToken, store) => {

	const standardMetrics = getMetricsMetadata(accessToken)
	standardMetrics
		.then(filterMetricsMetadata)
		.done( (result) => {
			console.log(result)
			store.metricsList.stringList.push(result)
		})
    
    const customMetrics = getCustomMetricsMetadata(accessToken)
	customMetrics
		.then(filterCustomMetricsMetadata)
		.done( (result) => {
			console.log(result)
			store.metricsList.stringList.push(result)
		}) 

// need to make each item 
//let optionList = [{uiobject: 'test1', dataname: '1'}, {uiobject: 'test2', dataname: '2'}]

}
// merge metricsMetadata and customMetricsMetadata arrays
export { getMetricsMetadata, getCustomMetricsMetadata, combinedMetricsMetadata };