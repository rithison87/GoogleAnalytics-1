import React from 'react'
import ReactDOM from 'react-dom'
import Hello from './components/hello'
import { populateAccountsList, setFreshAccessToken, getAccessTokenAjaxCall, login, gup, validateToken, displayFieldset } from './utils/utils'
import AyxStore from './stores/AyxStore'
import * as metrics from './utils/metrics'

Alteryx.Gui.AfterLoad = (manager) => {
  

  // Adds metrics.metricsSelectionCheck to UserDataChanged of metricsList
  metrics.bindMetricCheck()

  const collection = [
    {key: 'client_id', type: 'value'},
    {key: 'client_secret', type: 'value'},
    {key: 'refresh_token', type: 'value'},
    {key: 'accessToken', type: 'value'},
    {key: 'metricsList', type: 'listBox'},
    
  ]


  const store = new AyxStore(manager, collection)

  let optionList = [{uiobject:'test1', dataname: 'test1 value'},
                    {uiobject:'test2', dataname: 'test2 value'}]

  //create promise that will run combinedMetricsMetadata and show metrics fieldset

  metrics.combinedMetricsMetadata(store.accessToken, store)

  window.optionList = optionList

  window.store = store

  window.setFreshAccessToken = setFreshAccessToken

  window.login = login

  window.displayFieldset = displayFieldset

  window.getMetricsMetadata = metrics.getMetricsMetadata

  window.getCustomMetricsMetadata = metrics.getCustomMetricsMetadata

  window.combinedMetricsMetadata = metrics.combinedMetricsMetadata

  window.metricsSelectionCheck = metrics.metricsSelectionCheck

  window.bindMetricCheck = metrics.bindMetricCheck

  window.noMetricsSelectedWarning = metrics.noMetricsSelectedWarning

  }



//window.setFreshAccessToken = setFreshAccessToken;
//window.getAccessTokenAjaxCall = getAccessTokenAjaxCall;
