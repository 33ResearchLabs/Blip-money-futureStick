import { useWallet, useConnection } from "@solana/wallet-adapter-react";

export function WalletInfo() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  if (!connected) return <p>Wallet not connected</p>;

  return (
    <div>
      <p>Wallet Address:</p>
      <p>{publicKey?.toBase58()}</p>
    </div>
  );
}
