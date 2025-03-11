import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession()
  const boardId = context.params.id

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { nodes, edges } = await request.json()
    
    // First, find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Find the board and verify ownership
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
    })

    if (!board) {
      return new NextResponse("Board not found", { status: 404 })
    }

    if (board.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Delete existing shapes and connections
    await prisma.connection.deleteMany({
      where: {
        boardId: boardId,
      },
    })

    await prisma.shape.deleteMany({
      where: {
        boardId: boardId,
      },
    })

    // Create new shapes
    const createdShapes = await Promise.all(
      nodes.map((node: any) =>
        prisma.shape.create({
          data: {
            id: node.id,
            type: node.type,
            x: node.position.x,
            y: node.position.y,
            width: 150, // Default width
            height: node.type === 'sticky' ? 100 : 50, // Different height for sticky notes
            text: node.data.label,
            boardId: boardId,
          },
        })
      )
    )

    // Create new connections
    await Promise.all(
      edges.map((edge: any) =>
        prisma.connection.create({
          data: {
            fromShapeId: edge.source,
            toShapeId: edge.target,
            boardId: boardId,
            pointsJson: JSON.stringify(edge),
          },
        })
      )
    )

    // Update board's updatedAt timestamp
    await prisma.board.update({
      where: {
        id: boardId,
      },
      data: {
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving board:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 