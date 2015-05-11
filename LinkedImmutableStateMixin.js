'use strict';

function ReactLink(value, requestChange) {
  this.value = value;
  this.requestChange = requestChange;
}

// Per the React docs:
// 
// Note that state must be a plain JS object, and not an Immutable collection,
// because React's setState API expects an object literal and will merge it
// (Object.assign) with the previous state.
// 
// However, we can use Immutable data sructures for nested state.
// Ex: linkImmutableState(['one', 'two']) would translate to state.one.get('two')

var LinkedImmutableStateMixin = {
  linkImmutableState: function linkImmutableState(key) {
    var setState = this.setState.bind(this);
    if (!key) throw new Error('Missing key');
    if (key instanceof Array) {
      if (!key.length) throw new Error('Empty array passed as key');
      key = key.slice(0); // clone to avoid destructive operations
    } else {
      key = [key];
    }
    
    var first = key.shift();
    var rootItem = this.state[first];
    var hasImmutable = key.length > 0;
    if (hasImmutable && typeof rootItem.getIn !== 'function') {
      throw new Error('Not an Immutable object: this.state.' + first);
    }

    var partialState = {};
    return new ReactLink(
      hasImmutable ? rootItem.getIn(key) : rootItem,
      function requestChange(newValue) {
        partialState[first] = hasImmutable ? rootItem.setIn(key, newValue) : newValue;
        setState(partialState);
      }
    );
  }
};

module.exports = LinkedImmutableStateMixin;
