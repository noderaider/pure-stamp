import reactStamp from 'react-stamp'

const freezeValue = value => ({ value, enumerable: true, writable: false, configurable: false })

/**
 * Creates an optimized pure compose function with dependencies tacked onto it for easy lib propagation.
 * @param  {Object}         options.React           React dependency.
 * @param  {Object}         options.shallowCompare  React shallowCompare add-on dependency.
 * @param  {Array<Object>}  options.deps            Optional dependencies to propagate.
 * @param  {Object}         defaults                Optional configuration object to propagate.
 * @return {function}                                 pure compose function with propagated dependencies and defaults.
 */
export default function pureStamp({ React, shallowCompare, ...deps } = {}, defaults = {}) {
  const { PropTypes, cloneElement } = React
  const { compose } = reactStamp(React)
  const pure = Object.entries({ React
                              , PropTypes
                              , cloneElement
                              , ...deps
                              , defaults
                              , impure: compose
                              , destructure: () => [ { React, shallowCompare, ...deps }, defaults ]
                              })
    .reduce ( ( pure, [ depName, dep ]) => Object.defineProperty( pure
                                                                , depName
                                                                , freezeValue(dep)
                                                                )
            , function pure (...desc) {
                return compose(
                  { displayName: 'PureComponent'
                  , shouldComponentUpdate(nextProps, nextState) {
                      return shallowCompare(this, nextProps, nextState)
                    }
                  }
                  , ...desc
                )
              }
            )
  return Object.freeze(pure)
}
