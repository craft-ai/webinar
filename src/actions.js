import { initialization, decide } from './learn';

export const REQUEST_TREE = 'REQUEST_TREE';
export function requestTree() {
  return {
    type: REQUEST_TREE
  };
}

export const RECEIVE_TREE = 'RECEIVE_TREE';
export function receiveTree(tree) {
  return {
    type: RECEIVE_TREE,
    tree: tree
  };
}

export function initialize() {
  return (dispatch) => {
    dispatch(requestTree());
    return initialization()
      .then((tree) => {
        return dispatch(receiveTree(tree));
      })
      .catch((error) => console.log('error', error));
  };
}

export const RECEIVE_LIGHT_STATE = 'RECEIVE_LIGHT_STATE';
export function receiveLightState(decision) {
  return {
    type: RECEIVE_LIGHT_STATE,
    lightState: decision.lightState,
    confidence: decision.confidence
  };
}

export function getDecision(movement, dateTime) {
  return (dispatch, getState) => {
    return decide(movement, dateTime, getState().tree)
      .then(decision => {
        return dispatch(receiveLightState(decision));
      })
      .catch(err => console.error(err));
  };
}