import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ticker')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ticker"!</div>
}
