import { Dispatch } from 'react/src/currentDispatcher';
import { Action } from 'shared/ReactTypes';
import { Lane } from './fiberLanes';

export interface Update<State> {
	action: Action<State>;
	lane: Lane;
	next: Update<any> | null;
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
export const createUpdate = <State>(
	action: Action<State>,
	lane: Lane
): Update<State> => {
	return { action, lane, next: null };
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
 * 通过环状链表维系多个udate之间的关系
 * @param updateQueue
 * @param update
 */
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	const pending = updateQueue.shared.pending;
	if (pending === null) {
		// pending = a -> a
		update.next = update;
	} else {
		// pending = b -> a -> b
		// pending = c -> a -> b -> c
		update.next = pending.next;
		pending.next = update;
	}
	updateQueue.shared.pending = update;
};

/**
 * 计算状态最新值
 * @param baseState
 * @param pendingUpdate
 * @returns
 */
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null,
	renderLane: Lane
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};

	if (pendingUpdate !== null) {
		// 第一个update
		let first = pendingUpdate.next;
		let pending = pendingUpdate.next as Update<any>;
		do {
			const updateLane = pending.lane;
			if (updateLane === renderLane) {
				const action = pending.action;
				if (action instanceof Function) {
					baseState = action(baseState);
				} else {
					baseState = action;
				}
			} else {
				if (__DEV__) {
					console.error('不应该进入updateLane !== renderLane这个逻辑');
				}
			}
			pending = pending.next as Update<any>;
		} while (pending !== first);
	}
	result.memoizedState = baseState;
	return result;
};
