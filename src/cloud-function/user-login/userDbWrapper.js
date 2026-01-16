import { cloud } from '@hw-agconnect/cloud-server';
import { UserInfo } from './UserInfo.js';

// ⚠️ 重要提示：请务必去 AGC 控制台确认你的存储区名字是 "devDB" 还是 "QuickStart"
// 如果名字不对，会报 "The zone does not exist" 或其他连接错误
const ZONE_NAME = "devDB";

export class UserDbWrapper {
    constructor() {
        console.log(`[UserDbWrapper] 正在初始化... 目标存储区: ${ZONE_NAME}`);
        try {
            // 初始化 Collection
            this.collection = cloud.database({ zoneName: ZONE_NAME }).collection(UserInfo);
            console.log("[UserDbWrapper] Collection 对象创建成功 (Schema 已加载)");
        } catch (e) {
            console.error("[UserDbWrapper] 致命错误: Collection 初始化失败！", e);
            throw e; // 抛出错误让 handler 捕获
        }
    }

    /**
     * 根据 ID 查询用户
     */
    async queryUser(userId) {
        console.log(`[UserDbWrapper] queryUser > 开始查询，目标 ID: ${userId}`);
        try {
            if (!userId) {
                console.warn("[UserDbWrapper] 警告: 未传入 userId，即将执行全量查询！");
                const allRes = await this.collection.query().get();
                console.log(`[UserDbWrapper] queryUser > 全量查询完成，返回条数: ${allRes ? allRes.length : 0}`);
                return allRes;
            }

            // 构造查询
            const query = this.collection.query().equalTo("id", userId);

            // 执行查询
            const res = await query.get();

            // 打印结果摘要（防止日志太长，只打印条数和第一条数据概览）
            const count = res ? res.length : 0;
            console.log(`[UserDbWrapper] queryUser > 查询成功. 匹配记录数: ${count}`);
            if (count > 0) {
                console.log(`[UserDbWrapper] queryUser > 第一条记录示例: ${JSON.stringify(res[0])}`);
            } else {
                console.log("[UserDbWrapper] queryUser > 未找到匹配记录 (空数组)");
            }

            return res;
        } catch (error) {
            console.error(`[UserDbWrapper] queryUser > 查询异常: ${error.message}`);
            // 打印完整错误堆栈，方便看是不是网络或鉴权问题
            console.error(error);
            throw error;
        }
    }

    /**
     * 插入或更新用户信息
     */
    async upsertUser(userInfo) {
        console.log(`[UserDbWrapper] upsertUser > 准备写入数据: ${JSON.stringify(userInfo)}`);
        try {
            const res = await this.collection.upsert(userInfo);
            console.log(`[UserDbWrapper] upsertUser > 写入成功. 影响行数: ${res}`);
            return res;
        } catch (error) {
            console.error(`[UserDbWrapper] upsertUser > 写入失败: ${error.message}`);
            console.error(error);
            throw error;
        }
    }

    /**
     * 删除用户
     */
    async deleteUser(userInfo) {
        console.log(`[UserDbWrapper] deleteUser > 准备删除数据: ${JSON.stringify(userInfo)}`);
        try {
            const res = await this.collection.delete(userInfo);
            console.log(`[UserDbWrapper] deleteUser > 删除成功. 影响行数: ${res}`);
            return res;
        } catch (error) {
            console.error(`[UserDbWrapper] deleteUser > 删除失败: ${error.message}`);
            console.error(error);
            throw error;
        }
    }
}