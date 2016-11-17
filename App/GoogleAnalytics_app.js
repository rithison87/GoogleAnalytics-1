/*********************************************************************************************
**********************************************************************************************
Created by Stephen Wagner, 2/23/16
Google Sheets Input tool GUI file
**********************************************************************************************
*********************************************************************************************/

// global vars
var accessToken;
var worksheetList = [];
var workbookList = [];
var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
var SCOPE       =   'https://spreadsheets.google.com/feeds https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets';
var CLIENTID    =   '848225068776-9gs7ugqmespd53h65vh058pr7sae1h4c.apps.googleusercontent.com';
var REDIRECT    =   'https://developers.google.com/oauthplayground';
var LOGOUT      =   'http://accounts.google.com/Logout';
var TYPE        =   'token';
var _url        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
var loggedIn    =   false;

/*********************************************************************************************
**********************************************************************************************

Functions that support Google Login (online mode) token request

**********************************************************************************************
*********************************************************************************************/
// 1st step - Online login method
function login(startupFlg) {
    var win         =   window.open(_url, "windowname1", 'width=800, height=600'); 

    var pollTimer   =   window.setInterval(function() { 
        try {
            if (win.document.location.origin === "https://developers.google.com") {
                var url =   win.document.URL;
                accessToken =   gup(url, 'access_token');
                Alteryx.Gui.manager.GetDataItem('accessToken').setValue(accessToken);
                validateToken(accessToken);
                win.close();
                }
            } catch(e) {
        }
    }, 500);
}

// 2nd step - Parses out the access token from the response url returned in login()
function gup(url, name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\#&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    if( results == null ) {
        return "";
    }
    else {
        return results[1];
    }
}

// 3rd step - Validates the token received from login()
function validateToken(token) {
    // API call settings
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": VALIDURL + token,
        "method": "GET",
        "dataType": "jsonp",
    };

    return $.ajax(settings)
        .done(function (data, textStatus) {
            loggedIn = true;
            document.getElementById("connectionStatus").innerHTML = "";
            document.getElementById("connectionStatusBox").setAttribute("style", "display: none");
            Alteryx.Gui.manager.GetDataItem('accessToken').setValue(accessToken);
            // Call function to retrive workbook list 
            get_workbook_list();
        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            switch(jqXHR.status) {
                case 400:
                    document.getElementById("connectionStatus").innerHTML='400 Bad Request Error:  Reconfigure tool and try again';
                    break;
                case 401:
                    document.getElementById("connectionStatus").innerHTML='401 Invalid Token Error:  Token has expired, click Change Login Credentials to login';
                    break;
                case 503:
                    document.getElementById("connectionStatus").innerHTML='503 Service Unavailable Error:  Google API is unreachable, try again later';
                    break;
                default:
                    document.getElementById("connectionStatus").innerHTML='Error - Unable to reach API:  Reconfigure tool and try again';
            };                   
            document.getElementById("connectionStatusBox").setAttribute("style", "display: block; padding: 5px 5px 5px 5px; background: rgba(208, 2, 27, .2)");
            changeCredentials();
        });
}


