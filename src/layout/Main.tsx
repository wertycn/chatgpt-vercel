import Header from "~/components/Header"
import type { JSXElement } from "solid-js"

export default function ({ children }: { children: JSXElement }) {
  return (
    <div id="app" class="sm:pt-2em py-2em before">
      <Header />
      {children}
    </div>
  )
}