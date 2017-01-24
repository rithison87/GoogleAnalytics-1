import React from 'react'
import { observer } from 'mobx-react'

class Summary extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  maxResults(advOptions) {
    return advOptions ? `Results limited to a maximum of ${this.store.maxResults} rows` : ''
  }

  render () {
    const account = this.store.accountsList.selection
    const webProperty = this.store.webPropertiesList.selection
    const profile = this.store.profilesList.selection
    const startDate = this.store.startDatePicker
    const endDate = this.store.endDatePicker
    const preDefDropDown = this.store.preDefDropDown
    const metrics = this.store.metricsList.selectedValues
    const metricGoals = this.store.metricsGoalsList.selectedValues
    const dimensions = this.store.dimensionsList.selectedValues
    const dimensionGoals = this.store.dimensionsGoalsList.selectedValues
    const segments = this.store.segmentsList.selectedValues
    const advOptions = this.store.advOptions
    const maxResults = this.maxResults(advOptions)
    const tableStyle = {
      width: '90%'
    }
    const thStyle = {
      width: '20%'
    }

    return (
      <div>
        <div>
          <b>Selected Account Details</b>
          <table style={tableStyle}>
            <tr>
              <th style={thStyle}>Account:</th>
              <th style={thStyle}>{account}</th>
            </tr>
            <tr>
              <th style={thStyle}>WebProperty:</th>
              <th style={thStyle}>{webProperty}</th>
            </tr>
            <tr>
              <th style={thStyle}>Profile:</th>
              <th style={thStyle}>{profile}</th>
            </tr>
          </table>
        </div>
        
        <div>
          <b>Selected Date</b>
          <table style={tableStyle}>
            <tr>
              <th style={thStyle}>Start Date:</th>
              <th style={thStyle}>{startDate}</th>
            </tr>
            <tr>
              <th style={thStyle}>End Date:</th>
              <th style={thStyle}>{endDate}</th>
            </tr>
          </table>
        </div>

        <div>
          <b>Selected Metrics and Goals</b>
          <div>
            <table>
            {
              metrics.map((selection, idx) => <tr><th key={idx}>{selection}</th></tr>)
            }
            {
              metricGoals.map((selection, idx) => <tr><th key={idx}>{selection}</th></tr>)
            }
            </table>
          </div>
        </div>
        <div>
          <b>Selected Dimensions and Goals</b>
          <div>
            <table>
            {
              dimensions.map((selection, idx) => <tr><th key={idx}>{selection}</th></tr>)
            }
            {
              dimensionGoals.map((selection, idx) => <tr><th key={idx}>{selection}</th></tr>)
            }
            </table>
          </div>
        </div>
        <div>
          <b>Selected Segments</b>
          <div>
            <table>
            {
              segments.map((selection, idx) => <tr><th key={idx}>{selection}</th></tr>)
            }
            </table>
          </div>
        </div>
        <div>
          <br></br>
          {maxResults}
        </div>
      </div>
    )
  }
}
export default observer(Summary)
