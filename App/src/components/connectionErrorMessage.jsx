import React from 'react'
import { observer } from 'mobx-react'

class ConnectionErrorMessage extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (errorStatus) {
    return errorStatus !== '' ? 'connectionErrorMessage' : ''
  }

  messageText (errorStatus) {
    console.log('errorStatus:  ' + errorStatus)
    let text
// The original error messages are commented right after the new messages
    switch (errorStatus) {
      case '':
        text = ''
        break
      case 1:
        text = 'Token has expired - please re-enter login credentials'
        break
      case 400:
        text = 'Reconfigure tool and try again' // '400 Bad Request Error:  Reconfigure tool and try again'
        break
      case 401:
        text = 'Enter valid Google Analytics credentials' // '401 Unauthorized Error:  Enter valid Google Analytics credentials'
        break
      case 503:
        text = 'Google API is unreachable, try again later' // '503 Service Unavailable Error:  Google API is unreachable, try again later'
        break
      default:
        text = 'Error - Unable to reach API:  Reconfigure tool and try again'
    }

    return text
  }

  render () {
    let errorStatus = this.store.errorStatus
    let text = this.messageText(errorStatus)
    let divClass = this.addClass(errorStatus)

    return (
      <div id='connectionErrorMessageWarning' className={divClass}>
        {text}
      </div>
    )
  }
}
export default observer(ConnectionErrorMessage)
