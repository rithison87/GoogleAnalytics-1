//Accounts menu functions

//changes
const populateAccountsList = (store) => {
  const token = store.accessToken
  const fetchAccounts = getAcccountsAjaxCall(token);

  const parseAccounts = (results) => {
    const accounts = results.items;
    const accountsList = accounts.map((d, i) => {
      return {uiobject: d.name, dataname: d.id}
    });
    return accountsList;
  }

  const setAccountsDropdownMenu = (accountsList) => {
    //Alteryx.Gui.manager.GetDataItem('accountsDropDown').setStringList(accountsList);
    store.accountsList.stringList = accountsList;
    console.log(accountsList);
  }

  fetchAccounts
    .then(parseAccounts)
    .done(setAccountsDropdownMenu)
    //.fail(handleApiFail)
}

const getAcccountsAjaxCall = (accessToken) => {
    const auth = "Bearer " + accessToken
    const url = "https://www.googleapis.com/analytics/v3/management/accounts"

    const settings = {
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
};

export { populateAccountsList }
