import { RECEIVE_TREE, RECEIVE_LIGHT_STATE } from './actions';

export default function reducer(state = { tree: undefined, lightState: 'OFF', confidence: 0 }, action) {
  switch (action.type) {
    case RECEIVE_TREE:
      return Object.assign({}, state, {
        tree: action.tree,
        lightState: 'OFF',
        confidence: 0
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
