export type Reason = string;

export async function expectRevert(txPromise: Promise<unknown>, reason?: Reason) {
  try {
    await txPromise;
    throw new Error("expected revert");
  } catch (err: any) {
    if (!isRevert(err)) {
      throw new Error(`tx promise rejected but not due to revert (${err.message})`);
    }
    if (reason && !err.message.includes(reason)) {
      throw new Error(`tx reverted but for different reason (${err.message})`);
    }
    return err;
  }
}

function isRevert(err: any) {
  const msg = err.message;
  if (typeof msg !== 'string') return false;
  return [
    // Hardhat
    /transaction:? reverted/i,
    /transaction ran out of gas/i,

    // Truffle/Ganache
    /Transaction: 0x[0-9a-f]+ exited with an error/,
  ].some(p => p.test(msg));
}
