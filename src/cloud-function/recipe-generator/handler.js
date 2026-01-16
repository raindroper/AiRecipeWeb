const https = require('https');

// ================= 配置区 =================
// 1. 填入你的 API Key (DeepSeek 或其他 OpenAI 兼容的 Key)
const API_KEY = "sk-1fa596673ec04832a40f520777b6857f";

// 2. API 地址 (如果是 DeepSeek 使用下面的，如果是其他请自行替换)
const API_URL = "api.deepseek.com";
const API_PATH = "/chat/completions";
const API_MODEL = "deepseek-chat"; // 模型名称
// =========================================

let myHandler = async function(event, context, callback, logger) {
  const log = logger || context.getLogger();

  // 1. 解析前端参数
  // 1. 解析前端参数 (健壮版)
  let userMessage = "";
  try {
    let requestBody = {};

    // 情况A: 参数在 event.body 中 (通常是字符串，也可能是对象)
    if (event.body) {
      if (typeof event.body === 'string') {
        requestBody = JSON.parse(event.body);
      } else {
        requestBody = event.body;
      }
    }
    // 情况B: 参数直接就是 event 对象本身 (某些调用场景)
    else {
      requestBody = event;
    }

    // 安全获取 message，如果取不到则使用默认值
    // 注意：这里加了 && 判断，防止 requestBody 依然是 null/undefined
    userMessage = (requestBody && requestBody.message) ? requestBody.message : "推荐一道菜";

  } catch (e) {
    log.error("JSON解析失败详细堆栈: " + e.stack); // 打印更详细的错误
    // 发生解析错误，使用默认值，保证程序不崩
    userMessage = "推荐一道菜";
  }

  log.info("收到用户指令: " + userMessage);

  // 2. 定义 System Prompt (这是 AI 的“人设”)
  // 我们强制要求 AI 只返回 JSON 格式，不要废话
  const systemPrompt = `
    你是一个专业的营养师和创意大厨。
    你的任务是根据用户的食材或口味需求，推荐一道详细的菜谱。
    
    【重要】你必须严格只返回 JSON 格式数据，不要包含 Markdown 标记（如 \`\`\`json），不要有任何开头或结尾的废话。
    
    返回的 JSON 结构必须严格遵守：
    {
        "type": "recipe", 
        "text": "简短暖心的推荐语（30字以内）",
        "recipeData": {
            "title": "菜名",
            "calories": 整数数值(大卡),
            "time": "烹饪时间(如: 15分钟)",
            "tags": ["标签1", "标签2"],
            "ingredients": [
                {"name": "食材名", "amount": "用量"}
            ],
            "steps": [
                "步骤1描述",
                "步骤2描述"
            ]
        }
    }

    如果用户说的话完全与吃/做饭无关（例如问天气或写代码），请返回：
    {
        "type": "chat",
        "text": "我是您的AI厨房助手，只能帮您推荐菜谱哦~ 请告诉我您想吃什么？"
    }
    `;

  // 3. 发送请求给大模型
  try {
    const aiResponse = await callLLM(userMessage, systemPrompt, log);

    // 4. 清洗数据（防止 AI 返回 Markdown 代码块）
    let cleanJson = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
    let resultData = JSON.parse(cleanJson);

    // 5. 返回成功响应
    sendResponse(context, callback, 200, resultData);

  } catch (error) {
    log.error("AI 调用失败: " + error.message);
    // 发生错误时的兜底返回
    sendResponse(context, callback, 200, {
      type: "chat",
      text: "抱歉，AI 厨师大脑有点短路，请稍后再试一次。"
    });
  }
};

// --- 辅助函数：发送 HTTPS 请求 ---
function callLLM(userMessage, systemPrompt, log) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: API_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 1.3, // 稍微高一点，让菜谱更有创意
      stream: false
    });

    const options = {
      hostname: API_URL,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            // 获取 AI 的回复文本
            const content = parsed.choices[0].message.content;
            resolve(content);
          } catch (e) {
            reject(new Error("解析 AI 响应失败: " + e.message));
          }
        } else {
          reject(new Error(`API 请求失败: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// --- 辅助函数：构造标准响应 ---
function sendResponse(context, callback, status, body) {
  let res = new context.HTTPResponse(
    body,
    {
      "res-type": "context.HTTPResponse",
      "faas-content-type": "json",
      "Access-Control-Allow-Origin": "*", // 允许跨域
      "Access-Control-Allow-Headers": "Content-Type,X-Agc-Client-Id,X-Agc-Api-Key,X-Agc-App-Id"
    },
    "application/json",
    String(status)
  );
  callback(res);
}

module.exports.myHandler = myHandler;