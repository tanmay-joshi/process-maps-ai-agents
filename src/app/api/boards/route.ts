import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { name } = await request.json()
    
    // First, find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Create the board with the correct user ID
    const board = await prisma.board.create({
      data: {
        name,
        userId: user.id,
      },
    })

    return NextResponse.json(board)
  } catch (error) {
    console.error("Error creating board:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession()

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    // First, find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Get all boards for the user
    const boards = await prisma.board.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(boards)
  } catch (error) {
    console.error("Error fetching boards:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 