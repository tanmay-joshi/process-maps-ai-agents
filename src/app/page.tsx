import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { PrismaClient, Board } from "@prisma/client"

const prisma = new PrismaClient()

export default async function Home() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const boards = await prisma.board.findMany({
    where: {
      userId: session.user?.email as string,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Process Boards</h1>
        <Link
          href="/boards/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Create New Board
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board: Board) => (
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{board.name}</h2>
            <p className="text-gray-500 text-sm">
              Last updated: {board.updatedAt.toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
