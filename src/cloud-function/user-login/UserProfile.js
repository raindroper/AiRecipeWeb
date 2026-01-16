// 定义实体类
class UserProfile {
    constructor() {
        this.id = undefined;
        this.password = undefined;
        this.nickname = undefined;
        this.avatarUrl = undefined;
    }

    // 【关键方法1】告诉 SDK 每个字段的类型
    getFieldTypeMap() {
        let fieldTypeMap = new Map();
        fieldTypeMap.set('id', 'String');
        fieldTypeMap.set('password', 'String');
        fieldTypeMap.set('nickname', 'String');
        fieldTypeMap.set('avatarUrl', 'String');
        return fieldTypeMap;
    }

    // 【关键方法2】告诉 SDK 哪个是主键
    getPrimaryKeyList() {
        return ['id'];
    }
}

// 必须导出，供 handler 使用
module.exports.UserProfile = UserProfile;