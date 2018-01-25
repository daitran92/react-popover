import R, { DOM as E } from "react"
import createClass from "create-react-class"



const Tip = createClass({
  displayName: "tip",
  render() {
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
            position: "relative"
          }
        },
        E.div({
          className: "Popover-tipShadow",
          style: {
            position: "absolute",
            background: "#fff",
            boxShadow: "0 0 10px 0 rgba(0,0,0,.3)",
            transform: "rotate(45deg)"
          }
        })
      )
    )
    return (
      triangle
    )
  }
})


export {
  Tip as default
}
