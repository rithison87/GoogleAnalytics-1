import React from 'react'
import { observer } from 'mobx-react'

class DimensionBubbleMessage extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (total) {
    return total > 7 ? 'bubbleWarning' : ''
  }

  messageText (total) {
    let text

    if (total > 7) {
      text = 'Maximum of seven dimensions and goals may be selected'
    } else {
      text = ''
    };

    return text
  }

  render () {
    const total = this.store.totalDimensionsAndGoals
    const text = this.messageText(total)
    const divClass = this.addClass(total)

    return (
      <div id='dimensionWarning' className={divClass}>
        {text}
      </div>
    )
  }
}
export default observer(DimensionBubbleMessage)
