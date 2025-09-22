import InterviewLanding from '@/components/interview/InterviewLanding'

interface PageProps {
  params: Promise<{ sessionId: string }>
}

export default async function InterviewPage({ params }: PageProps) {
  const { sessionId } = await params
  return <InterviewLanding sessionId={sessionId} />
}