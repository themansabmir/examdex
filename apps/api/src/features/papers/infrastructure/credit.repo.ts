export async function lockAndGetUserCredits(tx: any, userId: string) {
  const rows = await tx.$queryRawUnsafe(
    `SELECT credits FROM "User" WHERE id = $1 FOR UPDATE`,
    userId
  );

  return rows[0];
}

export async function decrementCredit(tx: any, userId: string) {
  await tx.user.update({
    where: { id: userId },
    data: { credits: { decrement: 1 } },
  });
}

export async function refundCredit(tx: any, userId: string) {
  await tx.user.update({
    where: { id: userId },
    data: { credits: { increment: 1 } },
  });
}
