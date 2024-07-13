import { Dispatch } from 'react/src/currentDispatcher';
import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
	dispatch: Dispatch<State> | null;
}

/**
 * 创建update
 * @param action
 * @returns
 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return { action };
};

/**
 * 创建updateQueue
 * @returns
 */
export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		},
		dispatch: null
	} as UpdateQueue<State>;
};

/**
 * 将update加入updateQueue中
 * @param updateQueue
 * @param update
 */
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};

/**
 * 计算状态最新值
 * @param baseState
 * @param pendingState
 * @returns
 */
export const processUpdateQueue = <State>(
	baseState: State,
	pendingState: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};

	if (pendingState !== null) {
		const action = pendingState.action;
		if (action instanceof Function) {
			result.memoizedState = action(baseState);
		} else {
			result.memoizedState = action;
		}
	}

	return result;
};
