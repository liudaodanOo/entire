import { Container } from 'hostConfig';
import { Props } from 'shared/ReactTypes';

export const elementPropsKey = '__props';

const validEventTypeList = ['click'];

type EventCallback = (e: Event) => void;

interface SyntheticEvent extends Event {
	__stopPropagation: boolean;
}

interface Paths {
	capture: EventCallback[];
	bubble: EventCallback[];
}

export interface DOMElement extends Element {
	[elementPropsKey]: Props;
}

/**
 * 将wip fiber的props指向element.__props
 * @param node
 * @param props
 */
export function updateFiberProps(node: DOMElement, props: Props) {
	node[elementPropsKey] = props;
}

/**
 * 初始化事件代理
 * @param container
 * @param eventType
 * @returns
 */
export function initEvent(container: Container, eventType: string) {
	if (!validEventTypeList.includes(eventType)) {
		console.warn('当前不支持', eventType, '事件');
		return;
	}

	if (__DEV__) {
		console.log('初始化事件：', eventType);
	}
	container.addEventListener(eventType, (e) => {
		dispatchEvent(container, eventType, e);
	});
}

/**
 * 发送事件
 *  1. 收集沿途的事件
 *  2. 构造合成事件
 *  3. 遍历capture事件
 *  4. 遍历bubble事件
 * @param container
 * @param eventType
 * @param e
 * @returns
 */
function dispatchEvent(container: Container, eventType: string, e: Event) {
	const targetElement = e.target;

	if (targetElement === null) {
		console.warn('事件不存在target', e);
		return;
	}
	// 1. 收集沿途的事件
	const { bubble, capture } = collectPaths(
		targetElement as DOMElement,
		container,
		eventType
	);
	// 2. 构造合成事件
	const se = createSyntheticEvent(e);
	// 3. 遍历capture
	triggerEventFlow(capture, se);

	if (!se.__stopPropagation) {
		// 4. 遍历bubble
		triggerEventFlow(bubble, se);
	}
}

/**
 * 从目标元素开始，向上收集事件，直到根节点停止
 * @param targetElement
 * @param container
 * @param eventType
 * @returns
 */
function collectPaths(
	targetElement: DOMElement,
	container: Container,
	eventType: string
) {
	const paths: Paths = {
		capture: [],
		bubble: []
	};

	while (targetElement && targetElement !== container) {
		// 收集
		const elementProps = targetElement[elementPropsKey];
		if (elementProps) {
			// click -> onClick onClickCapture
			const callbackNameList = getEventCallbackNameForEventType(eventType);
			if (callbackNameList) {
				callbackNameList.forEach((callbackName, i) => {
					const eventCallback = elementProps[callbackName];
					if (eventCallback) {
						if (i === 0) {
							// capture
							paths.capture.unshift(eventCallback);
						} else {
							paths.bubble.push(eventCallback);
						}
					}
				});
			}
		}
		targetElement = targetElement.parentNode as DOMElement;
	}

	return paths;
}

/**
 * 根据原生事件名获取对应的react事件名
 * @param eventType
 * @returns
 */
function getEventCallbackNameForEventType(
	eventType: string
): string[] | undefined {
	return {
		click: ['onClickCapture', 'onClick']
	}[eventType];
}

/**
 * 创建合成事件
 * @param e
 * @returns
 */
function createSyntheticEvent(e: Event) {
	const syntheticEvent = e as SyntheticEvent;
	syntheticEvent.__stopPropagation = false;
	const originStopPropagation = e.stopPropagation;
	syntheticEvent.stopPropagation = () => {
		syntheticEvent.__stopPropagation = true;
		if (originStopPropagation) {
			originStopPropagation();
		}
	};
	return syntheticEvent;
}

/**
 * 触发合成事件
 * @param paths
 * @param se
 */
function triggerEventFlow(paths: EventCallback[], se: SyntheticEvent) {
	for (let i = 0; i < paths.length; i++) {
		const callback = paths[i];
		callback.call(null, se);

		if (se.__stopPropagation) {
			break;
		}
	}
}
