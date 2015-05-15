'use strict';

var Immutable = require('immutable');
var chai = require('chai');
var expect = chai.expect;

var linkImmutableState = require('../LinkedImmutableStateMixin').linkImmutableState;

function linkAndRun(linkFunc, key, newValue, disableToJS) {
  // Sets up the two-way binding and then issues a change
  var result = linkFunc(key, disableToJS);
  result.requestChange(newValue);
  return result;
}

describe('linkImmutableState', function() {
  var test, link;

  beforeEach(function() {
    // Shim for a React component
    test = {
      state: {},
      setState: function setState(partial) {
        var keys = Object.keys(partial);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          this.state[key] = partial[key];
        }
      }
    };
    // "Mixin" the function to the fake component
    link = linkImmutableState.bind(test);
    // Sanity check
    expect(Object.keys(test.state)).to.have.length(0);
  });

  it('should throw when key is missing', function() {
    expect(function() {
      link();
    }).to.throw('Missing key');

    expect(function() {
      link(null);
    }).to.throw('Missing key');
  });

  it('should throw when key is empty array', function() {
    expect(function() {
      link([]);
    }).to.throw('Empty array passed as key');
  });

  it('should update when key is string', function() {
    test.state.a = 'wrong';
    linkAndRun(link, 'a', 'correct');
    expect(test.state.a).to.equal('correct');
  });

  it('should update when key is array with single element', function() {
    test.state.a = 'wrong';
    linkAndRun(link, ['a'], 'correct');
    expect(test.state.a).to.equal('correct');
  });

  it('should throw when not using Immutable data structure', function() {
    test.state.a = {};
    expect(function() {
      link(['a', 'b']);
    }).to.throw('Not an Immutable object: this.state.a');
  });

  it('should update when using Immutable Map', function() {
    test.state.a = new Immutable.Map({ b: 'wrong' });
    var origA = test.state.a;
    linkAndRun(link, ['a', 'b'], 'correct');
    expect(test.state.a).to.not.equal(origA);
    expect(test.state.a.get('b')).to.equal('correct');
  });

  it('should update when using deeply-nested Immutable Map', function() {
    test.state.a = new Immutable.Map({ b: new Immutable.Map({ c: 'wrong' }) });
    var origB = test.state.a.get('b');
    linkAndRun(link, ['a', 'b', 'c'], 'correct');
    expect(test.state.a.get('b')).to.not.equal(origB);
    expect(test.state.a.getIn(['b', 'c'])).to.equal('correct');
  });

  it('should update arrays correctly', function() {
    test.state.a = new Immutable.Map({ b: new Immutable.Map({ c: new Immutable.List(['one', 'two']) }) });
    var origB = test.state.a.get('b');
    var newList = new Immutable.List(['correct']);
    var res = linkAndRun(link, ['a', 'b', 'c'], newList);
    expect(res.value).to.be.instanceof(Array);
    expect(res.value).to.have.members(['one', 'two']);
    expect(test.state.a.get('b')).to.not.equal(origB);
    expect(test.state.a.getIn(['b', 'c'])).to.equal(newList);
  });

  it('should do nothing when Immutable doesn\'t change', function() {
    test.state.a = new Immutable.Map({ b: new Immutable.Map({ c: 'correct' }) });
    var origB = test.state.a.get('b');
    var origC = test.state.a.getIn(['b', 'c']);
    linkAndRun(link, ['a', 'b', 'c'], 'correct');
    expect(test.state.a.get('b')).to.equal(origB);
    expect(test.state.a.getIn(['b', 'c'])).to.equal(origC);
  });

  it('should allow turning off toJS', function() {
    var origC = new Immutable.List(['one', 'two']);
    test.state.a = new Immutable.Map({ b: new Immutable.Map({ c: origC }) });
    var origB = test.state.a.get('b');
    var newList = new Immutable.List(['correct']);
    var res = linkAndRun(link, ['a', 'b', 'c'], newList, true);
    expect(res.value).to.be.instanceof(Immutable.List);
    expect(res.value).to.equal(origC);
    expect(test.state.a.get('b')).to.not.equal(origB);
    expect(test.state.a.getIn(['b', 'c'])).to.equal(newList);
  });
});
