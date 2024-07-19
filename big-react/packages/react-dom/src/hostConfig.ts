import { FiberNode } from 'react-reconciler/src/fiber';
import { HostComponent, HostText } from 'react-reconciler/src/workTags';
import { DOMElement, updateFiberProps } from './SyntheticEvent';

export type Container = Element;
export type Instance = Element;
export type TextInstance = Text;

/**
 * 创建宿主环境对应的实例
 * 	1. 创建DOM元素
 * 	2. 更新DOM上的props
 * @param type
 * @returns
 */
export const createInstance = (type: string, props: any): Instance => {
	const element = document.createElement(type) as unknown;
	updateFiberProps(element as DOMElement, props);
	return element as DOMElement;
};

/**
 * 将子节点插入父节点
 * @param parent
 * @param child
 */
export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};

/**
 * 创建宿主环境对应的文本节点
 * @param content
 * @returns
 */
export const createTextInstance = (content: string) => {
	return document.createTextNode(content);
};

/**
 * 将子节点插入父节点
 * @param parent
 * @param child
 */
export const appendChildToContainer = appendInitialChild;

/**
 * 进行更新
 * 根据不同的fiber.tag执行不同的更新方法
 * @param fiber
 * @returns
 */
export function commitUpdate(fiber: FiberNode) {
	switch (fiber.tag) {
		case HostText:
			const text = fiber.memoizedProps.content;
			return commitTextUpdate(fiber.stateNode, text);
		default:
			if (__DEV__) {
				console.warn('未实现的Update类型', fiber);
			}
			break;
	}
}

/**
 * 更新文本
 * @param textInstance
 * @param content
 */
export function commitTextUpdate(textInstance: TextInstance, content: string) {
	textInstance.textContent = content;
}

/**
 * 移除子节点
 * @param child
 * @param container
 */
export function removeChild(
	child: Instance | TextInstance,
	container: Container
) {
	container.removeChild(child);
}

/**
 * 在目标节点前插入节点
 * @param child
 * @param container
 * @param before
 */
export function insertChildToContainer(
	child: Instance,
	container: Instance,
	before: Instance
) {
	container.insertBefore(child, before);
}
