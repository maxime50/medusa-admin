import React from "react"
import { FieldArrayWithId, useFieldArray } from "react-hook-form"
import FileUploadField from "../../../../components/atoms/file-upload-field"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import Actionables, {
  ActionType,
} from "../../../../components/molecules/actionables"
import { FormImage } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"

export type ThumbnailFormType = {
  images: FormImage[]
}

type Props = {
  form: NestedForm<ThumbnailFormType>
}

const ThumbnailForm = ({ form }: Props) => {
  const { control, path } = form

  const { fields, remove, replace, append } = useFieldArray({
    control: control,
    name: path("images"),
  })

  const handleFilesChosen = (files: File[]) => {
    const toAppend = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      nativeFile: file,
      selected: false,
    }))

    if (files.length) {
      replace(toAppend)
    } else {
      append(toAppend)
    }
  }

  return (
    <div>
      <div>
        <div className="mt-large">
          <FileUploadField
            onFileChosen={handleFilesChosen}
            placeholder="1200 x 1600 (3:4) recommandée, 10MB maximum"
            filetypes={["image/gif", "image/jpeg", "image/png", "image/webp"]}
            className="py-large"
          />
        </div>
      </div>
      {fields.length > 0 && (
        <div className="mt-large">
          <h2 className="inter-large-semibold mb-small">Télécharger</h2>

          <div className="flex flex-col gap-y-2xsmall">
            {fields.map((field, index) => {
              return (
                <Image
                  key={field.id}
                  image={field}
                  index={index}
                  remove={remove}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

type ThumbnailProps = {
  image: FieldArrayWithId<ThumbnailFormType, "images", "id">
  index: number
  remove: (index: number) => void
}

const Image = ({ image, index, remove }: ThumbnailProps) => {
  const actions: ActionType[] = [
    {
      label: "Supprimer",
      onClick: () => remove(index),
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ]

  return (
    <div className="group flex items-center justify-between rounded-rounded px-base py-xsmall hover:bg-grey-5">
      <div className="flex items-center gap-x-large">
        <div className="flex h-16 w-16 items-center justify-center">
          <img
            src={image.url}
            alt={image.name || "Télécharger une image"}
            className="max-h-[64px] max-w-[64px] rounded-rounded"
          />
        </div>
        <div className="inter-small-regular flex flex-col text-left">
          <p>{image.name}</p>
          <p className="text-grey-50">
            {image.size ? `${(image.size / 1024).toFixed(2)} KB` : ""}
          </p>
        </div>
      </div>

      <Actionables actions={actions} forceDropdown />
    </div>
  )
}

export default ThumbnailForm
