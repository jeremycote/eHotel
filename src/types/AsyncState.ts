type AsyncState<T> =
  | { status: AsyncStateStates.Idle }
  | { status: AsyncStateStates.Loading }
  | { status: AsyncStateStates.Success; data: T }
  | { status: AsyncStateStates.Error; error: any };

export enum AsyncStateStates {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export default AsyncState;
