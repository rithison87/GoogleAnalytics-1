import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash'
import * as metrics from '../utils/metrics'

class MetricMessage extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
  }

  addClass(total) {
    return total < 1 || total > 10 ? 'warning' : ''
  }

  messageText(total) {
    let text
    
    if (total < 1) {
      text = 'At least one metric must be selected.';
    } else if (total > 10) {
      text = 'Maximum of ten metrics can be chosen.  Please remove metric(s).';
    } else {
      text = '';
    };

    return text;
  }

  render() {
    let selections = this.store.metricsList.selection
    let total = this.store.totalMetricsAndGoals
    let text = this.messageText(total)
    let divClass = this.addClass(total)

    return (
      <div>
        <div className="selectionMessage-inner">
          {
            // onClick={() => this.clicked(idx)}
            selections.map((selection, idx) => <p className="selectionMessage-btn" key={idx}>{selection}</p>)
          }
        </div>
        <div id="metricWarning" className={divClass}>
          {text}
        </div>
      </div>
    );
  }
}

export default observer(MetricMessage); 
