ReactLink-Immutable [![Version][npm-image]][npm-url]
===================

A [React](https://facebook.github.io/react/) mixin that provides two-way data binding for components using [ImmutableJS](https://facebook.github.io/immutable-js/) data structures as properties of `this.state`.

## Huh? ReactLink?

Ok, let's back up a little bit. React provides a method, known as [ReactLink](https://facebook.github.io/react/docs/two-way-binding-helpers.html), to update `this.state` on a component whenever the value of an `<input>` field changes. This method is exposed by the convenient mixin `React.addons.LinkedStateMixin`, which essentially just binds the `onChange` event handler to the `this.setState()` function of the `<input>` field.

This is great, especially when creating a component with multiple input fields, but it starts to fall apart if you want to use deeply-nested objects inside `this.state` of your component.

In that case, [Facebook recomments using their ImmutableJS library](https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state) to create immutable data structures, and use those as properties on `this.state`.

The upside of using immutable data structures is that the shallow update we get with `this.setState()` still works, and we can use [`React.addons.PureRenderMixin`](https://facebook.github.io/react/docs/pure-render-mixin.html) to get a boost in performance without any expensive deep equality checks.

## So what does this do then?

This library provides an alternative version of `React.addons.LinkedStateMixin` that will let you "link" the value of your `<input>` with an ImmutableJS data strucutre.

So you can take advantage of all the good Immutable, nested data structure stuff we just talked about while still having the sugary, easy-to-use syntax of `LinkedStateMixin`.

## Ok, how do I use it?

First, install it with `npm install --save reactlink-immutable`.

Then, just use it like you normally would with `LinkedStateMixin`; except pass an array of keys instead of a string.

```js
var LinkedImmutableStateMixin = require('reactlink-immutable');
var Map = require('immutable').Map;
var WithImmutableLink = React.createClass({
  mixins: [LinkedImmutableStateMixin],
  getInitialState: function() {
    return { dog: Map({name: 'Sparky', kind: 'Lab'}) };
  },
  render: function() {
    return (
      <form>
        <input type="text" valueLink={this.linkImmutableState(['dog', 'name'])} />
        <input type="text" valueLink={this.linkImmutableState(['dog', 'kind'])} />
      </form>
    );
  }
});
```

## Other notes

For convenience, a single string parameter is still supported for the key (rather than an array), which will make it behave like the standard `this.linkState` method.

By default, any non-primative values (such as `Immutable.List` or `Immutable.Map` objects) you link to will be converted to their plain JS equivalent (ex: `Array` or `Object`) via the Immutable `toJS()` function. However, there is an optional second parameter to `linkImmutableState`, which will disable this behavior if specified.

Ex: `this.linkImmutableState(['myImmutable', 'myList'], true)` will keep the `myList` value as an `Immutable.List` instead of converting it to an `Array`.

## Credits

- Author: [David Idol](http://daveidol.com)
- License: [MIT](http://opensource.org/licenses/MIT)


[npm-image]: https://img.shields.io/npm/v/reactlink-immutable.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/reactlink-immutable
