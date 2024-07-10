export type Container = Element;
export type Instance = Element;

/**
 * 创建宿主环境对应的实例
 * @param type
 * @returns
 */
// export const createInstance = (type: string, props: any): Instance => {
export const createInstance = (type: string): Instance => {
	// @TODO: 处理props
	const element = document.createElement(type);
	return element;
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