/*******************************************************************************************************
********************************************************************************************************

Functions that support the Offline method for token request (Client ID, Client Secret, Refresh Token)

********************************************************************************************************
*******************************************************************************************************/
// Gets the API token based on Offline method
function get_access_token(startupFlg) {
    // Clear any error messages
    document.getElementById("connectionStatus").innerHTML = '';
    document.getElementById("connectionStatusBox").setAttribute("style", "display:none");
    
    // Add vars for each of the user text box inputs
    var clientID = Alteryx.Gui.manager.GetDataItem('client_id').value;
    var clientSecret = Alteryx.Gui.manager.GetDataItem('client_secret').value;
    var refreshToken = Alteryx.Gui.manager.GetDataItem('refresh_token').value;

    // API call settings
    var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://accounts.google.com/o/oauth2/token",
            "method": "POST",
            "dataType": "json",
            "headers": {
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "client_id": clientID,
                "client_secret": clientSecret,
                "refresh_token": refreshToken,
                "Host": "accounts.google.com",
                "grant_type": "refresh_token"
            }
    };

    // Make get access token request
    $.ajax(settings)        
        .done(function(data, textStatus) {
            //set the access token
            if (typeof data.errors == 'undefined') {
                accessToken = data.access_token;
                Alteryx.Gui.manager.GetDataItem('accessToken').setValue(accessToken);
                // Change the view
                if (Alteryx.Gui.manager.GetDataItem('view').value == "5") {
                    get_workbook_list();
                } else { 
                    viewSwitch();
                };                     
            };
        })
        
        .fail(function(jqXHR, textStatus, errorThrown) {
            document.getElementById("connectionStatusBox").setAttribute("style", "display: inline-block; background: rgba(208, 2, 27, .2); padding-top: 10px; padding-bottom: 10px; padding-left: 5px; padding-right: 5px");

            if (typeof jqXHR.responseJSON != 'undefined') {
                var errorMessage = jqXHR.responseJSON.error_description;
                var code = jqXHR.status;
                document.getElementById("connectionStatus").innerHTML = "Error Code " + code + ": " + errorMessage;
            }
            else {
                document.getElementById("connectionStatus").innerHTML = "Failed to resolve URL";
            }

            if (startupFlg == 'True') {
                document.getElementById("offlineCreds").setAttribute("style", "display: block");
            }
        });
}

/*********************************************************************************************
**********************************************************************************************

Functions that populate the workbook and worksheet lists

**********************************************************************************************
*********************************************************************************************/
// Retrieves a list of workbooks associated with the Authorization token
function get_workbook_list(accessToken) {
    var auth = "Bearer " + Alteryx.Gui.manager.GetDataItem('accessToken').value;
    var numWorkbooks;
    var workbookIDs = [];
    var workbookTitles = [];
    workbookList = [];

    // API call settings
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://spreadsheets.google.com/feeds/spreadsheets/private/full?alt=json",
        "method": "GET",
        "dataType": "json",
        "headers": {
            "authorization": auth,
            "cache-control": "no-cache",
        }
    };

    return $.ajax(settings)
        .done(function (data, textStatus) {
            document.getElementById("connectionStatusBox").setAttribute("style", "display: none");
            numWorkbooks = data.feed.entry.length;

            for (var i = 0; i < numWorkbooks; i++) {
                workbookIDs.push(data.feed.entry[i].id.$t);
                workbookIDs[i] = workbookIDs[i].replace("https://spreadsheets.google.com/feeds/spreadsheets/private/full/", "");
                workbookTitles.push(data.feed.entry[i].title.$t);
            }

            // enables Next button if the user has already made a selection
            enable_toWorksheetList();
            // Populates the list of workbooks shown to end user
            populateWorkbookTable();

            function populateWorkbookTable() {
                for (var i = 0; i < numWorkbooks; i++) {
                    workbookList.push({
                        uiobject: workbookTitles[i],
                        dataname: workbookIDs[i]
                    });
                }
            Alteryx.Gui.manager.GetDataItem('workbookID').setStringList(workbookList);
            Alteryx.Gui.manager.GetDataItem('workbookID').UserDataChanged.push(enable_toWorksheetList,getWorkbookName,clearSheetList);
            }
            // Displays the workbook list view
            changeToWorkbooks();
        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            switch(jqXHR.status) {
                case 400:
                    document.getElementById("connectionStatus").innerHTML='400 Bad Request Error:  Reconfigure tool and try again';
                    break;
                case 401:
                    document.getElementById("connectionStatus").innerHTML='401 Invalid Token Error:  Token has expired, click Change Login Credentials to login';
                    break;
                case 503:
                    document.getElementById("connectionStatus").innerHTML='503 Service Unavailable Error:  Google API is unreachable, try again later';
                    break;
                default:
                    document.getElementById("connectionStatus").innerHTML='Error - Unable to reach API:  Reconfigure tool and try again';
            };                    
            document.getElementById("connectionStatusBox").setAttribute("style", "display: block; padding: 5px 5px 5px 5px; background: rgba(208, 2, 27, .2)");
        });
}        

