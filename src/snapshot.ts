import { provider } from './provider';

export async function snapshot(): Promise<() => Promise<void>> {
  let snap: unknown;
  const reset = async () => {
    snap = await provider.send('evm_snapshot');
  }
  await reset();
  return async () => {
    await provider.send('evm_revert', [snap]);
    reset();
  };
}
