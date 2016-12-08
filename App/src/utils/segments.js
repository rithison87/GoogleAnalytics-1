import AyxStore from '../stores/AyxStore'
import {toJS} from 'mobx' 
console.log('metrics.js file exported')
// hard-coded IDs may be temp (discuss further)
const accountId = '226181'
const webPropertyId = 'UA-226181-9'
const profileId = '113553943'
const metadataRequestUri = 'https://www.googleapis.com/analytics/v3/management/segments'
const accessToken = 'ya29.Ci-XAz0oDLbyzBrYi_r7lBBnJHvOI09hIqwKUPsvjpAocWTatFLGG1FyPmjstk92kA'

// get metadata for standard metrics
const getSegmentsMetadata = (accessToken) => {
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

const parseSegments = (results) => {
       
    const segmentsList = results.items.map((d) => {
        return {
            uiobject: d.name, 
            dataname: d.id,
            type: d.type,
            segmentId: d.segmentId,
            kind: d.kind,
            definition: d.definition,
        }
})
return segmentsList
}


const segmentsStorePush = (result) => {
    result.map( (d) => {
        store.segmentsList.stringList.push({uiobject: d.uiobject, dataname: d.dataname})
    })
    
}

const populateSegmentsList = (store) => {
    
    const fetchSegments = getSegmentsMetadata(store.accessToken);
    
    fetchSegments

    .then(parseSegments)
    .done(segmentsStorePush)
}

export { getSegmentsMetadata, populateSegmentsList, segmentsStorePush, parseSegments }