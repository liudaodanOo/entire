import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { Lane, mergeLanes } from './fiberLanes';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null;

/**
 * 处理fiber上的update
 * @param fiber
 */
export function scheduleUpdateOnFiber(fiber: FiberNode, lane: Lane) {
	// @TODO: 调度功能
	// fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	markRootUpdated(root, lane);
	renderRoot(root);
}

/**
 * 将lane记录到fiberRootNode中
 * @param root
 * @param lane
 */
function markRootUpdated(root: FiberRootNode, lane: Lane) {
	root.pendingLanes = mergeLanes(root.pendingLanes, lane);
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
 * 从fiberRootNode开始执行工作单元
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
 * 执行前的准备，初始化wip
 * @param root
 */
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

/**
 * 循环执行工作单元
 */
function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

/**
 * 提交fiberRootNode
 * beginWork -> completeWork完成后，进入commit阶段
 * commit阶段分为：
 * 	- beforeMutation
 * 	- mutation
 * 	- layout（afterMutation）
 * @param root
 * @returns
 */
function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;

	if (finishedWork === null) {
		return;
	}

	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork);
	}

	// 重置
	root.finishedWork = null;

	// 判断是否存在3个子阶段需要执行的操作
	// root flags、root subtreeFlags
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
	if (subtreeHasEffect || rootHasEffect) {
		// beforeMutation

		// mutation
		commitMutationEffects(finishedWork);

		root.current = finishedWork;

		// layout
	} else {
		root.current = finishedWork;
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
			// 有sibling fiber，则给sibling fiber执行递
			workInProgress = sibling;
			return;
		}

		// 没有有sibling fiber，则准备给return fiber执行归
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
