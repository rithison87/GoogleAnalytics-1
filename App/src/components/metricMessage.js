import React from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash'
import * as metrics from '../utils/metrics'

class MetricMessage extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
  }

  // clicked(item) {
  //   console.log(item)
  //   store.metricsList.selection.splice(item,1);
  // }

  render() {
    let selections = this.store.metricsList.selection
    return (
      <div>
        {
          // onClick={() => this.clicked(idx)}
          selections.map((selection, idx) => <p className="selectionMessage-btn" key={idx}>{selection}</p>)
        }
      </div>
    );
  }
}

export default observer(MetricMessage); 
