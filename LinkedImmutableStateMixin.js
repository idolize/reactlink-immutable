'use strict';
var Immutable = require('immutable');

function ReactLink(value, requestChange) {
  this.value = value;
  this.requestChange = requestChange;
}

// Per the React docs, this.state MUST be a plain JS object, and not an Immutable collection,
// because React's setState API expects an object literal and will merge it
// (Object.assign) with the previous state.
//
// However, we can use Immutable data sructures on the nested properties of this.state.
// Ex: linkImmutableState(['one', 'two']) would translate to state.one.get('two')

var LinkedImmutableStateMixin = {
  linkImmutableState: function linkImmutableState(key, opts) {
    opts = opts || {};
    var setState = this.setState.bind(this);
    if (!key) throw new Error('Missing key');
    if (key instanceof Array) {
      if (!key.length) throw new Error('Empty array passed as key');
      key = key.slice(0); // clone to avoid destructive operations
    } else {
      key = [key];
    }

    var first = key.shift();
    var firstItem = this.state[first];
    var hasImmutable = key.length > 0;
    if (hasImmutable && typeof firstItem.getIn !== 'function') {
      throw new Error('Not an Immutable object: this.state.' + first);
    }
    var valueToReturn = hasImmutable ? firstItem.getIn(key) : firstItem;
    if (valueToReturn && typeof valueToReturn.toJS === 'function' && !opts.immutableValue) {
      // Convert to plain JS object
      valueToReturn = valueToReturn.toJS();
    }

    var partialState = {};
    return new ReactLink(
      valueToReturn,
      function requestChange(valueToSetInState) {
        valueToSetInState = opts.mutableState ? valueToSetInState : Immutable.fromJS(valueToSetInState);
        partialState[first] = hasImmutable ? firstItem.setIn(key, valueToSetInState) : valueToSetInState;
        setState(partialState);
      }
    );
  }
};

module.exports = LinkedImmutableStateMixin;
