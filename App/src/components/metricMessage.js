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
          selections.map((selection, idx) => <button type="button" className="selectionMessage-btn">{selection}</button>)
        }
      </div>
    );
  }
}

export default observer(MetricMessage); 
