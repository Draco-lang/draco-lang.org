---
layout: post
date:   2023-01-22 17:00:00 +0100
categories: api design
---
A command and a method have a common semantic:
Based on the input data, it executes some logic and returns a result.
But there are fundamental semantic differences between the two:
A method implies that the behaviour is local and immediate: the logic is executed locally and starts immediately.
The method logic can fail, but calling a method never fails (yes, in practice, calling a method can fail, but let’s not take these sort of edge cases for our API design).
A command doesn’t imply that. A command can be serialised (or not) and run locally, or remotely, right now or later.

# About RPC:

This is why I think RPC is not a good thing.
I believe that this semantic difference is a good thing to keep.
RPC tries to blur the boundaries and destroys this healthy semantic.
Calling an RPC method can fail if the remote is not available, and a method doesn’t convey this semantic.
Because the execution of an RPC method may be remotely, calling it may fail, is not local and is not immediate.
We lost all the semantics of the method, therefore it should be a command.