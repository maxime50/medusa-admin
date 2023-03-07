import { Invite, User } from "@medusajs/medusa"
import copy from "copy-to-clipboard"
import { useAdminStore } from "medusa-react"
import React, { useEffect, useState } from "react"
import useNotification from "../../hooks/use-notification"
import Medusa from "../../services/api"
import ClipboardCopyIcon from "../fundamentals/icons/clipboard-copy-icon"
import EditIcon from "../fundamentals/icons/edit-icon"
import RefreshIcon from "../fundamentals/icons/refresh-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import StatusIndicator from "../fundamentals/status-indicator"
import SidebarTeamMember from "../molecules/sidebar-team-member"
import Table from "../molecules/table"
import DeletePrompt from "../organisms/delete-prompt"
import EditUser from "../organisms/edit-user-modal"

type UserListElement = {
  entity: any
  entityType: string
  tableElement: JSX.Element
}

type UserTableProps = {
  users: any[]
  invites: any[]
  triggerRefetch: () => void
}

const getInviteStatus = (invite: Invite) => {
  return new Date(invite.expires_at) < new Date() ? "expired" : "pending"
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  invites,
  triggerRefetch,
}) => {
  const [elements, setElements] = useState<UserListElement[]>([])
  const [shownElements, setShownElements] = useState<UserListElement[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState(false)
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null)
  const notification = useNotification()
  const { store, isLoading } = useAdminStore()

  useEffect(() => {
    setElements([
      ...users.map((user, i) => ({
        entity: user,
        entityType: "user",
        tableElement: getUserTableRow(user, i),
      })),
      ...invites.map((invite, i) => ({
        entity: invite,
        entityType: "invite",
        tableElement: getInviteTableRow(invite, i),
      })),
    ])
  }, [users, invites])

  useEffect(() => {
    setShownElements(elements)
  }, [elements])

  const handleClose = () => {
    setDeleteUser(false)
    setSelectedUser(null)
    setSelectedInvite(null)
  }

  const getUserTableRow = (user: User, index: number) => {
    return (
      <Table.Row
        key={`user-${index}`}
        color={"inherit"}
        actions={[
          {
            label: "Modifier l'utilisateur",
            onClick: () => setSelectedUser(user),
            icon: <EditIcon size={20} />,
          },
          {
            label: "Supprimer l'utilisateur",
            variant: "danger",
            onClick: () => {
              setDeleteUser(true)
              setSelectedUser(user)
            },
            icon: <TrashIcon size={20} />,
          },
        ]}
      >
        <Table.Cell>
          <SidebarTeamMember user={user} />
        </Table.Cell>
        <Table.Cell className="w-80">{user.email}</Table.Cell>
        <Table.Cell className="inter-small-semibold text-violet-60">
          {user.role.charAt(0).toUpperCase()}
          {user.role.slice(1)}
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    )
  }

  const getInviteTableRow = (invite: Invite, index: number) => {
    return (
      <Table.Row
        key={`invite-${index}`}
        actions={[
          {
            label: "Renvoyer l'invitation",
            onClick: () => {
              Medusa.invites
                .resend(invite.id)
                .then(() => {
                  notification("Succès", "Lien d'invitation renvoyé", "success")
                })
                .then(() => triggerRefetch())
            },
            icon: <RefreshIcon size={20} />,
          },
          {
            label: "Copier le lien d'invitation",
            disabled: isLoading,
            onClick: () => {
              const link_template =
                store?.invite_link_template ??
                `${window.location.origin}/invite?token={invite_token}`

              copy(link_template.replace("{invite_token}", invite.token))
              notification("Succès", "Lien d'invitation copié", "success")
            },
            icon: <ClipboardCopyIcon size={20} />,
          },
          {
            label: "Supprimer l'invitation",
            variant: "danger",
            onClick: () => {
              setSelectedInvite(invite)
            },
            icon: <TrashIcon size={20} />,
          },
        ]}
      >
        <Table.Cell className="text-grey-40">
          <SidebarTeamMember user={{ email: invite.user_email }} />
        </Table.Cell>
        <Table.Cell className="w-80 text-grey-40">
          {invite.user_email}
        </Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell>
          {new Date(invite?.expires_at) < new Date() ? (
            <StatusIndicator title={"Expiré"} variant={"danger"} />
          ) : (
            <StatusIndicator title={"En attente"} variant={"success"} />
          )}
        </Table.Cell>
      </Table.Row>
    )
  }

  const filteringOptions = [
    {
      title: "Permissions de l'équipe",
      options: [
        {
          title: "Tout",
          count: elements.length,
          onClick: () => setShownElements(elements),
        },
        {
          title: "Membre",
          count: elements.filter(
            (e) => e.entityType === "user" && e.entity.role === "member"
          ).length,
          onClick: () =>
            setShownElements(
              elements.filter(
                (e) => e.entityType === "user" && e.entity.role === "member"
              )
            ),
        },
        {
          title: "Administrateur",
          count: elements.filter(
            (e) => e.entityType === "user" && e.entity.role === "admin"
          ).length,
          onClick: () =>
            setShownElements(
              elements.filter(
                (e) => e.entityType === "user" && e.entity.role === "admin"
              )
            ),
        },
        {
          title: "Pas de permission d'équipe",
          count: elements.filter((e) => e.entityType === "invite").length,
          onClick: () =>
            setShownElements(elements.filter((e) => e.entityType === "invite")),
        },
      ],
    },
    {
      title: "Status",
      options: [
        {
          title: "Tout",
          count: elements.length,
          onClick: () => setShownElements(elements),
        },
        {
          title: "Actif",
          count: elements.filter((e) => e.entityType === "user").length,
          onClick: () =>
            setShownElements(elements.filter((e) => e.entityType === "user")),
        },
        {
          title: "En attente",
          count: elements.filter(
            (e) =>
              e.entityType === "invite" &&
              getInviteStatus(e.entity) === "pending"
          ).length,
          onClick: () =>
            setShownElements(
              elements.filter(
                (e) =>
                  e.entityType === "invite" &&
                  getInviteStatus(e.entity) === "pending"
              )
            ),
        },
        {
          title: "Expiré",
          count: elements.filter(
            (e) =>
              e.entityType === "invite" &&
              getInviteStatus(e.entity) === "expired"
          ).length,
          onClick: () =>
            setShownElements(
              elements.filter(
                (e) =>
                  e.entityType === "invite" &&
                  getInviteStatus(e.entity) === "expired"
              )
            ),
        },
      ],
    },
  ]

  const handleUserSearch = (term: string) => {
    setShownElements(
      elements.filter(
        (e) =>
          e.entity?.first_name?.includes(term) ||
          e.entity?.last_name?.includes(term) ||
          e.entity?.email?.includes(term) ||
          e.entity?.user_email?.includes(term)
      )
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <Table
        filteringOptions={filteringOptions}
        enableSearch
        handleSearch={handleUserSearch}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell className="w-72">Nom</Table.HeadCell>
            <Table.HeadCell className="w-80">Courriel</Table.HeadCell>
            <Table.HeadCell className="w-72">
              Permissions de l'équipe
            </Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>{shownElements.map((e) => e.tableElement)}</Table.Body>
      </Table>
      {selectedUser &&
        (deleteUser ? (
          <DeletePrompt
            text={"Êtes-vous sûr de vouloir supprimer cet utilisateur ?"}
            heading={"Supprimer l'utilisateur"}
            onDelete={() =>
              Medusa.users.delete(selectedUser.id).then(() => {
                notification(
                  "Succès",
                  "L'utilisateur a été supprimé",
                  "success"
                )
                triggerRefetch()
              })
            }
            handleClose={handleClose}
          />
        ) : (
          <EditUser
            handleClose={handleClose}
            user={selectedUser}
            onSuccess={() => triggerRefetch()}
          />
        ))}
      {selectedInvite && (
        <DeletePrompt
          text={"Êtes-vous sûr de vouloir supprimer cette invitation ?"}
          heading={"Supprimer l'invitation"}
          onDelete={() =>
            Medusa.invites.delete(selectedInvite.id).then(() => {
              notification("Succès", "L'invitation a été supprimée", "success")
              triggerRefetch()
            })
          }
          handleClose={handleClose}
        />
      )}
    </div>
  )
}

export default UserTable
