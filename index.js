import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

(async () => {
// Step 1: Connect to cluster and generate two new Keypairs
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const walletA = new Uint8Array(
  [102,192,55,77,189,156,100,246,164,250,56,59,162,197,89,199,94,42,40,212,226,23,71,138,199,3,116,86,183,86,113,143,5,127,94,35,132,76,62,163,49,53,14,94,189,184,89,180,49,36,43,195,9,210,51,216,127,220,101,77,155,245,151,93]
  );

  var fromWallet = Keypair.fromSecretKey(walletA);
    

// Step 2: Airdrop SOL into your from wallet
const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
// Wait for airdrop confirmation
await connection.confirmTransaction(fromAirdropSignature, { commitment: "confirmed" });

    
// Step 3: Create new token mint and get the token account of the fromWallet address
//If the token account does not exist, create it
const mint = new PublicKey("iP5Qbw3L7spDaKNTy59TwwKYmWUQsbAuXdxJ9aFj9DU"); // already existing token

// const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);
const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
)

    
//Step 4: Mint a new token to the from account
let signature = await mintTo(
	connection,
	fromWallet,
	mint,
	fromTokenAccount.address,
	fromWallet.publicKey,
	1000000000,
	[]
);
console.log('mint tx:', signature);
    
//Step 5: Get the token account of the to-wallet address and if it does not exist, create it
const demoReciever = new PublicKey("AzZT3PkzzsdKj64MDscYm81a84QESzS7hRXXL3o8syKo");
const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
	fromWallet,
	mint,
	demoReciever
);

signature = await mintTo(
   connection,
   fromWallet,
   mint,
   toTokenAccount.address,
   fromWallet.publicKey,
   1000000000,
   []
);

console.log('transfer tx:', signature);

})();