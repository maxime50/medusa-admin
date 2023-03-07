import { Store } from "@medusajs/medusa"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import BreadCrumb from "../../components/molecules/breadcrumb"
import Input from "../../components/molecules/input"
import BodyCard from "../../components/organisms/body-card"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"

type AccountDetailsFormData = {
  name: string
  swap_link_template: string | undefined
  payment_link_template: string | undefined
  invite_link_template: string | undefined
}

const AccountDetails = () => {
  const { register, reset, handleSubmit } = useForm<AccountDetailsFormData>()
  const { store } = useAdminStore()
  const { mutate } = useAdminUpdateStore()
  const notification = useNotification()

  const handleCancel = () => {
    if (store) {
      reset(mapStoreDetails(store))
    }
  }

  useEffect(() => {
    handleCancel()
  }, [store])

  const onSubmit = (data: AccountDetailsFormData) => {
    const validateSwapLinkTemplate = validateUrl(data.swap_link_template)
    const validatePaymentLinkTemplate = validateUrl(data.payment_link_template)
    const validateInviteLinkTemplate = validateUrl(data.invite_link_template)

    if (!validateSwapLinkTemplate) {
      notification("Erreur", "Url d'échange malformée", "error")
      return
    }

    if (!validatePaymentLinkTemplate) {
      notification("Erreur", "Url de paiement malformée", "error")
      return
    }

    if (!validateInviteLinkTemplate) {
      notification("Erreur", "Url d'invitation malformée", "error")
      return
    }

    mutate(data, {
      onSuccess: () => {
        notification("Succès", "Boutique mise à jour avec succès", "success")
      },
      onError: (error) => {
        notification("Erreur", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form className="flex-col py-5">
      <div className="max-w-[632px]">
        <BreadCrumb
          previousRoute="/a/settings/"
          previousBreadcrumb="Paramètres"
          currentPage="Détails de la boutique"
        />
        <BodyCard
          events={[
            {
              label: "Sauvegarder",
              type: "button",
              onClick: handleSubmit(onSubmit),
            },
            {
              label: "Annuler les changements",
              type: "button",
              onClick: handleCancel,
            },
          ]}
          title="Détails de la boutique"
          subtitle="Gérer les détails de la boutique"
        >
          <h6 className="inter-base-semibold mt-large">Général</h6>
          <Input
            className="mt-base"
            label="Nom de la boutique"
            {...register("name")}
            placeholder="Bijoux Tendances"
          />
          {/* <h6 className="inter-base-semibold mt-2xlarge">Paramètres avancés</h6> */}
          {/* <Input */}
          {/*   className="mt-base" */}
          {/*   label="Swap link template" */}
          {/*   {...register("swap_link_template")} */}
          {/*   placeholder="https://acme.inc/swap={swap_id}" */}
          {/* /> */}
          {/* <Input */}
          {/*   className="mt-base" */}
          {/*   label="Draft order link template" */}
          {/*   {...register("payment_link_template")} */}
          {/*   placeholder="https://acme.inc/payment={payment_id}" */}
          {/* /> */}
          {/* <Input */}
          {/*   className="mt-base" */}
          {/*   label="Invite link template" */}
          {/*   {...register("invite_link_template")} */}
          {/*   placeholder="https://acme-admin.inc/invite?token={invite_token}" */}
          {/* /> */}
        </BodyCard>
      </div>
    </form>
  )
}

const validateUrl = (address: string | undefined) => {
  if (!address || address === "") {
    return true
  }

  try {
    const url = new URL(address)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (_) {
    return false
  }
}

const mapStoreDetails = (store: Store): AccountDetailsFormData => {
  return {
    name: store.name,
    swap_link_template: store.swap_link_template,
    payment_link_template: store.payment_link_template,
    invite_link_template: store.invite_link_template,
  }
}

export default AccountDetails
