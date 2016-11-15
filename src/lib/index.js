import reactStamp from 'react-stamp'
import _ from 'lodash'


function isRequiredUpdateObject(o) {
  return Array.isArray(o) || (o && o.constructor === Object.prototype.constructor)
}
function deepDiff(o1, o2, p) {
  const notify = (status) => {
    console.warn('Update %s', status)
    console.log('%cbefore', 'font-weight: bold', o1)
    console.log('%cafter ', 'font-weight: bold', o2)
  }
  if (!_.isEqual(o1, o2)) {
    console.group(p)
    if ([ o1, o2 ].every( (o) => typeof o === 'function' )) {
      notify('avoidable?')
    } else if (![ o1, o2 ].every(isRequiredUpdateObject)) {
      notify('required.')
    } else {
      const keys = _.union(Object.keys(o1), Object.keys(o2))
      for (const key of keys) {
        deepDiff(o1[key], o2[key], key)
      }
    }
    console.groupEnd()
  } else if (o1 !== o2) {
    console.group(p)
    notify('avoidable!')
    if (_.isObject(o1) && _.isObject(o2)) {
      const keys = _.union(Object.keys(o1), Object.keys(o2))
      for (const key of keys) {
        deepDiff(o1[key], o2[key], key)
      }
    }
    console.groupEnd()
  }
}


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

  const pureDesc = (
    { displayName: 'PureComponent'
    , shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
    }
  )

  const profileDesc = (
    { componentDidUpdate (prevProps, prevState) {
        deepDiff (
          { props: prevProps
          , state: prevState
          }
        , { props: this.props
          , state: this.state
          }
        , this.constructor.displayName
        )
      }
    }
  )

  function _pure (...desc) {
    return compose( pureDesc, ...desc )
  }
  function impure (...desc) {
    return compose( ...desc )
  }
  function profile (...desc) {
    return compose ( pureDesc, profileDesc, ...desc )
  }
  function impureProfile (...desc) {
    return compose ( profileDesc, ...desc )
  }
  const pure = Object.entries(
    { React
    , PropTypes
    , cloneElement
    , ...deps
    , defaults
    , impure
    , profile
    , impureProfile
    , destructure: () => [ { React, shallowCompare, ...deps }, defaults ]
    }
  ).reduce ( ( pure, [ depName, dep ] ) => Object.defineProperty( pure, depName, { value: dep, configurable: false, enumerable: true })
  , _pure
  )
  return Object.freeze(pure)
}
