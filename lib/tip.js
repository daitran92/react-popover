import R, { DOM as E } from "react"



const Tip = R.createClass({
  displayName: "tip",
  render () {
    const { direction } = this.props
    const size = this.props.size || 24
    const isPortrait = direction === "up" || direction === "down"
    const mainLength = size
    const crossLength = size * 2
    const points = (
      direction === "up" ? `0,${mainLength} ${mainLength},0, ${crossLength},${mainLength}`
      : direction === "down" ? `0,0 ${mainLength},${mainLength}, ${crossLength},0`
      : direction === "left" ? `${mainLength},0 0,${mainLength}, ${mainLength},${crossLength}`
      : `0,0 ${mainLength},${mainLength}, 0,${crossLength}`
    )
    const props = {
      className: "Popover-tip",
      width: isPortrait ? crossLength : mainLength,
      height: isPortrait ? mainLength : crossLength,
    }
    const triangle = (
      E.div(
        {
          className: "Popover-tipWrapper",
          style: {
            height: isPortrait ? `${size}px` : 'auto',
            position: 'relative'
          }
        },
        E.div({
          className: "Popover-tipShadow",
          style: {
            position: 'absolute',
            background: 'transparent',
            boxShadow: '0 2px 10px 0 rgba(0,0,0,.3)',
            transform: 'rotate(45deg)'
          }
        }),
        E.svg(props,
          E.polygon({
            className: "Popover-tipShape",
            points,
          })
        )
      )
    )
    return (
      triangle
    )
  },
})


export {
  Tip as default,
}
