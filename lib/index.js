/* @flow */
import React, { createClass, DOM as e, PropTypes as t } from 'react'



let log = console.log.bind(console)

let style = {
  border: '1px solid black',
  position: 'absolute',
  display: 'inline-flex',
  flexDirection: 'column',
  top: 0,
  left: 0
}

let mainAxis = { start: 'x', end: 'x2', size: 'w' }
let crossAxis = { start: 'y', end: 'y2', size: 'h' }



export default createClass({
  name: 'popover',
  propTypes: {
    lockPoint: t.string.isRequired,
    children: t.element.isRequired
  },
  checkLayout() {
    this.doSelfMeasure()
    if (this.doCheckLockCoords()) {
      this.doResolve()
    }
  },
  doResolve() {
    log('doResolve')

    let p = { }

    /* Find the optimal zone to position self. Measure the size of each zone and use the one with
    the greatest area. */

    let frameCoords = getFrameCoords(this.frameEl)
    let zone = resolveZoneChoice(this.p2, frameCoords)
    let axis = (zone === 'left' || zone === 'right')
      ? { main: mainAxis, cross: crossAxis }
      : { main: crossAxis, cross: mainAxis }

    log('doResolve: zone:', zone, 'this.size', this.size, 'this.lockCoords', this.p2)

    /* When positioning self on the cross-axis do not exceed frame bounds. The strategy to achieve
    this is thus: First position cross-axis self to the cross-axis-center of the the lock. Then,
    offset self by the amount that self is past the boundaries of frame. */

    switch (zone) {
    case 'above': {
      p.x = this.p2.x - (this.size.w / 2) + (this.p2.w / 2)
      p.y = this.p2.y - this.size.h
      break;
    }
    case 'right': {
      p.x = this.p2.x2
      p.y = this.p2.y - (this.size.h / 2) + (this.p2.h / 2)
      break;
    }
    case 'below': {
      p.x = this.p2.x - (this.size.w / 2) + (this.p2.w / 2)
      p.y = this.p2.y2
      break;
    }
    case 'left': {
      p.x = this.p2.x - this.size.w
      p.y = this.p2.y - (this.size.h / 2) + (this.p2.h / 2)
      break;
    }
    }

    p.x2 = p.x + this.size.w
    p.y2 = p.y + this.size.h

    if (p[axis.cross.start] < frameCoords[axis.cross.start]) {
      p[axis.cross.start] = frameCoords[axis.cross.start]
    } else if (p[axis.cross.end] > frameCoords[axis.cross.end]) {
      p[axis.cross.start] = p[axis.cross.start] - (p[axis.cross.end] - frameCoords[axis.cross.end])
    }

    log('p.cross.start', p[axis.cross.start], 'frame.cross.start', frameCoords[axis.cross.start])
    log('p.cross.end', p[axis.cross.end], 'frame.cross.end', frameCoords[axis.cross.end])

    log('doResolve: layout position:', p)

    this.el.style.transform = `translate(${p.x}px, ${p.y}px)`
    this.p1 = this.p2
  },
  doSelfMeasure() {
    this.size = {
      w: this.el.offsetWidth,
      h: this.el.offsetHeight
    }
  },
  doCheckLockCoords() {
    let np = getCoords(this.lpEl)
    // log('doCheck: Current position:', p, this.p1, this.p2)
    if (!this.p1) {
      this.p2 = np
    } else if (!equalCoords(np, this.p2)) {
      this.p1 = this.p2
      this.p2 = np
    }
    return this.p1 !== this.p2
  },
  componentDidMount() {
    this.el = React.findDOMNode(this)
    this.lpEl = React.findDOMNode(this.props.children).querySelector(this.props.lockPoint)
    this.frameEl = window
    this.lpPosition1 = { x: this.lpEl.offsetLeft, y: this.lpEl.offsetTop }
    this.checkLayoutInterval = setInterval(this.checkLayout, 50)
  },
  componentWillUnmount() {
    clearInterval(this.checkLayoutInterval)
  },
  render() {
    let className = 'Popover'
    return (
      e.div({ className, style },
            e.h1({}, 'Title'),
            e.div({}, 'Popover contents.')
      )
    )
  }
})






function resolveZoneChoice (lock, frame) {
  return [
    { zone: 'above', w: frame.x2, h: lock.y },
    { zone: 'right', w: (frame.x2 - lock.x2), h: frame.y2 },
    { zone: 'below', w: frame.x2, h: (frame.y2 - lock.y2) },
    { zone: 'left', w: lock.x, h: frame.y2 }
  ]
  .reduce((a, b) => area(a) > area(b) ? a : b)
  .zone
}

function area (size) {
  return size.w * size.h
}

function getFrameCoords (el) {
  return { x: 0, y: 0, x2: el.innerWidth, y2: el.innerHeight }
}

function getCoords (el) {
  let c = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }
  c.x2 = c.x + c.w
  c.y2 = c.y + c.h
  return c
}



function equalCoords(c1, c2) {
  for (var key in c1) {
    if (c1[key] !== c2[key]) return false
  }
  return true
}