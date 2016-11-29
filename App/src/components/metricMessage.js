import React from 'react';
import { observer } from 'mobx-react';

const Metric = ( { metricName }) => <h2>{metricName}</h2>;

function MetricList( { selections }) {
  return (
    <div>
      {
        selections.map((selection, idx) => <Metric key={idx} metricName={selection} />)
      }
    </div>
  );
}


class MetricMessage extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
  }

  render() {
    return (
      <MetricList selections={this.store.metricsList.selection} />
    );
  }
}

export default observer(MetricMessage); 
