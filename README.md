## pure-stamp

Creates an optimized pure compose function with dependencies tacked onto it for easy lib propagation.

[![Build Status](https://travis-ci.org/noderaider/pure-stamp.svg?branch=master)](https://travis-ci.org/noderaider/pure-stamp)
[![codecov](https://codecov.io/gh/noderaider/pure-stamp/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/pure-stamp)

[![NPM](https://nodei.co/npm/pure-stamp.png?stars=true&downloads=true)](https://nodei.co/npm/pure-stamp/)

### Install

`npm install -S pure-stamp`

### Usage

```jsx

import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import pureStamp from 'pure-stamp'

const pure = pureStamp({ React, shallowCompare[, other[, libs ]] }[, defaults = {}])

/** Wraps commonly required dependencies for passing around a lib and optional defaults object for propagating configuration. */
const { React, PropTypes, cloneElement, other, libs, defaults } = pure

/** PureStamp is a React component with shouldComponentUpdate implemented (shallowCompare). */
const PureComponent = pure (...desc?: Stamp|ReactDesc|SpecDesc[])


/** Need to stop shouldComponentUpdate for a minute? */
const ImpureComponent = pure.impure (...desc?: Stamp|ReactDesc|SpecDesc[])

```


See [react-stamp](https://github.com/stampit-org/react-stamp) documentation on compose for usage.
