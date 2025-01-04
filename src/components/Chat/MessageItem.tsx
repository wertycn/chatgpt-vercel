import { Show, createEffect, createSignal } from "solid-js"
import { useCopyCode } from "~/hooks"
import { RootStore } from "~/store"
import type { ChatMessage } from "~/types"
import { copyToClipboard } from "~/utils"
import MessageAction from "./MessageAction"
import openai from "~/icons/openai.svg?raw"
import vercel from "~/icons/vercel.svg?raw"
import type { FakeRoleUnion } from "./SettingAction"
import { renderMarkdownInWorker } from "~/workers"
import { throttle } from "@solid-primitives/scheduled"
import userIcon from "/user.png"
import chatgptIcon from "/chatgpt.svg?raw"

interface Props {
  message: ChatMessage
  hiddenAction: boolean
  index?: number
  sendMessage?: (value?: string, fakeRole?: FakeRoleUnion) => void
}

export default function MessageItem(props: Props) {
  useCopyCode()
  const { store, setStore } = RootStore
  const [renderedMarkdown, setRenderedMarkdown] = createSignal("")
  const roleClass = {
    error: "bg-gradient-to-r from-red-400 to-red-700",
    system: "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300",
    user: "",
    assistant: ""
  }

  function copy() {
    copyToClipboard(props.message.content)
  }

  function edit() {
    setStore("inputContent", props.message.content)
  }

  function del() {
    setStore("messageList", messages => {
      if (messages[props.index!].role === "user") {
        return messages.filter(
          (_, i) =>
            !(
              i === props.index ||
              (i === props.index! + 1 && _.role !== "user")
            )
        )
      }
      return messages.filter((_, i) => i !== props.index)
    })
  }

  function reAnswer() {
    let question = ""
    setStore("messageList", messages => {
      if (messages[props.index!].role === "user") {
        question = messages[props.index!].content
        return messages.filter(
          (_, i) =>
            !(
              i === props.index ||
              (i === props.index! + 1 && _.role !== "user")
            )
        )
      } else {
        question = messages[props.index! - 1].content
        return messages.filter(
          (_, i) => !(i === props.index || i === props.index! - 1)
        )
      }
    })
    props.sendMessage?.(question)
  }

  function lockMessage() {
    if (props.index === undefined) return
    if (store.messageList[props.index].role === "user") {
      setStore(
        "messageList",
        (k, i) =>
          i === props.index ||
          (i === props.index! + 1 && k.role === "assistant"),
        "type",
        type => (type === "locked" ? undefined : "locked")
      )
    } else {
      setStore("messageList", [props.index - 1, props.index], "type", type =>
        type === "locked" ? undefined : "locked"
      )
    }
  }

  const throttleRender = throttle((content: string) => {
    renderMarkdownInWorker(content).then(html => {
      setRenderedMarkdown(html)
    })
  }, 50)

  createEffect(() => {
    const content = props.message.content
    const type = props.message.type
    
    if (!content) return
    
    setRenderedMarkdown("")
    
    if (type === "temporary") {
      throttleRender(content)
    } else {
      let cancelled = false
      renderMarkdownInWorker(content).then(html => {
        if (!cancelled) {
          setRenderedMarkdown(html)
        }
      })
      
      return () => {
        cancelled = true
      }
    }
  })

  return (
    <Show when={renderedMarkdown()}>
      <div
        class="group flex gap-3 px-4 mx--4 rounded-lg transition-colors sm:hover:bg-slate/6 dark:sm:hover:bg-slate/5 relative message-item"
        style={{
          transition: "all 0.3s"
        }}
        classList={{
          temporary: props.message.type === "temporary"
        }}
      >
        <div
          class="shrink-0 w-7 h-7 mt-4 rounded-full flex items-center justify-center cursor-pointer"
          classList={{
            "animate-spin": props.message.type === "temporary"
          }}
          onClick={lockMessage}
        >
          <Show 
            when={props.message.role === "assistant"}
            fallback={
              <div class="w-[20px] h-[20px] flex items-center justify-center">
                <img src={userIcon} class="w-full h-full rounded-full" alt="user" />
              </div>
            }
          >
            <div 
              innerHTML={chatgptIcon} 
              class="w-[20px] h-[20px] flex items-center justify-center icon-wrapper"
            />
          </Show>
          <Show when={props.message.type === "locked"}>
            <div class="i-carbon:locked text-white absolute" />
          </Show>
        </div>
        <div
          class="message prose prose-slate dark:prose-invert dark:text-slate break-words overflow-hidden"
          innerHTML={renderedMarkdown()
            .replace(
              /\s*Vercel\s*/g,
              `<a href="http://vercel.com/?utm_source=busiyi&utm_campaign=oss" style="border-bottom:0;margin-left: 6px">${vercel}</a>`
            )
            .replace(
              /\s*OpenAI\s*/g,
              `<a href="https://www.openai.com" style="border-bottom:0;margin-left: 6px">${openai}</a>`
            )}
        />
        <Show when={!props.hiddenAction}>
          <MessageAction
            del={del}
            copy={copy}
            edit={edit}
            reAnswer={reAnswer}
            role={props.message.role}
          />
        </Show>
      </div>
    </Show>
  )
}
