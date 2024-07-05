import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
	alternate: FiberNode | null;
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		//#region 实例属性
		this.tag = tag;
		this.key = key;
		// HostComponent <div> div DOM
		this.stateNode = null;
		// FunctionComponent () => {}
		this.type = null;
		//#endregion

		//#region 描述节点之间关系的属性
		// 指向父fiberNode
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;
		//#endregion

		this.ref = null;

		//#region 作为工作单元的属性
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.alternate = null;
		// 副作用
		this.flags = NoFlags;
		//#endregion
	}
}
