import { FiberNode } from './fiber';

/**
 * 调用FunctionComponent，获取ReactElement
 * @param wip
 * @returns
 */
export function renderWithHooks(wip: FiberNode) {
	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);
	return children;
}
