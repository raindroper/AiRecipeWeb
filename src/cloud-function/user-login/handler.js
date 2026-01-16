// ✅ 关键点：必须带 .js 后缀
import { UserDbWrapper } from './userDbWrapper.js';

let myHandler = async function (event, context, callback, logger) {
    // 【步骤 1】入口日志：看看函数有没有被触发，以及传入的原始数据是什么
    logger.info(">>> [STEP 1] Handler Started.");
    logger.info(">>> [STEP 1] Raw Event Type: " + typeof event);
    // 注意：如果是 HTTP 触发器，body 可能是 JSON 字符串，直接 stringify event 可能会很长
    // 这里简单打印一下 event 的关键部分
    try {
        logger.info(">>> [STEP 1] Raw Event Body: " + (event.body ? event.body : "No Body"));
    } catch (e) { }

    // 1. 解析请求参数
    let body = {};
    try {
        if (event.body) {
            body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        } else {
            body = event;
        }
        // 【步骤 2】解析日志：看看 JSON.parse 是否成功
        logger.info(">>> [STEP 2] Parsed Body: " + JSON.stringify(body));
    } catch (e) {
        logger.error(">>> [STEP 2] Parse Error: " + e.message);
        return callback({ ret: { code: 400, desc: "Invalid JSON" } });
    }

    // 2. 获取手机号和密码
    const { id, password } = body;
    const userId = id || body.phone;

    // 【步骤 3】参数校验日志：看看提取出来的 userId 和 password 是什么
    logger.info(`>>> [STEP 3] Extracted Params - userId: ${userId}, password: ${password ? "******" : "MISSING"}`);

    if (!userId || !password) {
        logger.warn(">>> [STEP 3] Failed: Missing params");
        return callback({
            ret: { code: 400, desc: "Missing phone(id) or password" }
        });
    }

    // 3. 查库
    // 【步骤 4】实例化日志：如果 import 失败或类定义错误，代码会在这里崩掉
    logger.info(">>> [STEP 4] Initializing UserDbWrapper...");
    let db;
    try {
        db = new UserDbWrapper();
        logger.info(">>> [STEP 4] Wrapper initialized successfully.");
    } catch (e) {
        logger.error(">>> [STEP 4] CRASH during Wrapper init: " + e.message);
        logger.error(e.stack);
        return callback({ ret: { code: 500, desc: "Wrapper Init Failed" } });
    }

    try {
        logger.info(`>>> [STEP 5] Querying DB for: ${userId}`);

        // 调用 wrapper 查询用户
        const userList = await db.queryUser(userId);

        // 【步骤 5】查询结果日志：这一步最关键，看看数据库到底返回了什么
        // 打印类型和长度，以及原始内容
        logger.info(`>>> [STEP 5] DB Result Type: ${typeof userList}`);
        logger.info(`>>> [STEP 5] DB Result Content: ${JSON.stringify(userList)}`);

        // 4. 验证逻辑
        if (!userList || userList.length === 0) {
            logger.warn(">>> [STEP 6] Login Failed: User list is empty or null.");
            return callback({
                ret: { code: 404, desc: "User not found" }
            });
        }

        const user = userList[0];

        // 【步骤 6】比对日志：看看数据库里的密码和前端传的密码是否一致
        logger.info(`>>> [STEP 6] Comparing passwords. Input: ${password}, DB: ${user.password}`);

        if (user.password !== password) {
            logger.warn(">>> [STEP 6] Login Failed: Password mismatch.");
            return callback({
                ret: { code: 401, desc: "Wrong password" }
            });
        }

        // 5. 登录成功
        logger.info(">>> [STEP 7] Login Success! Preparing response.");

        // 脱敏
        user.password = undefined;

        return callback({
            ret: { code: 0, desc: "Login Success" },
            result: user
        });

    } catch (error) {
        // 全局捕获
        logger.error(">>> [FINAL ERROR] System Error: " + error.message);
        logger.error(">>> Stack: " + error.stack);
        return callback({
            ret: { code: 500, desc: "Server Error: " + error.message }
        });
    }
};

export { myHandler };