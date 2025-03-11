import { BoardEditor } from '@/components/BoardEditor'

export default function BoardPage({ params }: { params: { id: string } }) {
  return <BoardEditor id={params.id} />
} 