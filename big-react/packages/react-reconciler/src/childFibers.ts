import { ReactElementType } from 'shared/ReactTypes';
import { createFiberFromElement, FiberNode } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

/**
 * 创建mount/update时解析child fiber的方法
 * @param shouldTrackEffects
 * @returns
 */
function ChildReconciler(shouldTrackEffects: boolean) {
	/**
	 * 根据新的reactElement创建新的fiber
	 * @param returnFiber
	 * @param currentFiber
	 * @param element
	 * @returns
	 */
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		// 根据element创建fiber
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}

	/**
	 * 直接创建HostText类型的fiber
	 * @param returnFiber
	 * @param currentFiber
	 * @param content
	 * @returns
	 */
	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	/**
	 * 给fiber打上placement标记
	 * @param fiber
	 * @returns
	 */
	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	/**
	 * 真正解析child fiber的方法
	 */
	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		// 判断当前fiber的类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.warn('为实现的reconcile类型', newChild);
					}
					break;
			}
		}

		// @TODO: 多节点的情况 ul>li*3

		// HostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}

		if (__DEV__) {
			console.warn('为实现的reconcile类型', newChild);
		}
		return null;
	};
}

/**
 * 解析child fiber，需要追踪child fiber的副作用
 */
export const reconcileChildFibers = ChildReconciler(true);

/**
 * 挂在child fiber，不需要追踪child fiber的副作用
 */
export const mountChildFibers = ChildReconciler(false);
