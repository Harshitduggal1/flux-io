'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs'

export default function AuthCheck() {
  const router = useRouter()
  const { isLoading, isAuthenticated } = useKindeAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in')
    }
  }, [isLoading, isAuthenticated, router])

  // Render nothing while checking authentication
  return null
}
