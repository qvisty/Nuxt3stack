const ALLOWED_EMAILS = ['qvisty@gmail.com', 'rikke.auning@gmail.com']

export default oauthGoogleEventHandler({
  config: {
    scope: ['email', 'profile'],
  },
  async onSuccess(event, { user }) {
    if (!ALLOWED_EMAILS.includes(user.email)) {
      return sendRedirect(event, '/?error=unauthorized')
    }

    const db = useDrizzle()

    let dbUser = await db
      .select()
      .from(tables.users)
      .where(eq(tables.users.googleId, user.sub))
      .get()

    if (!dbUser) {
      const id = crypto.randomUUID()
      await db.insert(tables.users).values({
        id,
        email: user.email,
        name: user.name || user.email,
        avatar: user.picture ?? null,
        googleId: user.sub,
      })
      dbUser = await db
        .select()
        .from(tables.users)
        .where(eq(tables.users.id, id))
        .get()
    } else {
      await db
        .update(tables.users)
        .set({
          name: user.name || dbUser.name,
          avatar: user.picture || dbUser.avatar,
        })
        .where(eq(tables.users.id, dbUser.id))
    }

    await setUserSession(event, {
      user: {
        id: dbUser!.id,
        email: dbUser!.email,
        name: dbUser!.name,
        avatar: dbUser!.avatar,
      },
    })

    return sendRedirect(event, '/dashboard')
  },
  async onError(event, error) {
    console.error('Google OAuth fejl:', error)
    return sendRedirect(event, '/?error=oauth')
  },
})
