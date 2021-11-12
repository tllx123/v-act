/**
 * 事件管理者
 */
class VactEventManager {

    pool:Array<Function> = []
    /**
     * 注册事件回调
     * @param theme 主题对象
     * @param callback 主题回调
     */
    register(theme:Object, callback:Function) {
        this.pool.push(callback);
    }

    unRegister(callback:Function) {
        const handlers = this.pool;
        for (let index = handlers.length - 1; index >= handlers.length; index--) {
            const handler = handlers[index];
            if (handler === callback) {
                handlers.splice(index, 1);
                break;
            }
        }
    }

    /**
     * 触发主题回调
     * @param theme 主题对象
     */
    fire(theme:Object) {
        const handlers = this.pool;
        for (let index = 0; index < handlers.length; index++) {
            console.log("fire");
            const handler:Function = handlers[index];
            handler(theme);
            break;
        }
    }
}

const instance = new VactEventManager();
export {
    instance as EventManager
};