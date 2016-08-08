export default function profile () {
  const performance = typeof window === 'object' ? window.performance : { now: () => process.hrtime }
  return (
    { displayName: 'Profiler'
    , init() {
        this.__performance__ = [ { init: performance.now() } ]
        this.performance = key => this.__performance__.push({ [key]: performance.now() })
        this.profile = () => console.table ? console.table(this.__performance__) : console.info(JSON.stringify(this.__performance__, null, 2))
      }
    , componentWillMount() {
        this.performance('componentWillMount')
      }
    , componentWillUnmount() {
        this.performance('componentWillUnmount')
      }
    , componentWillReceiveProps() {
        this.performance('componentWillUpdate')
      }
    , componentWillUpdate() {
        this.performance('componentDidUpdate')
      }
    , componentDidMount() {
        this.performance('componentDidMount')
      }
    , componentDidUpdate() {
        this.performance('componentDidUpdate')
      }
    }
  )
}
