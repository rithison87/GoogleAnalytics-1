/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	eval("(function webpackMissingModule() { throw new Error(\"Cannot find module \\\"./src/app.js\\\"\"); }());\nmodule.exports = __webpack_require__(179);\n\n\n//////////////////\n// WEBPACK FOOTER\n// multi main\n// module id = 0\n// module chunks = 0\n//# sourceURL=webpack:///multi_main?");

/***/ },

/***/ 179:
/***/ function(module, exports) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n//Accounts menu functions\nvar populateAccountsList = function populateAccountsList(store) {\n    var token = store.accessToken;\n    var fetchAccounts = getAcccountsAjaxCall(token);\n\n    var parseAccounts = function parseAccounts(results) {\n        var accounts = results.items;\n        var accountsList = accounts.map(function (d, i) {\n            return { uiobject: d.name, dataname: d.id };\n        });\n        return accountsList;\n    };\n\n    var setAccountsDropdownMenu = function setAccountsDropdownMenu(accountsList) {\n        //Alteryx.Gui.manager.GetDataItem('accountsDropDown').setStringList(accountsList);\n        console.log(accountsList);\n    };\n\n    fetchAccounts.then(parseAccounts).done(setAccountsDropdownMenu);\n    //.fail(handleApiFail)\n};\n\nvar getAcccountsAjaxCall = function getAcccountsAjaxCall(accessToken) {\n    var auth = \"Bearer \" + accessToken;\n    var url = \"https://www.googleapis.com/analytics/v3/management/accounts\";\n\n    var settings = {\n        \"async\": true,\n        \"crossDomain\": true,\n        \"url\": url,\n        \"method\": \"GET\",\n        \"dataType\": \"json\",\n        \"headers\": {\n            \"authorization\": auth,\n            \"cache-control\": \"no-cache\"\n        }\n    };\n\n    return $.ajax(settings);\n};\n/*\r\nAuthentication logic\r\n***********************************\r\n***********************************\r\n***********************************\r\n*/\nvar checkToken = function checkToken(data) {\n    //set the access token\n    if (typeof data.errors == 'undefined') {\n        var _accessToken = data.access_token;\n        console.log('Setting access token: ' + _accessToken);\n        Alteryx.Gui.manager.GetDataItem('accessToken').setValue(_accessToken);\n    };\n};\n\nvar authFail = function authFail(error) {\n    //  console.log(error.statusText);\n    console.log(error);\n};\n\nvar setFreshAccessToken = function setFreshAccessToken() {\n    var fetchToken = getAccessTokenAjaxCall();\n\n    fetchToken.done(checkToken).fail(authFail);\n};\n\n//non interactive developer method\nvar getAccessTokenAjaxCall = function getAccessTokenAjaxCall() {\n    // Add vars for each of the user text box inputs\n    var clientID = Alteryx.Gui.manager.GetDataItem('client_id').value;\n    var clientSecret = Alteryx.Gui.manager.GetDataItem('client_secret').value;\n    var refreshToken = Alteryx.Gui.manager.GetDataItem('refresh_token').value;\n\n    // API call settings\n    var settings = {\n        \"async\": true,\n        \"crossDomain\": true,\n        \"url\": \"https://accounts.google.com/o/oauth2/token\",\n        \"method\": \"POST\",\n        \"dataType\": \"json\",\n        \"headers\": {\n            \"cache-control\": \"no-cache\",\n            \"content-type\": \"application/x-www-form-urlencoded\"\n        },\n        \"data\": {\n            \"client_id\": clientID,\n            \"client_secret\": clientSecret,\n            \"refresh_token\": refreshToken,\n            \"Host\": \"accounts.google.com\",\n            \"grant_type\": \"refresh_token\"\n        }\n    };\n\n    return $.ajax(settings);\n};\n\n//const loggedIn    =   false;\n\n// 1st step - Online login method\nvar login = function login(store) {\n\n    var OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?';\n    var VALIDURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';\n    var SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';\n    // const CLIENTID    =   '848225068776-9gs7ugqmespd53h65vh058pr7sae1h4c.apps.googleusercontent.com';\n    var CLIENTID = '552512737410-g6admen5hqg6q268dmt3d9bminlri7en.apps.googleusercontent.com';\n    var REDIRECT = 'https://developers.google.com/oauthplayground';\n    var LOGOUT = 'http://accounts.google.com/Logout';\n    var TYPE = 'token';\n    var _url = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;\n\n    console.log(\"login() called\");\n    console.log('_url');\n    console.log(_url);\n\n    var win = window.open(_url, \"windowname1\", 'width=800, height=600');\n\n    var pollTimer = window.setInterval(function () {\n        console.log('pollTimer() called');\n        // window.location.href = toolGuiUrl;\n        try {\n            if (win.document.location.origin === \"https://developers.google.com\") {\n                var url = win.document.URL;\n                accessToken = gup(url, 'access_token');\n                console.log(\"Online Access Token:\");\n                console.log(accessToken);\n                Alteryx.Gui.manager.GetDataItem('accessToken').setValue(accessToken);\n                validateToken(accessToken);\n                // window.location.href = toolGuiUrl;\n                win.close();\n                displayFieldset([\"#accessMethod\", \"#onlineCreds\"]);\n            }\n        } catch (e) {\n            // console.log(\"catch\");\n        }\n    }, 500);\n};\n\n// 2nd step - Parses out the access token from the response url returned in login()\nvar gup = function gup(url, name) {\n    name = name.replace(/[\\[]/, \"\\\\\\[\").replace(/[\\]]/, \"\\\\\\]\");\n    var regexS = \"[\\\\#&]\" + name + \"=([^&#]*)\";\n    var regex = new RegExp(regexS);\n    var results = regex.exec(url);\n    if (results == null) {\n        return \"\";\n    } else {\n        return results[1];\n    }\n};\n\n// 3rd step - Validates the token received from login()\nvar validateToken = function validateToken(token) {\n    var VALIDURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';\n\n    // API call settings\n    var settings = {\n        \"async\": true,\n        \"crossDomain\": true,\n        \"url\": VALIDURL + token,\n        \"method\": \"GET\",\n        \"dataType\": \"jsonp\"\n    };\n    return $.ajax(settings).done(ajaxSuccess);\n    //.fail(errParse)\n};\nvar errParse = function errParse(jqXHR, textStatus, errorThrown) {\n    switch (jqXHR.status) {\n        case 400:\n            document.getElementById(\"connectionStatus\").innerHTML = '400 Bad Request Error:  Reconfigure tool and try again';\n            break;\n        case 401:\n            document.getElementById(\"connectionStatus\").innerHTML = '401 Invalid Token Error:  Token has expired, click Change Login Credentials to login';\n            break;\n        case 503:\n            document.getElementById(\"connectionStatus\").innerHTML = '503 Service Unavailable Error:  Google API is unreachable, try again later';\n            break;\n        default:\n            document.getElementById(\"connectionStatus\").innerHTML = 'Error - Unable to reach API:  Reconfigure tool and try again';\n    };\n    document.getElementById(\"connectionStatusBox\").setAttribute(\"style\", \"display: block; padding: 5px 5px 5px 5px; background: rgba(208, 2, 27, .2)\");\n    //changeCredentials();\n};\nvar ajaxSuccess = function ajaxSuccess(data, textStatus) {\n    //loggedIn = true;\n    document.getElementById(\"connectionStatus\").innerHTML = \"\";\n    document.getElementById(\"connectionStatusBox\").setAttribute(\"style\", \"display: none\");\n    Alteryx.Gui.manager.GetDataItem('accessToken').setValue(accessToken);\n    // Call function to retrive workbook list\n    // get_workbook_list();\n};\n\nvar displayFieldset = function displayFieldset(fieldsetName) {\n\n    //Array containing all fieldsets\n    var fieldsetArray = [\"#accessMethod\", \"#onlineCreds\", \"#offlineCreds\"];\n\n    //Do we need to exclude the one that's about to be shown?\n    //Array containing all fieldsets except for fieldsetName\n    var hideArray = fieldsetArray.filter(function (v) {\n        return v !== fieldsetName;\n    });\n\n    $(document).ready(function () {\n        //Hide each item in the hideArray\n        hideArray.forEach(function (v) {\n            $(v).hide();\n        });\n        //Show the fieldset corresponding with fieldsetName\n        fieldsetName.forEach(function (v) {\n            $(v).show();\n        });\n    });\n};\n\nexports.setFreshAccessToken = setFreshAccessToken;\nexports.getAccessTokenAjaxCall = getAccessTokenAjaxCall;\nexports.login = login;\nexports.gup = gup;\nexports.validateToken = validateToken;\nexports.displayFieldset = displayFieldset;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/utils/utils.js\n// module id = 179\n// module chunks = 0\n//# sourceURL=webpack:///./src/utils/utils.js?");

/***/ }

/******/ });