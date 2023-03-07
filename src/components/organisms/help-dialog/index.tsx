import React, { useState } from "react"
import Button from "../../fundamentals/button"
import DiscordIcon from "../../fundamentals/icons/discord-icon"
import InputField from "../../molecules/input"
import TextArea from "../../molecules/textarea"

import * as Dialog from "@radix-ui/react-dialog"

type MailDialogProps = {
  onClose: () => void
  open: boolean
}

const MailDialog = ({ open, onClose }: MailDialogProps) => {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [link, setLink] = useState("mailto:support@medusajs.com")

  React.useEffect(() => {
    setLink(
      `mailto:support@medusajs.com?subject=${encodeURI(
        subject
      )}&body=${encodeURI(body)}`
    )
  }, [subject, body])

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed top-0 left-0 right-0 bottom-0 z-50 grid place-items-end overflow-y-auto">
        <Dialog.Content className="fixed top-[64px] bottom-2 right-3 flex w-[400px] flex-col justify-between rounded-rounded bg-grey-0 p-8 shadow-dropdown">
          <div>
            <Dialog.Title className="inter-xlarge-semibold mb-6">
              Besoin d'aide ?
            </Dialog.Title>
            <InputField
              label={"Sujet"}
              value={subject}
              className="mb-4"
              placeholder="De quoi s'agit-il ?"
              onChange={(e) => setSubject(e.target.value)}
            />
            <TextArea
              label={"Message"}
              placeholder="Écrire un message..."
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
              }}
              rows={8}
              enableEmoji
            />
          </div>
          <div className="flex flex-col items-center gap-y-base">
            <a className="w-full" href={link}>
              <Button variant="primary" size="large" className="w-full">
                Envoyer un message
              </Button>
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  )
}

export default MailDialog
