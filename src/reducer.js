import { REQUEST_TREE, RECEIVE_TREE, RECEIVE_LIGHT_STATE } from './actions';

export default function reducer(state = { tree: undefined, initializing: false, lightState: 'OFF', confidence: 0 }, action) {
  switch (action.type) {
    case REQUEST_TREE:
      return Object.assign({}, state, {
        initializing: true
      });
    case RECEIVE_TREE:
      return Object.assign({}, state, {
        tree: action.tree,
        initializing: false
      });
    case RECEIVE_LIGHT_STATE:
      return Object.assign({}, state, {
        lightState: action.lightState,
        confidence: action.confidence
      });
    default:
      return state;
  }
}
