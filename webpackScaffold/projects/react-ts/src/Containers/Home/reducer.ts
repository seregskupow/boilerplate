import * as ActionTypes from './actionTypes';

export default function HomeReducer(state = {}, action: any) {
  switch(action.type) {
    case ActionTypes.Hash: {
      return Object.assign({}, state, {
      });
    }
    default:
      return state;
  }
}
