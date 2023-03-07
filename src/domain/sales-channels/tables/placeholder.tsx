import React from "react"

import Button from "../../../components/fundamentals/button"
import SidedMouthFaceIcon from "../../../components/fundamentals/icons/sided-mouth-face"

function Placeholder({ showAddModal }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <span className="text-grey-50">
        <SidedMouthFaceIcon width="48" height="48" />
      </span>

      <h3 className="text-gray-90 mt-6 text-large font-semibold">
        Commencez à créer la configuration de canaux de vente...
      </h3>
      <p className="mt-2 mb-8 w-[358px] text-center text-grey-50">
        Vous n'avez pas encore ajouté de produits à ces canaux de vente. Mais
        une fois ajoutés, ils apparaîtront ici.
      </p>

      <Button onClick={showAddModal} variant="primary" size="small">
        Ajouter des produits
      </Button>
    </div>
  )
}

export default Placeholder
