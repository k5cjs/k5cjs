export const stateChangeEnter = (fromState: string, toState: string) => {
  const fromStateString = String(fromState);
  const toStateString = String(toState);

  if (fromStateString === toStateString) return false;
  /**
   * this is use when user use animation [@modal]="true | false"
   */
  if (fromStateString === 'void' && toStateString === 'false') return false;

  return (
    /**
     * this is use when user use animation @modal
     */
    (fromStateString === 'void' && toStateString === 'null') ||
    /**
     * this is use when user use animation [@modal]="true | false"
     */
    (fromStateString === 'false' && toStateString === 'true')
  );
};

export const stateChangeLeave = (fromState: string, toState: string) => {
  const fromStateString = String(fromState);
  const toStateString = String(toState);

  if (fromStateString === toStateString) return false;
  /**
   * this is use when user use boolean value
   */
  if (fromStateString === 'void' && toStateString === 'false') return false;

  return (
    /**
     * this is use when user use animation @modal
     */
    (fromStateString === 'null' && toStateString === 'void') ||
    /**
     * this is use when user use animation [@modal]="true | false"
     */
    (fromStateString === 'true' && toStateString === 'false')
  );
};
