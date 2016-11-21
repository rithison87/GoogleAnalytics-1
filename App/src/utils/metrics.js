import AyxStore from '../stores/AyxStore'
import {toJS} from 'mobx' 
console.log('metrics.js file exported')
// hard-coded IDs may be temp (discuss further)
const profileId = '113553943'
const accountId = '226181'
const webPropertyId = 'UA-226181-9'
const metadataRequestUri = 'https://www.googleapis.com/analytics/v3/metadata/ga/columns'
const customMetricsMetadataRequestUri = 'https://www.googleapis.com/analytics/v3/management/accounts/'+accountId+'/webproperties/'+webPropertyId+'/customMetrics'
const accessToken = 'ya29.Ci-XAz0oDLbyzBrYi_r7lBBnJHvOI09hIqwKUPsvjpAocWTatFLGG1FyPmjstk92kA'

// get metadata for standard metrics
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

// remove deprecated metrics from standard metrics metadata array
const filterMetricsMetadata = (response) => {
    const filteredMetadataItems = response.items.filter( (d) => d.attributes.status != 'DEPRECATED')
    const standardMetrics = filteredMetadataItems.map( (d) => d.id )
    return standardMetrics
}

// get metadata for custom metrics
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

// remove inactive custom metrics from the custom metrics metadata array
const filterCustomMetricsMetadata = (response) => {
        const filteredCustomMetricsMetadataItems = response.items.filter( (d) => d.active != false)
        const customMetrics = filteredCustomMetricsMetadataItems.map( (d) => d.id )
        return customMetrics
}

// promise function to update metricsList store
const metricsStorePush = (result) => {
    result.map( (d) => {
        const newUiObj = d.substring(3, d.length)
        store.metricsList.stringList.push({uiobject: newUiObj, dataname: d})
    })
    console.log(toJS(store.metricsList.stringList) )
}

// merge the standard and custom metrics metadata arrays and store them in metricsList
const combinedMetricsMetadata = (accessToken, store) => {

    const standardMetrics = getMetricsMetadata(accessToken)
    const customMetrics = getCustomMetricsMetadata(accessToken)

    Promise.all([standardMetrics,customMetrics])
        .then( (results) => {
            const filteredCombined = filterMetricsMetadata(results[0]).concat(filterCustomMetricsMetadata(results[1]))
            filteredCombined.sort()
            return filteredCombined
        })
        .then( (results) => {
            metricsStorePush(results)
        })
}

// displays warning if no metrics are selection and if more than 10 metrics are selected
const metricsSelectionCheck = () => {
    if (store.metricsList.selection.length < 11) {
        console.log("metrics selected: " + store.metricsList.selection.length)
        // NEED TO ADD A .hide() WARNING
    } else {
        console.log("Max of 10 metrics: " + store.metricsList.selection.length)
        // NEED TO ADD A .show() WARNING
    }
}

// binds the metricsSelectionCheck to metricsList and runs it each time 
const bindMetricCheck = () => {
    Alteryx.Gui.manager.GetDataItem('metricsList').UserDataChanged.push(metricsSelectionCheck);
}

// Warning if no metrics are selection - trigger when they try to go to the next config window
const noMetricsSelectedWarning = () => {
    if (store.metricsList.selection.length < 1) {
        console.log("must select at least 1 metric")
        // NEED TO ADD A .show() WARNING
    } else {
        // NEED TO ADD A .hide() WARNING
    }
}
export { getMetricsMetadata, getCustomMetricsMetadata, combinedMetricsMetadata, metricsStorePush, metricsSelectionCheck, bindMetricCheck, noMetricsSelectedWarning };