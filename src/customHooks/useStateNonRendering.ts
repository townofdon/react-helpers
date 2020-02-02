
import React from 'react';


//  __  __     ______     ______     ______     ______   ______     ______   ______                                                   
// /\ \/\ \   /\  ___\   /\  ___\   /\  ___\   /\__  _\ /\  __ \   /\__  _\ /\  ___\                                                  
// \ \ \_\ \  \ \___  \  \ \  __\   \ \___  \  \/_/\ \/ \ \  __ \  \/_/\ \/ \ \  __\                                                  
//  \ \_____\  \/\_____\  \ \_____\  \/\_____\    \ \_\  \ \_\ \_\    \ \_\  \ \_____\                                                
//   \/_____/   \/_____/   \/_____/   \/_____/     \/_/   \/_/\/_/     \/_/   \/_____/                                                
//                                                                                                                                    
//  __   __     ______     __   __     ______     ______     __   __     _____     ______     ______     __     __   __     ______    
// /\ "-.\ \   /\  __ \   /\ "-.\ \   /\  == \   /\  ___\   /\ "-.\ \   /\  __-.  /\  ___\   /\  == \   /\ \   /\ "-.\ \   /\  ___\   
// \ \ \-.  \  \ \ \/\ \  \ \ \-.  \  \ \  __<   \ \  __\   \ \ \-.  \  \ \ \/\ \ \ \  __\   \ \  __<   \ \ \  \ \ \-.  \  \ \ \__ \  
//  \ \_\\"\_\  \ \_____\  \ \_\\"\_\  \ \_\ \_\  \ \_____\  \ \_\\"\_\  \ \____-  \ \_____\  \ \_\ \_\  \ \_\  \ \_\\"\_\  \ \_____\ 
//   \/_/ \/_/   \/_____/   \/_/ \/_/   \/_/ /_/   \/_____/   \/_/ \/_/   \/____/   \/_____/   \/_/ /_/   \/_/   \/_/ \/_/   \/_____/ 
// 

/**
 * Hold stateful values without triggering re-renders.
 *
 * ## USAGE:
 *
 * ```
 * const SomeComponent = () => {
 *   const [getNumTimesRendered, setNumTimesRendered] = useStateNonRendering(0);
 *   function increment() {
 *     // this will not cause a re-render:
 *     setNumTimesRendered(
 *       getNumTimesRendered() + 1
 *     );
 *   }
 *   React.useEffect(() => {
 *     increment();
 *   });
 *   return (
 *     <p>
 *       Number of renders: {getNumRendered()}
 *     </p>
 *   );
 * };
 * ```
 *
 * @param initialVal {any}
 */
export default function useStateNonRendering(initialVal): [() => any, (any) => void] {
  const ref = React.useRef(initialVal);
  const getVal = () => ref.current;
  const setVal = val => { ref.current = val; };
  return [getVal, setVal];
}
