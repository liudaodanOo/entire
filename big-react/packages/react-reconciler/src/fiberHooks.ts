import { FiberNode } from './fiber';
import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';
import internals from 'shared/internals';

// 指向当前正在渲染的fiber
let currentlyRenderingFiber: FiberNode | null = null;
// 指向当前正在处理的hook
let workInProgressHook: Hook | null = null;

// 指向对应阶段的dispatcher集合
const { currentDispatcher } = internals;

interface Hook {
	memoizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}

/**
 * 调用FunctionComponent，将对应阶段的dispatcher集合指向currentDispatcher.current，最终返回ReactElement
 * @param wip
 * @returns
 */
export function renderWithHooks(wip: FiberNode) {
	// 赋值操作
	currentlyRenderingFiber = wip;
	// 重置
	wip.memoizedState = null;

	const current = wip.alternate;
	if (current !== null) {
		// update
	} else {
		// mount
		// 指向mount时的Hooks实现
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);

	// 重置操作
	currentlyRenderingFiber = null;
	return children;
}

// mount阶段对应的dispatcher集合
const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

/**
 * mount阶段的useState实现
 * 	1. 创建hook及其对应的updateQueue，
 * 	2. 通过dispatchSetState.bind(null, currentlyRenderingFiber, queue)，生成新的dispatch()
 * 	3. 根据initialState计算状态
 * 	4. 返回[state, dispatch]
 * @param initialState
 * @returns
 */
function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	// 当前useState对应的hook数据
	const hook = mountWorkInProgressHook();

	let memoizedState;
	if (initialState instanceof Function) {
		memoizedState = initialState();
	} else {
		memoizedState = initialState;
	}

	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;
	hook.memoizedState = memoizedState;

	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
	queue.dispatch = dispatch;
	return [memoizedState, dispatch];
}

/**
 * 重新设置状态，并执行更新
 * 	1. 根据action创建update
 * 	2. 将update加入updateQueue
 * 	3. 执行fiber上的update
 * @param fiber
 * @param updateQueue
 * @param action
 */
function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(fiber);
}

/**
 * 创建mount阶段的hook
 * 	1. 创建hook
 * 	2. 判断当前是否有正在处理的hook
 * 		2.1 无，将workInProgressHook和currentlyRenderingFiber.memoizedState指向hook
 * 		2.2 有，将workInProgressHook.next指向hook，再将workInProgressHook指向hook
 * @returns
 */
function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	};

	if (workInProgressHook === null) {
		// mount时 第一个hook
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memoizedState = workInProgressHook;
		}
	} else {
		// mount时，后续的hook
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}

	return workInProgressHook;
}