// Retrieves a list of worksheets associated with the workbook selected from the workbook list
function get_worksheet_list(accessToken) {
    var auth = "Bearer " + Alteryx.Gui.manager.GetDataItem('accessToken').value;
    var numWorksheets;
    var worksheetReplace;
    var worksheetIDs = [];
    var worksheetTitles = [];
    worksheetList = [];
    var url = "https://spreadsheets.google.com/feeds/worksheets/" + Alteryx.Gui.manager.GetDataItem('workbookID').value + "/private/basic?alt=json";

    // API call settings
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "dataType": "json",
        "headers": {
            "authorization": auth,
            "cache-control": "no-cache",
        }
    };

    return $.ajax(settings)
        .done(function (data, textStatus) {
            document.getElementById("connectionStatusBox").setAttribute("style", "display: none");
            numWorksheets = data.feed.entry.length;
            worksheetReplace = "https://spreadsheets.google.com/feeds/worksheets/" + Alteryx.Gui.manager.GetDataItem('workbookID').value + "/private/basic/";

            for (var i = 0; i < numWorksheets; i++) {
                worksheetIDs.push(data.feed.entry[i].id.$t);
                worksheetIDs[i] = worksheetIDs[i].replace(worksheetReplace, "");
                worksheetTitles.push(data.feed.entry[i].title.$t);
            }

            enable_toConfigComplete();           
            populateWorksheetTable();

            // Populates the list of worksheets shown to the end user
            function populateWorksheetTable() {
                for (var i = 0; i < numWorksheets; i++) {
                    worksheetList.push({
                        uiobject: worksheetTitles[i],
                        dataname: worksheetIDs[i]
                    });
                }
            Alteryx.Gui.manager.GetDataItem('worksheetID').setStringList(worksheetList);
            }
            
            Alteryx.Gui.manager.GetDataItem('worksheetID').UserDataChanged.push(enable_toConfigComplete,getWorksheetName);
            // Displays the worksheet list view
            changeToWorksheets();
        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            switch(jqXHR.status) {
                case 400:
                    document.getElementById("connectionStatus").innerHTML='400 Bad Request Error:  Reconfigure tool and try again';
                    break;
                case 401:
                    document.getElementById("connectionStatus").innerHTML='401 Invalid Token Error:  Token has expired, click Change Login Credentials to login';
                    break;
                case 503:
                    document.getElementById("connectionStatus").innerHTML='503 Service Unavailable Error:  Google API is unreachable, try again later';
                    break;
                default:
                    document.getElementById("connectionStatus").innerHTML='Error - Unable to reach API:  Reconfigure tool and try again';
            };   
            document.getElementById("connectionStatusBox").setAttribute("style", "display: block; padding: 5px 5px 5px 5px; background: rgba(208, 2, 27, .2)");
        });
}        


/*********************************************************************************************
**********************************************************************************************

Functions that switch between different fieldsets in 
the configuration window and populate gui visuals

**********************************************************************************************
*********************************************************************************************/
// Changes the view to the accessMethod fieldset
function changeCredentials() {
    // Resets all fields to blank
    resetFields();
    Alteryx.Gui.manager.GetDataItem('view').setValue("1");
    $(document).ready(function () {
            $("#accessMethod").show();
            $("#onlineCreds").hide();
            $("#offlineCreds").hide();
            $("#workbooks").hide();
            $("#sheets").hide();
            $("#configComplete").hide();
        }
    );
}

// Changes the view to the onlineCreds fieldset
function changeToOnlineCreds() {
    $(document).ready(function () {
            $("#accessMethod").hide();
            $("#onlineCreds").show();
            $("#offlineCreds").hide();
            $("#workbooks").hide();
            $("#sheets").hide();
            $("#configComplete").hide();
        }
    );
}

