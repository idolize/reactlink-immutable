ReactLink-Immutable
===================

A [React](https://facebook.github.io/react/) mixin that provides two-way data binding for components using [ImmutableJS](https://facebook.github.io/immutable-js/) data structures as properties of `this.state`.

## Huh?

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

## Credits

- Author: [David Idol](http://daveidol.com)
- License: [MIT](http://opensource.org/licenses/MIT)