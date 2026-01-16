import { cloud } from '@hw-agconnect/cloud-server';
import { UserProfile } from './UserProfile.js';

const ZONE_NAME = "devDB";

export class UserDbWrapper {
    constructor() {
        console.log(`[UserDbWrapper] Initializing... Zone: ${ZONE_NAME}`);
        
        // [LOG] 增强的类检查日志
        console.log(`[UserDbWrapper] Check UserProfile: ${UserProfile}`);
        console.log(`[UserDbWrapper] Check UserProfile Type: ${typeof UserProfile}`);
        
        try {
            if (!UserProfile) {
                console.error("[UserDbWrapper] Critical: UserProfile class is undefined!");
                throw new Error("UserProfile class is undefined");
            }
            
            // 尝试实例化一个对象看看
            try {
                const testObj = new UserProfile();
                console.log("[UserDbWrapper] UserProfile instantiated successfully.");
            } catch(e) {
                console.error("[UserDbWrapper] Failed to instantiate UserProfile:", e);
            }

            this.collection = cloud.database({ zoneName: ZONE_NAME }).collection(UserProfile);
            console.log("[UserDbWrapper] Collection created.");
        } catch (e) {
            console.error("[UserDbWrapper] Collection init failed!", e);
            throw e;
        }
    }

    async queryUser(userId) {
        console.log(`[UserDbWrapper] queryUser > ID: ${userId}`);
        try {
            if (!userId) {
                return [];
            }
            const query = this.collection.query().equalTo("id", userId);
            const res = await query.get();
            return res;
        } catch (error) {
            console.error(`[UserDbWrapper] queryUser error:`, error);
            throw error;
        }
    }

    async upsertUser(userInfo) {
        console.log(`[UserDbWrapper] upsertUser > Data: ${JSON.stringify(userInfo)}`);
        try {
            const res = await this.collection.upsert(userInfo);
            console.log(`[UserDbWrapper] upsertUser > Success. Rows: ${res}`);
            return res;
        } catch (error) {
            console.error(`[UserDbWrapper] upsertUser error:`, error);
            throw error;
        }
    }
}
