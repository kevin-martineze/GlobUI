import { Alert, AlertDescription, AlertTitle } from "@glob-ui/alert"

export default function AlertDefault() {
  return (
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Your trial ends in 3 days.</AlertDescription>
    </Alert>
  )
}
