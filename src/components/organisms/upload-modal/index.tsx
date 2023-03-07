import React, { ReactNode, useState } from "react"
import clsx from "clsx"

import Modal from "../../molecules/modal"
import Button from "../../fundamentals/button"
import FileIcon from "../../fundamentals/icons/file-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import DownloadIcon from "../../fundamentals/icons/download-icon"
import XCircleIcon from "../../fundamentals/icons/x-circle-icon"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import WarningCircle from "../../fundamentals/icons/warning-circle"
import CrossIcon from "../../fundamentals/icons/cross-icon"

type FileSummaryProps = {
  name: string
  size: number
  action: ReactNode
  progress?: number
  status?: string
}

/**
 * Render an upload file summary (& upload progress).
 */
function FileSummary(props: FileSummaryProps) {
  const { action, name, progress, size, status } = props

  const formattedSize =
    size / 1024 < 10
      ? `${(size / 1024).toFixed(2)} KiB`
      : `${(size / (1024 * 1024)).toFixed(2)} MiB`

  return (
    <div className="relative">
      <div
        style={{ width: `${progress}%` }}
        className="absolute h-full bg-grey-5 transition-width duration-150 ease-in-out"
      />
      <div className="border-1 relative mt-6 flex items-center rounded-xl border">
        <div className="m-4">
          <FileIcon size={30} fill={progress ? "#9CA3AF" : "#2DD4BF"} />
        </div>

        <div className="my-6 flex-1">
          <div className="text-small leading-5 text-grey-90">{name}</div>
          <div className="text-xsmall leading-4 text-grey-50">
            {status || formattedSize}
          </div>
        </div>

        <div className="m-6">{action}</div>
      </div>
    </div>
  )
}

type UploadSummaryProps = {
  creations: number
  updates: number
  rejections?: number
  type: string
}

/**
 * Render a batch update request summary.
 */
function UploadSummary(props: UploadSummaryProps) {
  const { creations, updates, rejections, type } = props
  return (
    <div className="flex gap-6">
      <div className="flex items-center text-small text-grey-90">
        <CheckCircleIcon color="#9CA3AF" className="mr-2" />
        <span className="font-semibold"> {creations}&nbsp;</span> nouveau {type}
      </div>
      {updates && (
        <div className="flex items-center text-small text-grey-90">
          <WarningCircle fill="#9CA3AF" className="mr-2" />
          <span className="font-semibold">{updates}&nbsp;</span> mises à jour
        </div>
      )}
      {rejections && (
        <div className="flex items-center text-small text-grey-90">
          <XCircleIcon color="#9CA3AF" className="mr-2" />
          <span className="font-semibold">{rejections}&nbsp;</span> rejections
        </div>
      )}
    </div>
  )
}

type DropAreaProps = {
  onUpload: (d: DataTransferItem) => void
}

/**
 * Component handles an CSV file drop.
 */
function DropArea(props: DropAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (e.dataTransfer.items?.length) {
      props.onUpload(e.dataTransfer.items[0].getAsFile())
    }
  }

  const handleFileSelect = (e) => {
    props.onUpload(e.target.files[0])
  }

  const onDragOver = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  return (
    <div
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
      onDragOver={onDragOver}
      onDrop={handleFileDrop}
      className={clsx(
        "mt-3 flex flex-col items-center justify-center rounded-xl border border-dashed p-6",
        { "opacity-50": isDragOver }
      )}
    >
      <span className="text-small text-grey-50">
        Déposez votre fichier ici, ou
        <a className="text-violet-60">
          <label className="cursor-pointer" htmlFor="upload-form-file">
            {" "}
            clicquez pour rechercher.
          </label>
          <input
            type="file"
            id="upload-form-file"
            className="hidden"
            // multiple
            accept="text/csv"
            onChange={handleFileSelect}
          />
        </a>
      </span>
      <span className="text-small text-grey-40">
        Seuls les fichiers .csv sont pris en charge.
      </span>
    </div>
  )
}

type UploadModalProps = {
  type: string
  status?: string
  fileTitle: string
  description1Text: string
  description2Title: string
  description2Text: string
  templateLink: string
  canImport?: boolean
  progress?: number
  onClose: () => void
  onSubmit: () => void
  onFileRemove: () => void
  processUpload: (...args: any[]) => Promise<any>
  summary?: { toCreate?: number; toUpdate?: number }
}

/**
 * Upload prices modal.
 */
function UploadModal(props: UploadModalProps) {
  const {
    description1Text,
    description2Text,
    description2Title,
    fileTitle,
    canImport,
    processUpload,
    onClose,
    onSubmit,
    onFileRemove,
    templateLink,
    progress,
    summary,
    status,
    type,
  } = props
  const [uploadFile, setUploadFile] = useState<File>()

  const { name, size } = uploadFile || {}

  const onUpload = async (file) => {
    setUploadFile(file)
    await processUpload(file)
  }

  const removeFile = () => {
    setUploadFile(undefined)
    onFileRemove()
  }

  return (
    <Modal open handleClose={onClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex justify-between">
            <span className="inter-large-semibold py-4 text-2xl text-grey-90">
              Importer {fileTitle}
            </span>
            <button onClick={onClose} className="cursor-pointer text-grey-50">
              <CrossIcon size={20} />
            </button>
          </div>

          <div className="inter-large-semibold mb-1 text-base text-grey-90">
            Importer {fileTitle}
          </div>

          <p className="mb-4 text-base text-grey-50">{description1Text}</p>

          {summary && (
            <UploadSummary
              creations={summary.toCreate}
              updates={summary.toUpdate}
              type={type}
            />
          )}

          {!uploadFile ? (
            <DropArea onUpload={onUpload} />
          ) : (
            <FileSummary
              size={size!}
              name={name!}
              status={status}
              // progress={progress}
              // TODO: change this to actual progress once this we can track upload
              progress={100}
              action={
                <a className="h-6 w-6 cursor-pointer" onClick={removeFile}>
                  <TrashIcon stroke="#9CA3AF" />
                </a>
              }
            />
          )}

          <div className="inter-large-semibold mt-8 text-base text-grey-90">
            {description2Title}
          </div>

          <p className="mb-2 text-base text-grey-50">{description2Text}</p>

          <FileSummary
            name="medusa-template.csv"
            size={2967}
            action={
              <a
                className="h-6 w-6 cursor-pointer"
                href={templateLink}
                download
              >
                <DownloadIcon stroke="#9CA3AF" />
              </a>
            }
          />

          <div className="h-2" />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex h-8 w-full justify-end">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="mr-2 justify-center text-small"
                size="small"
                onClick={onClose}
              >
                Annuler
              </Button>

              <Button
                size="small"
                disabled={!canImport}
                variant="primary"
                className="text-small"
                onClick={onSubmit}
              >
                Importer la liste
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default UploadModal
