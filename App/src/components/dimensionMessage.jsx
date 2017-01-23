import React from 'react'
import { observer } from 'mobx-react'

const PropTypes = React.PropTypes

class DimensionMessage extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  render () {
    const dimensions = this.store.dimensionsList.selectedValues
    const goals = this.store.dimensionsGoalsList.selectedValues
    const total = this.store.totalDimensionsAndGoals

    return (
      <div>
        <div className='selectionMessage-outer'>Selected Dimensions and Goals ({total}/10)  :
          <div className='selectionMessage-inner'>
            {
              // onClick={() => this.clicked(idx)}
              dimensions.map((selection, idx) => (<p className='selectionMessage-btn' key={idx}>{selection}</p>))
            }
          </div>
          <div className='selectionMessage-inner'>
            {
              goals.map((selection, idx) => (<p className='goalSelectionMessage-btn' key={idx}>{selection}</p>))
            }
          </div>
        </div>
      </div>
    )
  }
}

DimensionMessage.propTypes = {
  store: PropTypes.object
}

export default observer(DimensionMessage)
