import React from 'react'
import { observer } from 'mobx-react'

class SegmentBubbleMessage extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  addClass (total) {
    return total > 4 ? 'bubbleWarning' : ''
  }

  messageText (total) {
    let text

    if (total > 4) {
      text = 'Maximum of 4 segments may be selected'
    } else {
      text = ''
    };

    return text
  }

  render () {
    const total = this.store.totalSegments
    const text = this.messageText(total)
    const divClass = this.addClass(total)

    return (
      <div id='segmentWarning' className={divClass}>
        {text}
      </div>
    )
  }
}
export default observer(SegmentBubbleMessage)
