import { BatchJob } from "@medusajs/medusa/dist"

export enum BatchJobOperation {
  Import = "Importation",
  Export = "Exportation",
}

export function batchJobDescriptionBuilder(
  batchJob: BatchJob,
  operation: BatchJobOperation,
  elapsedTime?: number
): string {
  let description = ""

  const entityName = batchJob.type.split("-").reverse().pop()

  const twentyfourHoursInMs = 24 * 60 * 60 * 1000

  switch (batchJob.status) {
    case "failed":
      description = `${operation} des ${entityName}s a échoué.`
      break
    case "canceled":
      description = `${operation} des ${entityName}s a été annulée.`
      break
    case "completed":
      if (elapsedTime && Math.abs(elapsedTime) > twentyfourHoursInMs) {
        description = `${operation} Le fichier n'est plus disponible. Le fichier sera stocké que pendant 24 heures.`
        break
      } else {
        description = `${operation} des ${entityName}s est terminée.`
        break
      }
    case "processing":
      description = `${operation} des ${entityName}s est en cours de traitement. Vous pouvez fermer l'onglet d'activité en toute sécurité. Vous serez informée lorsque votre exportation sera prête à téléchargée.`
      break
    case "confirmed":
      description = `${operation} des ${entityName}s a été confirmée et commencera bientôt.`
      break
    case "pre_processed":
      description = `${operation} des ${entityName}s est en cours de traitement.`
      break
    default:
      description = `${operation} des ${entityName}s a été créée et commencera bientôt.`
  }

  return description
}
