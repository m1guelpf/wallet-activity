# What if wallets understood your transactions?
> The missing Ethereum-to-human transaction translator

This repository contains a PoC "transaction translator", which attempts to interpret what transactions actually do (instead of just showing a bunch of hex). It uses Covalent APIs to get a list of transactions with events, and then runs them through an Augmenter (to attach extra data, like ENS names of participants, function names, or event data), and then an Interpreter (which attempts to match the transaction with any of the known types and decode it).
