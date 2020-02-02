
import React from 'react';

import useStateNonRendering from './useStateNonRendering';

//  __  __     ______     ______     ______     __   __     __     __    __     ______     ______   __     ______     __   __
// /\ \/\ \   /\  ___\   /\  ___\   /\  __ \   /\ "-.\ \   /\ \   /\ "-./  \   /\  __ \   /\__  _\ /\ \   /\  __ \   /\ "-.\ \
// \ \ \_\ \  \ \___  \  \ \  __\   \ \  __ \  \ \ \-.  \  \ \ \  \ \ \-./\ \  \ \  __ \  \/_/\ \/ \ \ \  \ \ \/\ \  \ \ \-.  \
//  \ \_____\  \/\_____\  \ \_____\  \ \_\ \_\  \ \_\\"\_\  \ \_\  \ \_\ \ \_\  \ \_\ \_\    \ \_\  \ \_\  \ \_____\  \ \_\\"\_\
//   \/_____/   \/_____/   \/_____/   \/_/\/_/   \/_/ \/_/   \/_/   \/_/  \/_/   \/_/\/_/     \/_/   \/_/   \/_____/   \/_/ \/_/
//

/**
 * Round a number to n precision.
 * @param num {number}
 * @param precision {number}
 */
function round(num, precision: number = 2): number {
  const exp = (10 ** precision);
  return Math.round((parseFloat(num) || 0) * exp) / exp;
}

/**
 * Shamelessly borrowed from https://gist.github.com/gre/1650294
 * __/--\__/--\__/--\__/--\__/--\__/--\__/--\__/--\__/--\__/--\__
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
const easing = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

export enum EasingFunction {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
}

interface Params {
  animationDuration?: number;
  isLoading?: boolean;
  easingFunction?: keyof typeof EasingFunction;
};

/**
 * Get the t and inverted t values for animating an element over n duration.
 *
 * ## USAGE:
 *
 * ```
 * const [tIn, tOut] = useAnimation({ animationDuration: 2000 });
 * const style = {
 *   position: fixed,
 *   // start animation from top of screen and move downwards
 *   top: 0 * tIn + 100 * tOut,
 * };
 * ```
 */
export default function useAnimation({
  animationDuration = 1000,
  isLoading,
  easingFunction = 'easeInOutQuint',
}: Params = {}) {
  const [getAnimationTimeStart, setAnimationTimeStart] = useStateNonRendering(Date.now());
  const [pct, setPct] = React.useState(0);

  //
  // Initial Animation
  //
  React.useEffect(() => {
    if (isLoading) return;
    const t = setTimeout(() => {
      if (pct < 1) {
        const timeCurrent = Date.now();
        let pctNew = round((timeCurrent - getAnimationTimeStart()) / animationDuration, 3);
        if (pctNew === pct) pctNew += 0.001;
        if (pctNew < 0.001) pctNew = 0.001;
        if (pctNew > 1) pctNew = 1;
        setPct(pctNew);
      }
    }, 16);

    // cleanup
    return () => {
      clearTimeout(t);
    }
  }, [pct, isLoading, animationDuration]);

  const reTriggerAnimation = () => {
    setAnimationTimeStart(Date.now());
    if (!isLoading) return;
    // val 0.01 allows redrawing chart to avoid flicker
    setPct(0.01);
  };

  //
  // Loading State - re-trigger animation
  //
  React.useEffect(() => {
    reTriggerAnimation();
  }, [isLoading, animationDuration]);

  //
  // Resize event handler
  // - note - placing `reTriggerAnimation` inside `setTimeout` prevents excessive redraws
  //
  React.useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        reTriggerAnimation();
      }, 200);
    };
    window.addEventListener('resize', onResize);

    // cleanup
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const t = easing[easingFunction](pct);

  return [t, Math.abs(t - 1)];
}
