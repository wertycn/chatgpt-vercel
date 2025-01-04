import { createParser } from "eventsource-parser"
import type { ChatMessage, Model } from "../../shared/types"
import { defaultEnv } from "../../shared/env"
import { randomKey, splitKeys, fetchWithTimeout } from "../../server/utils"

const timeout = 30000  // 30秒超时
const localKey = process.env.OPENAI_API_KEY || ""
const passwordSet = process.env.PASSWORD || defaultEnv.PASSWORD

export async function onRequestPost(context) {
  try {
    const body = await context.request.json()
    const { messages, key = localKey, temperature, password, model } = body

    // 密码校验
    if (passwordSet && password !== passwordSet) {
      throw new Error("密码错误，请联系网站管理员。")
    }

    // 消息校验
    if (!messages?.length) {
      throw new Error("没有输入任何文字。")
    }

    // API key 处理和校验
    const apiKey = randomKey(splitKeys(key))
    if (!apiKey) {
      throw new Error("没有填写 OpenAI API key，或者 key 填写错误。")
    }

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