// Changes the view to the offlineCreds fieldset
function changeToOfflineCreds() {
    Alteryx.Gui.manager.GetDataItem('view').setValue("5");
    $(document).ready(function () {
            $("#accessMethod").hide();
            $("#onlineCreds").hide();
            $("#offlineCreds").show();
            $("#workbooks").hide();
            $("#sheets").hide();
            $("#configComplete").hide();
        }
    );
}

// Changes the view to the workbooks fieldset - workbook list
function changeToWorkbooks() {
    Alteryx.Gui.manager.GetDataItem('view').setValue("2");
    $(document).ready(function () {
            $("#accessMethod").hide();
            $("#onlineCreds").hide();
            $("#offlineCreds").hide();
            $("#workbooks").show();
            $("#sheets").hide();
            $("#configComplete").hide();
        }
    );
}

// Changes the view to the sheets fieldset - worksheet list
function changeToWorksheets() {
    Alteryx.Gui.manager.GetDataItem('view').setValue("3");
    $(document).ready(function () {
            $("#accessMethod").hide();
            $("#onlineCreds").hide();
            $("#offlineCreds").hide();
            $("#workbooks").hide();
            $("#sheets").show();
            $("#configComplete").hide();
        }
    );
}

// Changes the view to the configComplete fieldset - configuration complete
function changeToConfigComplete() {
    Alteryx.Gui.manager.GetDataItem('view').setValue("4");
    // Retrieves the name of the workbook and worksheet to be displayed to end user
    getWorkbookName();
    getWorksheetName();
    $(document).ready(function () {
            $("#accessMethod").hide();
            $("#onlineCreds").hide();
            $("#offlineCreds").hide();
            $("#workbooks").hide();
            $("#sheets").hide();
            $("#configComplete").show();
    });
}

// Resets all fields to blank - used when a user decides to start over
function resetFields() {
    var blankList = [];
    Alteryx.Gui.manager.GetDataItem('workbookID').setStringList(blankList);
    Alteryx.Gui.manager.GetDataItem('workbookID').setValue('');
    Alteryx.Gui.manager.GetDataItem('worksheetID').setStringList(blankList);
    Alteryx.Gui.manager.GetDataItem('worksheetID').setValue('');
    Alteryx.Gui.manager.GetDataItem('client_id').setValue('');
    Alteryx.Gui.manager.GetDataItem('client_secret').setValue('');
    Alteryx.Gui.manager.GetDataItem('refresh_token').setValue('');
    Alteryx.Gui.manager.GetDataItem('accessToken').setValue('');
    document.getElementById("connectionStatusBox").setAttribute("style", "display:none");
}

// Resets workbook and worksheet lists and values
function resetSelections() {
    var blankList = [];
    Alteryx.Gui.manager.GetDataItem('workbookID').setStringList(blankList);
    Alteryx.Gui.manager.GetDataItem('workbookID').setValue('');
    Alteryx.Gui.manager.GetDataItem('worksheetID').setStringList(blankList);
    Alteryx.Gui.manager.GetDataItem('worksheetID').setValue('');
    Alteryx.Gui.manager.GetDataItem('workbookName').setValue('');
    Alteryx.Gui.manager.GetDataItem('worksheetName').setValue('');
}

// Enables the next button after a workbook is selected on the workbook list view
function enable_toWorksheetList() {
        if (Alteryx.Gui.manager.GetDataItem('workbookID').value == '' || Alteryx.Gui.manager.GetDataItem('workbookID').value == null) {
            document.getElementById("toWorksheetList").disabled = true;
        } else {
            document.getElementById("toWorksheetList").disabled = false;
        };
}

// Enables the next button after a worksheet is selected on the worksheet list view
function enable_toConfigComplete() {
        if (Alteryx.Gui.manager.GetDataItem('worksheetID').value == '' || Alteryx.Gui.manager.GetDataItem('worksheetID').value == null) {
            document.getElementById("toConfigComplete").disabled = true;
        } else {
            document.getElementById("toConfigComplete").disabled = false;
        };
}

