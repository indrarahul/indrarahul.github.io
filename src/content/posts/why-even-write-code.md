---
title: Claude Code Is Awesome! But Do We Still Need to Write Code?
date: 9th Feb 2026
description: Reflections on AI-native software development and why the future might not need traditional code at all.
---

## The Shift

Over the last few months, I've been spending a lot of time working with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and intentionally shifting toward a more AI-native way of thinking and building. That process has surfaced a set of questions I can't quite shake.

Claude Code already suggests a future where humans write far less code. But I keep wondering: **why do we need to write code at all?**

## The Legacy of Abstraction

Today, most software exists to solve human problems by translating intent into mathematical abstractions, then into code, then into bits for CPUs to execute, only to translate those bits back into something humans can understand. We moved from Assembly to C to object-oriented programming, built compilers, linters, and now AI copilots. To me, all of this feels like a long chain of tools created to help humans scale because *we had to write code*. Now, it feels like a legacy approach to building software.

Modern models, by contrast, are essentially large collections of learned parameters which can solve entire classes of problems without explicit hand-written logic. In principle, they could even generate raw binaries or pure assembly code directly from a problem description, skipping most of the abstractions we currently treat as fundamental.

## What Does an LLM-Native Stack Look Like?

That framing has pushed me to think about what a truly LLM-native software stack might look like if we stopped assuming code and CPU as the default abstraction. If intelligence increasingly lives in models, why should we still write traditional code at all? Instead of programming behavior explicitly, can we describe intent and let learned representations determine execution?

It also seems plausible that people will create and publish small specialized LLMs that function like today's apps, running locally or on-premise, not just in centralized clouds. To support that world, we may need AI-native runtimes, operating systems, deployment models, and new hardware assumptions — effectively a **full-stack rethink across software and hardware**.

## The Systems Questions

That raises a set of systems questions I find especially compelling:

- **Do we still need CPUs?** Or does a GPU-first or entirely new architecture make more sense? Interesting bit to explore here is do we need more probablistic computing (LLMs) and less, precise and quite efficient deterministic computing (legacy code) to help LLMs.
- **Can we support continuous online training rather than one-shot offline training?** For example, small LLMs solving real-time problems could use continuous RL to adapt their parameters (e.g. surge pricing systems in Uber).
- **Can agents communicate directly at the level of bits** rather than through heavy abstractions, reducing both overhead and computational costs at multiple layers?

## The AI Hive

In that world, datacenters might start to resemble a global AI "Hive" — deployed and constantly interacting using next-gen APIs with minimal cost. Supporting this may even require a universal low-level language, an AI equivalent of C, where information is just streams of 1s and 0s flowing with minimal abstraction across the full stack.

## Why This Matters Now

To me, this feels less like a research curiosity and more like a concrete systems problem spanning runtimes, training loops, deployment, and hardware bias. We're at an inflection point where the tools we use to build software are becoming capable enough to question the very foundations of how software is built.

The question isn’t if AI will change how we write code. It’s whether writing code will even matter anymore. My bet eventually, humans won’t write code at all, just as we once outgrew low-level programming.