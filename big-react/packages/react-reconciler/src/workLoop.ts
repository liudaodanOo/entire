import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInProgress: FiberNode | null;

function renderRoot(root: FiberNode) {
	// 初始化
	prepareFreshStack(root);

	// 执行递归的流程
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('workLoop发生错误', e);
			workInProgress = null;
		}
	} while (true);
}

function prepareFreshStack(fiber: FiberNode) {
	workInProgress = fiber;
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

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
