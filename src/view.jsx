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
    console.log('this.props.tree', this.props.tree);
    const displayWarning = this.props.confidence < 0.7;
    const lightON = displayWarning ? lightON : this.props.lightState == 'ON';
    return (
      <div className='column'>
        <h1>Your room</h1>
        <div className='row' style={{ justifyContent: 'center', marginBottom: 10 }}>
          <button onClick={ this.initializeAgent }>Initialize Agent</button>
          <i className='fa fa-spinner fa-spin fa-fw' style={{ color: this.props.initializing ? 'black' : 'white' }} />
        </div>
        {
          this.props.tree ?
          (
            <div className='row'>
              <div>
                <i className={ `fa fa-lightbulb-o fa-4x light-${ lightON ? 'on' : 'off' }` }/>
              </div>
              <div>
                <div>
                  <input type='checkbox' onChange={ this.updateMovement }/>&nbsp;Movement
                </div>
                <DateTimePicker
                  defaultValue={ this.state.date }
                  onChange={ this.updateDate } />
              </div>
            </div>
          ) : null
        }
        {
          displayWarning ?
          (
            <div className='row'>
              <div className='warning'>
                Can't take a decision, the confidence is too low...
              </div>
            </div>
          ) : null
        }
      </div>
    );
  },
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    tree: React.PropTypes.array,
    initializing: React.PropTypes.bool,
    lightState: React.PropTypes.string,
    confidence: React.PropTypes.number
  }
});

function mapStateToProps(state) {
  return {
    tree: state.tree,
    initializing: state.initializing,
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
