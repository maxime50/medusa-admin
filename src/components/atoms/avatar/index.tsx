import * as RadixAvatar from "@radix-ui/react-avatar"
import clsx from "clsx"
import React from "react"
import Spinner from "../spinner"

type AvatarProps = {
  user?: {
    img?: string
    first_name?: string
    last_name?: string
    email?: string
  }
  font?: string
  color?: string
  isLoading?: boolean
}

const Avatar: React.FC<AvatarProps> = ({
  user,
  font = "inter-small-semibold",
  color = "bg-violet-60",
  isLoading = false,
}) => {
  let username: string

  if (user?.first_name && user?.last_name) {
    username = user.first_name + " " + user.last_name
  } else if (user?.email) {
    username = user.email
  } else {
    username = "Utilisateur bijoux tendances"
  }

  return (
    <RadixAvatar.Root
      className={clsx(
        "h-full w-full select-none items-center justify-center overflow-hidden rounded-circle",
        color
      )}
    >
      <RadixAvatar.Image
        src={user?.img}
        alt={username}
        className="h-full w-full rounded-circle object-cover"
      />
      <RadixAvatar.Fallback
        className={clsx(
          "flex h-full w-full items-center justify-center rounded-circle bg-inherit text-grey-0",
          font
        )}
      >
        {isLoading ? (
          <Spinner size="small" variant="primary" />
        ) : (
          username.slice(0, 1).toUpperCase()
        )}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}

export default Avatar