// Populates the workbook name in the config complete view
function getWorkbookName() {
    var numFiles = Alteryx.Gui.manager.items[3].StringList.enums.length;

		// Returns the workbookName for a workbookID match
		for (var i = 0; i < numFiles; i++) {
			if (Alteryx.Gui.manager.GetDataItem('workbookID').value == Alteryx.Gui.manager.items[3].StringList.enums[i].dataName) {
				Alteryx.Gui.manager.GetDataItem('workbookName').setValue(Alteryx.Gui.manager.items[3].StringList.enums[i].uiObject);
				};
		};

    document.getElementById("configCompleteWorkbook").innerHTML = Alteryx.Gui.manager.GetDataItem('workbookName').value;
}

// Populates the worksheet name in the config complete view
function getWorksheetName() {
    var numFiles = Alteryx.Gui.manager.items[5].StringList.enums.length;

	// Returns the workbookName for a workbookID match
		for (var i = 0; i < numFiles; i++) {
			if (Alteryx.Gui.manager.GetDataItem('worksheetID').value == Alteryx.Gui.manager.items[5].StringList.enums[i].dataName) {
				Alteryx.Gui.manager.GetDataItem('worksheetName').setValue(Alteryx.Gui.manager.items[5].StringList.enums[i].uiObject);
				};
		};

    document.getElementById("configCompleteWorksheet").innerHTML = Alteryx.Gui.manager.GetDataItem('worksheetName').value;
}

// clears the Sheet list
function clearSheetList() {
    Alteryx.Gui.manager.GetDataItem('worksheetID').setStringList(workbookList);
    Alteryx.Gui.manager.GetDataItem('worksheetID').setValue('');
}

// Returns the config window to the last step the user was on before clicking off the tool
Alteryx.Gui.AfterLoad = function (manager, AlteryxDataItems) {
    $(document).ready(function () {
            $("#accessMethod").hide();
            $("#onlineCreds").hide();
            $("#offlineCreds").hide();
            $("#workbooks").hide();
            $("#sheets").hide();
            $("#configComplete").hide();
    });

    if (Alteryx.Gui.manager.GetDataItem("accessToken").value != '') {
        tokenValid(Alteryx.Gui.manager.GetDataItem("accessToken").value);
    } else {
        if (Alteryx.Gui.manager.GetDataItem('view').value == "5") {
            changeToOfflineCreds();
        } else {
            changeCredentials();
        };
    };
}


// Used to check that token is still valid within the AfterLoad function
function tokenValid(token) {
    if (Alteryx.Gui.manager.GetDataItem('client_id').value != "" && Alteryx.Gui.manager.GetDataItem('client_secret').value != "" && Alteryx.Gui.manager.GetDataItem('refresh_token').value != "") {
        get_access_token();
        viewSwitch();
    } else {
        // API call settings
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": VALIDURL + token,
            "method": "GET",
            "dataType": "jsonp",
        };


        return $.ajax(settings)
            .done(function (data, textStatus) {
                if (data.expires_in < 1 || data.expires_in == null) {
                    changeCredentials();
                    document.getElementById("connectionStatus").innerHTML='Token has expired - please re-enter login credentials';
                    document.getElementById("connectionStatusBox").setAttribute("style", "display: block; padding: 5px 5px 5px 5px; background: rgba(208, 2, 27, .2)");
                } else {
                    viewSwitch();
                };
            })

            .fail(function (jqXHR, textStatus, errorThrown) {
                changeCredentials();
                document.getElementById("connectionStatus").innerHTML='Token has expired - please re-enter login credentials';
                document.getElementById("connectionStatusBox").setAttribute("style", "display: block; padding: 5px 5px 5px 5px; background: rgba(208, 2, 27, .2)");
            });
        }
}

function viewSwitch() {
    switch (Alteryx.Gui.manager.GetDataItem('view').value) {
        case "2":
            get_workbook_list();
            changeToWorkbooks();
            break;
        case "3":
            get_worksheet_list();
            changeToWorksheets();
            break;
        case "4":
            changeToConfigComplete();
            break;
        case "5":
            changeToOfflineCreds();
            break;
        default:
            changeCredentials();
        };
}