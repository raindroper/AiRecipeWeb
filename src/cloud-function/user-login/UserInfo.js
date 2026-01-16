class UserInfo {
    constructor() {
        this.id = undefined;
        this.password = undefined;
        this.nickname = undefined;
        this.avatarUrl = undefined;
    }

    // 必须实现：字段映射
    getFieldTypeMap() {
        const map = new Map();
        map.set('id', 'String');
        map.set('password', 'String');
        map.set('nickname', 'String');
        map.set('avatarUrl', 'String');
        return map;
    }

    // 必须实现：主键列表
    getPrimaryKeyList() {
        return ['id'];
    }
}

export { UserInfo };