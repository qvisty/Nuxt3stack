/**
 * Named route middleware: 'auth'
 *
 * Bruges kun på sider der eksplicit aktiverer den:
 *   definePageMeta({ middleware: 'auth' })
 *
 * Demonstrerer:
 *  - Betinget redirect
 *  - useState til simpel auth-state
 *  - navigateTo() helper
 */
export default defineNuxtRouteMiddleware((to) => {
  // I en rigtig app: tjek JWT token fra cookie/localStorage
  // Her simulerer vi med useState
  const isAuthenticated = useState('auth:isAuthenticated', () => false)

  // Sider der kræver login
  const protectedPaths = ['/dashboard', '/admin']

  if (protectedPaths.includes(to.path) && !isAuthenticated.value) {
    return navigateTo({
      path: '/middleware',
      query: { redirect: to.path, reason: 'not-authenticated' },
    })
  }
})
