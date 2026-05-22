import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectWallet() {
  return (
    <div className="flex justify-center">
      <WalletMultiButton />
    </div>
  );
}
