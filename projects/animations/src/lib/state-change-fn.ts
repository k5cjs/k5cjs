const enum DefaultState {
  Void = 'void',
  Null = 'null',
}

const enum BooleanState {
  False = 'false',
  True = 'true',
}

const hideStates = [DefaultState.Void, BooleanState.False];
const showStates = [DefaultState.Null, BooleanState.True];
const allStates = [...hideStates, ...showStates];

export const stateChangeToFast =
  (time: number) =>
  (_from: string, _to: string, element: HTMLElement, params?: { time?: number }): boolean => {
    const attr = 'toggle-y-time';
    const now = Date.now();

    const elementTime = element.getAttribute(attr);
    element.setAttribute(attr, now.toString());

    if (!elementTime) {
      element.setAttribute(attr, now.toString());

      return false;
    }

    const previousTime = Number(elementTime);
    const durationBetweenStates = now - previousTime;

    const animationTime = params?.time ?? time;

    return durationBetweenStates < animationTime / 3;
  };

export const stateChangeEnter = (fromState: string, toState: string) => {
  const fromStateString = String(fromState) as DefaultState | BooleanState;
  const toStateString = String(toState) as DefaultState | BooleanState;

  if (fromStateString === toStateString) return false;
  /**
   * this is use when user use boolean value
   * and first state is void
   * and second state is false
   * so we don't need to animate
   */
  if (fromStateString === DefaultState.Void && toStateString === BooleanState.False) return false;

  return (
    (hideStates.includes(fromStateString) && showStates.includes(toStateString)) ||
    /**
     * this is use when user use animation [@modal]="{ value: unknown }"
     */
    (hideStates.includes(fromStateString) && !allStates.includes(toStateString))
  );
};

export const stateChangeLeave = (fromState: string, toState: string) => {
  const fromStateString = String(fromState) as DefaultState | BooleanState;
  const toStateString = String(toState) as DefaultState | BooleanState;

  if (fromStateString === toStateString) return false;
  /**
   * this is use when user use boolean value
   * and first state is void
   * and second state is false
   * so we don't need to animate
   */
  if (fromStateString === DefaultState.Void && toStateString === BooleanState.False) return false;

  return (
    (showStates.includes(fromStateString) && hideStates.includes(toStateString)) ||
    /**
     * this is use when user use animation [@modal]="{ value: unknown }"
     */
    (!allStates.includes(fromStateString) && hideStates.includes(toStateString))
  );
};

export const stateChanged = (fromState: string, toState: string) => {
  const fromStateString = String(fromState) as DefaultState | BooleanState;
  const toStateString = String(toState) as DefaultState | BooleanState;

  if (allStates.includes(fromStateString) || allStates.includes(toStateString)) return false;

  return fromStateString !== toStateString;
};
