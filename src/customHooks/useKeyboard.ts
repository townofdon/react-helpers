
/**
 * Shamelessly borrowed some components from https://www.npmjs.com/package/react-key-handler
 */

import React from 'react';

//  __  __     ______     ______     __  __     ______     __  __     ______     ______     ______     ______     _____    
// /\ \/\ \   /\  ___\   /\  ___\   /\ \/ /    /\  ___\   /\ \_\ \   /\  == \   /\  __ \   /\  __ \   /\  == \   /\  __-.  
// \ \ \_\ \  \ \___  \  \ \  __\   \ \  _"-.  \ \  __\   \ \____ \  \ \  __<   \ \ \/\ \  \ \  __ \  \ \  __<   \ \ \/\ \ 
//  \ \_____\  \/\_____\  \ \_____\  \ \_\ \_\  \ \_____\  \/\_____\  \ \_____\  \ \_____\  \ \_\ \_\  \ \_\ \_\  \ \____- 
//   \/_____/   \/_____/   \/_____/   \/_/\/_/   \/_____/   \/_____/   \/_____/   \/_____/   \/_/\/_/   \/_/ /_/   \/____/ 
// 

export const KEYDOWN = 'keydown';
export const KEYPRESS = 'keypress';
export const KEYUP = 'keyup';

export const KEYCODE_TAB = 9;
export const KEYCODE_ENTER = 13;

enum KeyEvent {
  keydown,
  keypress,
  keyup
};

type Callback = (any) => void;

type primitiveOrArray<T> = T | T[];

type KeyCode = primitiveOrArray<number>;

type Options = {
  keyCode?: KeyCode;
  keyEvent?: keyof typeof KeyEvent;
};

function matchesElementOrArray<T>(a: T | T[], b: T) {
  if (Array.isArray(a)) {
    return a.includes(b);
  }
  return a === b;
}

function isNullOrUndefined(value): boolean {
  return value === undefined || value === null;
}

function matchesKeyboardEvent(
  event: KeyboardEvent,
  keyCode: KeyCode,
): boolean {
  if (!isNullOrUndefined(keyCode)) {
    // Firefox handles keyCode through which
    const keyCodeTarget = event.keyCode || event.which;
    if (matchesElementOrArray(keyCode, keyCodeTarget)) {
      return true;
    }
  }

  return false;
}

export default function useKeyboard(callback: Callback, deps = [], {
  keyCode = KEYCODE_ENTER,
  keyEvent = KEYUP
}: Options = {}): void {
  React.useEffect(() => {
    const onKeyEvent = (ev) => {
      if (matchesKeyboardEvent(ev, keyCode)) {
        callback(ev.keyCode);
      }
    }
    window.document.addEventListener(keyEvent, onKeyEvent);

    return () => {
      window.document.removeEventListener(keyEvent, onKeyEvent);
    };
  }, [callback, keyCode, keyEvent, ...deps]);
}

