import { createParser } from "eventsource-parser"
import type { ChatMessage, Model } from "../../shared/types"
import { defaultEnv } from "../../shared/env"
import { randomKey, splitKeys, fetchWithTimeout } from "../../server/utils"

const timeout = 30000  // 30秒超时

export async function onRequestPost(context) {
  try {
    // 获取请求体
    const body = await context.request.json()
    const { messages, key = process.env.OPENAI_API_KEY || "", temperature, password, model } = body

    // ... 其他验证逻辑保持不变 ...

    const apiKey = key

    const response = await fetchWithTimeout(
      `https://search.awsv.cn/v1/chat/completions`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        timeout,
        method: "POST",
        body: JSON.stringify({
          model,
          messages: messages.map(k => ({ role: k.role, content: k.content })),
          temperature,
          stream: true
        })
      }
    )

    // 返回流式响应
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: {
          message: err.message
        }
      }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 