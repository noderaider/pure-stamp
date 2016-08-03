import reactStamp from 'react-stamp'

const CONNECT_KEY = 'connect'

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

  const HAS_CONNECT = Object.keys(deps).includes(CONNECT_KEY)

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
                let mapState
                let mapDispatch
                let merge
                let options

                /** Strips mapState, mapDispatch, mergeProps, and options from any 'connect' keys on description object. */
                function stripConnect (reactDesc) {
                  return Object.entries(reactDesc).reduce((reduced, [ key, value ]) => {
                    /** If key is not connect key, pass the prop along. */
                    if(key !== CONNECT_KEY)
                      return { ...reduced, [key]: value }

                    /** key is connect key, strip and compose each of the present connect functions */
                    const { mapStateToProps, mapDispatchToProps, mergeProps } = value

                    if(mapStateToProps) {
                      if(mapStateToProps.length === 1 && (!mapState || mapState.length === 1))
                        mapState = state => ({ ...(mapState ? mapState(state) : {}), ...mapStateToProps(state) })
                      else
                        mapState = (...args) => ({ ...(mapState ? mapState(...args) : {}), ...mapStateToProps(...args) })
                    }
                    if(mapDispatchToProps) {
                      if(mapDispatchToProps.length === 1 && (!mapDispatch || mapDispatch.length === 1))
                        mapDispatch = dispatch => ({ ...(mapDispatch ? mapDispatch(dispatch) : {}), ...mapDispatchToProps(dispatch) })
                      else
                        mapDispatch = (...args) => ({ ...(mapDispatch ? mapDispatch(...args) : {}), ...mapDispatchToProps(...args) })
                    }
                    if(mergeProps)
                      merge = (...args) => ({ ...(merge ? merge(...args) : {}), ...mergeProps(...args) })
                    if(value.options)
                      options = { ...(options || {}), ...value.options }
                    return reduced
                  }, {})
                }

                const Stamp = compose(
                  { displayName: 'PureComponent'
                  , shouldComponentUpdate(nextProps, nextState) {
                      return shallowCompare(this, nextProps, nextState)
                    }
                  }
                    /** If redux connect dep passed and connect key detected, will strip out their mapStateToProps and mapDispatchToProps and apply them automatically. */
                  , ...(HAS_CONNECT ? desc.map(stripConnect) : desc)
                )

                const useConnect = HAS_CONNECT && (mapState || mapDispatch || merge)
                return useConnect ? deps.connect(mapState, mapDispatch, merge, options)(Stamp)
                                  : Stamp
              }
            )
  return Object.freeze(pure)
}
