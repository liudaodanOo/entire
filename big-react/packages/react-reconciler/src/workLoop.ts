import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null;

/**
 * 处理fiber上的update
 * @param fiber
 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// @TODO 调度功能
	// fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

/**
 * 从当前节点向上找到fiberRootNode
 * @param fiber
 * @returns
 */
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}

	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

/**
 * 从fiberRootNode开始渲染/更新
 * @param root
 */
function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);

	// 执行递归的流程
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// wip fiberNode树 树中的flags
	commitRoot(root);
}

/**
 * 渲染/更新前的准备，初始化wip
 * @param root
 */
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

/**
 * 作循环执行工作单元
 */
function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

/**
 * 执行工作单元
 * @param fiber
 */
function performUnitOfWork(fiber: FiberNode) {
	// 执行递
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		// 递归到叶子节点，准备执行归
		completeUnitOfWork(fiber);
	} else {
		// 继续执行递
		workInProgress = next;
	}
}

/**
 * 完成工作单元
 * @param fiber
 * @returns
 */
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;

	do {
		// 执行归
		completeWork(node);
		const sibling = node.sibling;

		if (sibling !== null) {
			// 有兄弟节点，则给兄弟节点执行递
			workInProgress = sibling;
			return;
		}

		// 没有有兄弟节点，则准备给父节点执行归
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
