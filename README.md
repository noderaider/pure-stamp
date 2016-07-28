### pure-stamp

Creates an optimized pure compose function with dependencies tacked onto it for easy lib propagation.


```jsx
import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import pureStamp from 'pure-stamp'

const pure = pureStamp({ React, shallowCompare[, other[, libs ]] }[, defaults = {}])

/** Wraps commonly required dependencies for passing around a lib and optional defaults object for propagating configuration. */
const { React, PropTypes, cloneElement, other, libs, defaults } = pure

/** PureStamp is a React component with shouldComponentUpdate implemented (shallowCompare). */
const PureComponent = pure (...desc?: Stamp|ReactDesc|SpecDesc[])


See [react-stamp](https://github.com/stampit-org/react-stamp) documentation for compose for usage.
```
