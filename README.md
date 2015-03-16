

Hot-mutate, simple reloading of functions and methods
===

This module allows you to use Webpack's [hot module replacement](https://webpack.github.io/docs/hot-module-replacement.html)
to reload code, but without having to handle dependencies or anything.
It mutates all instances of the module and it wraps the functions and methods.

As a simple example of usage look [here](https://github.com/DiThi/boilerplate).

Installing
---

Assuming you're using Webpack and HMR already.

    npm install --save hot-mutate

Usage
---

After `exports` is set, put this:

```javascript
    require('hot-mutate')(module)
```

That's all. Every exported function and every method of every exported class is
reloaded even if they're used in event handlers.

The only gotcha is that you should only use the functions after they have been
patched by hot-mutate. Therefore this won't update if you modify `hello`:

```javascript
    function hello(){
        alert('hello');
    }
    
    window.addEventListener('click', hello);
    
    module.exports = {hello: hello};
    require('hot-mutate')(module);
```

Instead, have an init function which is called at the very end, and if it's not
a method, remember to take the function from `exports`:

```javascript
    function hello(){
        alert('hello');
    }
    
    function init(){
        window.addEventListener('click', module.exports.hello);
    }
    
    module.exports = {hello: hello};
    require('hot-mutate')(module);
    init();
```
