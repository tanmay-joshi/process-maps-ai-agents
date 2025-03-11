'use client'

import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Process Maps
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create and share process diagrams with ease
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FaGithub className="h-5 w-5" />
            </span>
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  )
} 