[![npm](https://img.shields.io/npm/v/@nativescript-community/css-theme.svg)](https://www.npmjs.com/package/@nativescript-community/css-theme)
[![npm](https://img.shields.io/npm/dt/@nativescript-community/css-theme.svg?label=npm%20downloads)](https://www.npmjs.com/package/@nativescript-community/css-theme)
[![GitHub forks](https://img.shields.io/github/forks/nativescript-community/css-theme.svg)](https://github.com/nativescript-community/css-theme/network)
[![GitHub stars](https://img.shields.io/github/stars/nativescript-community/css-theme.svg)](https://github.com/nativescript-community/css-theme/stargazers)

## Installation

* `tns plugin add @nativescript-community/css-theme`

Be sure to run a new build after adding plugins to avoid any issues.

## Usage

The theme will style your application using Element selectors - you don't need to add CSS classes on every element you
need to style.

```javascript
import "@nativescript-community/css-theme";
```

This JS takes care of updating several classes on the app root elements, something that got
[included in @nativescript/core](https://github.com/NativeScript/NativeScript/issues/7313) in {N} 6.1.

## Setting Dark or Light mode

Setting the theme mode from light to dark is now easier - instead of loading a new file, just find the root view and
set `.ns-dark` class to it - this will change all colorization to dark tones. For instance, if your page root is
RadSideDrawer, just add a class to it, like this:

```html
<drawer:RadSideDrawer class="ns-dark" xmlns:drawer="nativescript-ui-sidedrawer">
    ...
</drawer:RadSideDrawer>
```

If your root is a frame, you can do this

```html
<Frame class="ns-dark" defaultPage="root"></Frame>
```

For **Angular**, if your root is a `page-router-outlet`, you can set the .ns-dark class on it - it will pass it down to the
Frame it renders.

## Setting Dark or Light mode from JavaScript

Setting the theme mode from JavaScript is also much easier now - just import the theme and call Theme.setMode() with
your preferred mode - either Theme.Light or Theme.Dark, like this:

```javascript
import Theme from "@nativescript-community/css-theme";

Theme.setMode(Theme.Dark); // Or Theme.Light
```

Keep in mind that in {N} 6.2 these changes will override the default system mode. To 
restore it, use Theme.Auto (available since Theme 2.3.0):

```javascript
import Theme from "@nativescript-community/css-theme";

Theme.setMode(Theme.Auto);
```

Additionally there is another helper method - toggleMode, which can be used without parameters to just toggle the mode
or with a boolean parameter to ensure light or dark mode is set:

```javascript
import Theme from "@nativescript-community/css-theme";

Theme.toggleDarkMode(); // to toggle between the modes

// or

Theme.toggleDarkMode(true);  // to ensure dark mode
Theme.toggleDarkMode(false); // to ensure light mode
```

##### A note of warning

Due to limitation in Playground the JS Theme API cannot be imported like an ES6 module in a TS/Angular projects. You'll
have to resort to requiring it:

```javascript
const Theme = require("@nativescript-community/css-theme");

Theme.setMode(Theme.Dark); // Or Theme.Light
```

## More root classes

In addition to `.ns-light` and `.ns-dark` classes, the theme's little JavaScript file introduces `.ns-root` on the root element,
`.ns-android/.ns-ios` depending on the current platform (which the theme extensively uses) and additionally
`.ns-portrait/.ns-landscape` and `.ns-phone/.ns-tablet`, which should be self-explanatory.
Of course `.ns-portrait/.ns-landscape` get updated on orientation change, so you can use it to show a two pane layout
in landscape, for instance.


## Using Theme variables

There are several functions and mixins in the core theme, that can be used in your projects, as long as you're using
SASS/SCSS.

If you need to access specific theme variables like simple colors or sizes, do it through the `const` function:

```scss
Button {
    background-color: const(forest);
    height: const(btn-height);
}
```

You can get light/dark colors:

```scss
Button {
    color: light(primary);

    .ns-dark & {
        color: dark(primary);
    }
}
```
