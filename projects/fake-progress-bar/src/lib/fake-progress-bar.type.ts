export const enum FakeProgressBarEventType {
  Init,
  Start,
  End,
}

export interface FakeProgressBarInit {
  type: FakeProgressBarEventType.Init;
}

export interface FakeProgressBarStart {
  type: FakeProgressBarEventType.Start;
  time: number;
  progress?: number;
}

export interface FakeProgressBarEnd {
  type: FakeProgressBarEventType.End;
}

export type FakeProgressBarEvent = FakeProgressBarInit | FakeProgressBarStart | FakeProgressBarEnd;
