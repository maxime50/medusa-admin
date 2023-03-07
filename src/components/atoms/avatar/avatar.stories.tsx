import { ComponentMeta } from "@storybook/react"
import React from "react"
import Avatar from "."

export default {
  title: "Atoms/Avatar",
  component: Avatar,
} as ComponentMeta<typeof Avatar>

const Template = (args) => (
  <div className="h-large w-large">
    <Avatar {...args} />
  </div>
)

export const User = Template.bind({})
User.args = {
  user: {
    first_name: "Laura",
    last_name: "Parent",
    email: "exemple@hotmail.com",
  },
}

export const NoUser = Template.bind({})
NoUser.args = {}
