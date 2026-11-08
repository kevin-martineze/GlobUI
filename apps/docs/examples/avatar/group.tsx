import { Avatar, AvatarGroup } from "@glob-ui/avatar"

export default function AvatarGroupExample() {
  return (
    <AvatarGroup max={3}>
      <Avatar alt="Ana Torres" />
      <Avatar alt="Luis Gómez" />
      <Avatar alt="Sara Díaz" />
      <Avatar alt="Iván Ruiz" />
      <Avatar alt="Eva Mora" />
    </AvatarGroup>
  )
}
