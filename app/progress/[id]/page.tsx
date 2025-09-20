import ResearchProgress from '@/components/research/ResearchProgress'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProgressPage({ params }: PageProps) {
  const { id } = await params
  return <ResearchProgress researchId={id} />
}