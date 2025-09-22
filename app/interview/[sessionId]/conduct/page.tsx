import InterviewConduct from '@/components/interview/InterviewConduct'

interface PageProps {
  params: Promise<{ sessionId: string }>
}

export default async function InterviewConductPage({ params }: PageProps) {
  const { sessionId } = await params
  return <InterviewConduct sessionId={sessionId} />
}