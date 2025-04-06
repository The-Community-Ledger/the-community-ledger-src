# The Community Ledger. 

## Inspiration

Peer review is broken. It's slow, expensive, and opaque. Most of the money in academic publishing flows to a few corporate gatekeepers, while reviewers work for free and early-career researchers struggle to get recognized.

We wanted to build a permissionless, anonymous, and reward-driven alternative — something that reflects the open, decentralized ideals of science itself. We asked: what if peer review worked more like a credibly neutral, blockchain-based game?

## What it does

**The Community Ledger** is a decentralized, incentive-aligned scientific journal system.

- Anyone can create an **Issue** by staking tokens.
- Authors can anonymously submit articles (stored on IPFS).
- Reviewers stake JCR to post reviews.
- When the issue closes, **rewards are automatically minted** to authors, reviewers, and issue creators.
- All actions are permissionless and tied to stake-based participation.

It’s peer review without publishers — just transparent, accountable reputation and incentive flows.

## How we built it

We deployed the system to Polygon using **dapp-launchpad** and built it around a modular smart contract architecture in Solidity:

- `JournalCore` controls Issue creation and reward minting.
- `JournalIssue` handles article submission and review flow.
- Each article and review is stored on **IPFS**, and actions are gated by staking a custom ERC20 token: `JournalCredit (JCR)`.

The frontend is built in **Next.js** using React and **@uiw/react-md-editor** for markdown-based article writing and reviews.  
We integrated with the **Hardhat + Foundry** stack for contracts and scripting.

This was a great hands-on project for combining multiple technologies — from IPFS and ERC20 to contract factories and frontend workflows — into a working dApp.

## Challenges we ran into

- Designing a reward mechanism that’s simple but meaningful — we used a diminishing reward curve that converges to 1.5× stake.
- Managing ownership, minting, and contract permissions across modular contracts.
- Dynamically handling IPFS content uploads and sample data for the demo.
- Making sure contract interactions remained flexible, gas-efficient, and permissionless.

## Accomplishments that we're proud of

- You can fully run a journal issue: submit articles, submit reviews, and distribute rewards — all on-chain, without any admin or gatekeeper.
- Built a working stake-based reward system and token economy in 48 hours.
- Modular, extensible architecture — easy to extend with new roles, rules, and journals.
- Designed around real scientific use cases, not just speculative DeFi.

## What we learned

- Staking is a powerful primitive for access control and incentives.
- Modular contracts are more complex up front, but pay off in flexibility.
- Decentralized tools (like IPFS and ERC20) can support real-world collaborative workflows.
- Solidity forces you to be precise — and that makes your logic better.

## What's next for The Community Ledger.

- Integrate **Semaphore** for anonymous voting and reputation.
- Implement **quadratic voting** and allow votes on both articles and reviews.
- Make the frontend **gasless** with meta-transactions — users just need JCR to interact.
- Add support for retractions, challenges, and citation-based credit redistribution.
- Enable community journals with custom rulesets (e.g. “Neurobiology of Aging”).
- Integrate ZK credentials or ORCID for portable, anonymous reputation.

We're building a new layer for scientific publishing — decentralized, open, and fair by design.