import { SubmissionWizard } from "@/components/papers/submission-wizard"

export default function SubmitPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Submit Paper</h1>
      <SubmissionWizard />
    </div>
  )
}
