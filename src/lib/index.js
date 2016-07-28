import reactStamp from 'react-stamp'

const freezeValue = value => ({ value, enumerable: true, writable: false, configurable: false })

/** Creates an optimized pure compose function with dependencies tacked onto it for easy lib propagation. */
export default function pureStamp({ React, shallowCompare, ...deps } = {}, defaults = {}) {
  const { PropTypes, cloneElement } = React
  const { compose } = reactStamp(React)
  const pure = Object.entries({ React, PropTypes, cloneElement, ...deps, defaults })
    .reduce ( ( pure, [ depName, dep ]) => Object.defineProperty( pure
                                                                , depName
                                                                , freezeValue(dep)
                                                                )
            , function pure (...desc) {
                return compose(
                  { displayName: 'PureComponent'
                  , shouldComponentUpdate(nextProps, nextState) { return shallowCompare(this, nextProps, nextState) }
                  }
                  , ...desc
                )
              }
            )
  return Object.freeze(pure)
}
