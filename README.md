### Steps to reproduce the issue:

a) This build is showing that the lib is working fine when hmr inline is turned off:

```bash
$ yarn run dev:inline:off
```

Visit http://localhost:8080/hello and run `api.hello('world')` in the devTools console, you would see:

```
> api.hello('world')
hello world
```

b) This build is showing that the lib is broken when hmr inline is turned on.

Close previous build and run:

```bash
$ yarn run dev:inline:on
```

Visit http://localhost:8080/hello and run `api.hello('world')` in the devTools console, you would see:

```
[HMR] Waiting for update signal from WDS...
[WDS] Hot Module Replacement enabled.
[WDS] Live Reloading enabled.
> api.hello('world')
VM322:1 Uncaught TypeError: api.hello is not a function
    at <anonymous>:1:5
(anonymous) @ VM322:1
```

c) The main different is the devServer inline config:

```js
module.exports = {
    devServer: {
        hot: true,
        inline: true,
    },
}
```

d) Finding from the end of bundle:

```js
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./src/index.js");
/******/ 	__webpack_require__("./node_modules/webpack-dev-server/client/index.js?http://localhost:8080");
/******/ 	var __webpack_exports__ = __webpack_require__("./node_modules/webpack/hot/dev-server.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
```

As you can see, the `__webpack_exports__` is pointed to `dev-server.js` rather than `./src/index.js` which cause the problem.

e) The correct output:

The webpack-dev-server has prepended the inline script to entry in the correct order:
```
["./node_modules/webpack-dev-server/client/index.js?http://localhost:8080", "./node_modules/webpack/hot/dev-server.js", "./src/index.js"]
```

And webpack should expect to generate the bundle that points  `__webpack_exports__` to correct entry: `./src/index.js`:


```js
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./node_modules/webpack-dev-server/client/index.js?http://localhost:8080");
/******/ 	__webpack_require__("./node_modules/webpack/hot/dev-server.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
```
