import { Avatar } from "@glob-ui/avatar"

export default function AvatarDefault() {
  return (
    <div className="flex items-center gap-4">
      <Avatar alt="Ana Torres" size="sm" />
      <Avatar alt="Luis Gómez" size="md" />
      <Avatar alt="Sara Díaz" size="lg" />
    </div>
  )
}
