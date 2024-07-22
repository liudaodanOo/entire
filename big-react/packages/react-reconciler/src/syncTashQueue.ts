let syncQueue: ((...args: any) => void)[] | null = null;
let isFlushingSyncQueue = false;

/**
 * 同步调度
 * @param callback
 */
export function scheduleSyncCallback(callback: (...args: any) => void) {
	if (syncQueue === null) {
		syncQueue = [callback];
	} else {
		syncQueue.push(callback);
	}
}

/**
 * 执行同步任务
 */
export function flushSyncCallbacks() {
	if (!isFlushingSyncQueue && syncQueue) {
		isFlushingSyncQueue = true;

		try {
			syncQueue.forEach((callback) => callback());
		} catch (e) {
			if (__DEV__) {
				console.error('flushSyncCallbacks报错', e);
			}
		} finally {
			isFlushingSyncQueue = false;
			syncQueue = null;
		}
	}
}
