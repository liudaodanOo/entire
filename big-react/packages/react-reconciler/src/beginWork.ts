import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import {
	Fragment,
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { renderWithHooks } from './fiberHooks';
import { Lane } from './fiberLanes';

/**
 * 开始执行工作单元，递归中的递
 * 根据不同的fiber类型，执行不同的方法，计算fiber最新状态
 * mount时会创建fiber.alternate对应的fiber
 * update时会更新fiber.alternate
 * @param wip
 * @returns
 */
export const beginWork = (wip: FiberNode, renderLane: Lane) => {
	// 比较，返回子fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip, renderLane);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			return null;
		case FunctionComponent:
			return updateFunctionComponent(wip, renderLane);
		case Fragment:
			return updateFragment(wip);
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}
	return null;
};

/**
 * 更新hostRootFiber的状态
 * @param wip
 * @returns
 */
function updateHostRoot(wip: FiberNode, renderLane: Lane) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<ReactElementType | null>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(baseState, pending, renderLane);
	wip.memoizedState = memoizedState;

	const nextChildren = wip.memoizedState;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

/**
 * 更新hostComponent的状态
 * @param wip
 * @returns
 */
function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

/**
 * 更新FunctionComponent的状态
 * @param wip
 * @returns
 */
function updateFunctionComponent(wip: FiberNode, renderLane: Lane) {
	const nextChildren = renderWithHooks(wip, renderLane);
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

/**
 * 更新Fragment的状态
 * @param wip
 * @returns
 */
function updateFragment(wip: FiberNode) {
	const nextChildren = wip.pendingProps;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

/**
 * 解析child fiber
 * @param wip
 * @param children
 */
function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;

	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// @TODO: 目前来看好像永远都不会走这里
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
