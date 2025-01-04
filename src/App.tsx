import PrefixTitle from "~/components/PrefixTitle"
import { LocalStorageKey } from "~/types"
import "@unocss/reset/tailwind.css"
import "~/styles/main.css"
import "katex/dist/katex.min.css"
import "highlight.js/styles/atom-one-dark.css"
import { MetaProvider } from "@solidjs/meta"
import { ParentProps } from "solid-js"
import "uno.css"
import { Component } from 'solid-js'
import SearchBar from './components/SearchBar'
import Chat from './components/Chat'

const e = localStorage.getItem(LocalStorageKey.THEME) || ""
const a = window.matchMedia("(prefers-color-scheme: dark)").matches
if (!e || e === "auto" ? a : e === "dark") {
  document.documentElement.classList.add("dark")
}

if (!Array.prototype.at) {
  Array.prototype.at = function (index) {
    index = index < 0 ? index + this.length : index
    if (index >= 0 && index < this.length) {
      return this[index]
    }
  }
}

const App: Component = (props: ParentProps) => {
  return (
    <div>
      <MetaProvider>
        <PrefixTitle />
        <SearchBar />
        {props.children}
      </MetaProvider>
    </div>
  )
}

export default App
