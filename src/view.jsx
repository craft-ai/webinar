import moment from 'moment';
import React from 'react';
import reducer from './reducer';
import thunkMiddleware from 'redux-thunk';
import { initialize, getDecision } from './actions';
import { applyMiddleware, createStore } from 'redux';
import { DateTimePicker } from 'react-widgets';
import { connect, Provider } from 'react-redux';
import { render } from 'react-dom';

function configureStore(initialStateJson = {}) {
  return createStore(
    reducer,
    initialStateJson,
    applyMiddleware(
      thunkMiddleware
    )
  );
}

const store = configureStore();

const momentLocalizer = require('react-widgets/lib/localizers/moment');
momentLocalizer(moment);

const View = React.createClass({
  getInitialState: function() {
    return {
      movement: false,
      date: new Date(1272745200000)
    };
  },
  updateMovement: function(event) {
    const movement = event.currentTarget.checked;
    const { dispatch } = this.props;
    dispatch(getDecision(movement, this.state.date));
    this.setState({ movement: movement });
  },
  updateDate: function(date, dateStr) {
    const { dispatch } = this.props;
    dispatch(getDecision(this.state.movement, moment(date)));
    this.setState({ date: date });
  },
  initializeAgent: function() {
    const { dispatch } = this.props;
    dispatch(initialize());
  },
  render: function() {
    console.log('this.props.lightState', this.props.lightState);
    console.log('this.props.confidence', this.props.confidence);
    const lightON = this.props.lightState == 'ON';
    return (
      <div className='column'>
        <h1>Your room</h1>
        <div className='row'>
          <div>
            <i className={ `fa fa-lightbulb-o fa-4x light-${ lightON ? 'on' : 'off' }` }/>
          </div>
          <div>
            <button onClick={ this.initializeAgent }>Initialize Agent</button>
            <div>
              <input type='checkbox' onChange={ this.updateMovement }/>&nbsp;Movement
            </div>
            <DateTimePicker
              defaultValue={ this.state.date }
              onChange={ this.updateDate } />
          </div>
        </div>
      </div>
    );
  },
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    lightState: React.PropTypes.string,
    confidence: React.PropTypes.number
  }
});

function mapStateToProps(state) {
  return {
    lightState: state.lightState,
    confidence: state.confidence
  };
}

const ViewState = connect(mapStateToProps)(View);

render(
  <Provider store={store}>
    <ViewState />
  </Provider>,
  document.getElementById('main')
);
