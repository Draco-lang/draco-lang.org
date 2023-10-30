---
title: "Happy first birthday Draco compiler!"
date:   2023-10-09 18:23:00 +0200
teaser: "🎉 Celebrating Draco compiler's 1st birthday! Dive into a year of code, community, and incredible milestones. Let's rewind and relive the journey!"
image: "/generated/party.svg"
imageMargin: "20px"
---

I'd like to go through the first year of Draco compiler development, highlighting major milestones. This first year was full of exciting, sudden contributions and some extremely active time periods. I'm hoping the project will grow throughout the years, and this won't be the only yearly history diary I'll be able to write.

## In the beginning...
Early on, we decided that we'd rely on as few external tools, as possible. It's easy to progress quickly with tools like ANTLR or high(er)-level code generation, like `System.Reflection.Emit`, but eventually it will be a blocker for some issues - like proper error recovery or tree format. At that point, we would be locked in, and would have to spend huge efforts into just tearing out the old solution and developing the replacement. That said, the DIY approach made the beginning very slow and humble.

Please note, that we didn't have visualization tools in the beginning, and didn't target formats like Graphviz DOT until much later. To make this retrospective more authentic, I'll always use the output formats our compiler supported at the time.

* 2022 9th of October: Initial commit, README updates
* 2022 13th of October: Initial Lexer

At this point, the following code:
```draco
// Simple hello world
from System.Console import { WriteLine };

func main() {
    WriteLine("Hello, World!");
}
```

Produced this sequence of tokens:
```
"from": KeywordFrom
    leading trivia: ["// Simple hello world": LineComment, "\n": Newline]
    trailing trivia: [" ": Whitespace]
"System": Identifier
".": Dot
"Console": Identifier
    trailing trivia: [" ": Whitespace]
"import": KeywordImport
    trailing trivia: [" ": Whitespace]
"{": CurlyOpen
    trailing trivia: [" ": Whitespace]
"WriteLine": Identifier
    trailing trivia: [" ": Whitespace]
"}": CurlyClose
";": Semicolon
    trailing trivia: ["\n": Newline]
"func": KeywordFunc
    leading trivia: ["\n": Newline]
    trailing trivia: [" ": Whitespace]
"main": Identifier
"(": ParenOpen
")": ParenClose
    trailing trivia: [" ": Whitespace]
"{": CurlyOpen
    trailing trivia: ["\n": Newline]
"WriteLine": Identifier
    leading trivia: ["    ": Whitespace]
"(": ParenOpen
""": LineStringStart
"Hello, World!": StringContent
""": LineStringEnd
")": ParenClose
";": Semicolon
    trailing trivia: ["\n": Newline]
"}": CurlyClose
"": EndOfInput
```

As you can see, our decision was to keep semantically insignificant details - like spacing and comments - attached to the tokens. This, as many other decisions were inspired by the wonderful [Roslyn project](https://github.com/dotnet/roslyn).

* 2022 14th of October: Parse tree declarations, [EditorConfig](https://editorconfig.org/) setup
* 2022 15th of October: Lexer tests, CI setup
* 2022 16th Of October: Initial parser

Another important milestone, we are finally structuring tokens into a tree. The following code:
```draco
func main() {
    var x: int32 = 0;
    if (x > 0) {
        WriteLine("x > 0");
    }
}
```

Gets structured into the following tree:
```
CompilationUnit {
  Declarations: [
    Func {
      FuncKeyword: 'func',
      Identifier: 'main',
      Params: Enclosed {
        OpenToken: '(',
        Value: [],
        CloseToken: ')',
      },
      ReturnType: null,
      Body: BlockBody {
        Block: Block {
          Enclosed: Enclosed {
            OpenToken: '{',
            Value: (
              Item1: [
                Decl {
                  Declaration: Variable {
                    Keyword: 'var',
                    Identifier: 'x',
                    Type: TypeSpecifier {
                      ColonToken: ':',
                      Type: Name {
                        Identifier: 'int32',
                      },
                    },
                    Initializer: (
                      Item1: '=',
                      Item2: Literal {
                        Value: '0',
                      },
                    ),
                    Semicolon: ';',
                  },
                },
              ],
              Item2: If {
                IfKeyword: 'if',
                Condition: Enclosed {
                  OpenToken: '(',
                  Value: Relational {
                    Left: Name {
                      Identifier: 'x',
                    },
                    Comparisons: [
                      (
                        Item1: '>',
                        Item2: Literal {
                          Value: '0',
                        },
                      ),
                    ],
                  },
                  CloseToken: ')',
                },
                Then: UnitStmt {
                  Statement: Expr {
                    Expression: Block {
                      Enclosed: Enclosed {
                        OpenToken: '{',
                        Value: (
                          Item1: [
                            Expr {
                              Expression: Call {
                                Called: Name {
                                  Identifier: 'WriteLine',
                                },
                                Args: Enclosed {
                                  OpenToken: '(',
                                  Value: [
                                    Punctuated {
                                      Value: String {
                                        OpenQuotes: '"',
                                        Parts: [
                                          Content {
                                            Token: 'x > 0',
                                          },
                                        ],
                                        CloseQuotes: '"',
                                      },
                                      Punctuation: null,
                                    },
                                  ],
                                  CloseToken: ')',
                                },
                              },
                              Semicolon: ';',
                            },
                          ],
                          Item2: null,
                        ),
                        CloseToken: '}',
                      },
                    },
                    Semicolon: null,
                  },
                },
                Else: null,
              },
            ),
            CloseToken: '}',
          },
        },
      },
    },
  ],
}
```

* 2022 17th of October: Parser recovery improvements
* 2022 22nd of October: Completed lexer test suite, bugfixes
* 2022 23rd of October: Generating [red-green trees](https://blog.yaakov.online/red-green-trees/) and visitor for the parse tree
* 2022 24th of October: Initial public API and CLI
* 2022 25th of October: Parser tests and fixes

## The wild west
After having the lexer and parser more-or-less done, having them backed up with test cases, it was time to move on to the more interesting parts of the compiler. I'd like to call this portion the "wild west", as contributors started to experiment by branching out into different topics, even ones that are less fundamental to the core compiler. Of course these experiments made the whole project all more exciting.

* 2022 26th of October: Basic C# code-generation

After all, why not? We didn't have any semantic checks in place, but a syntax-based transpiler was a cheap way to motivate us by showing the running language.

Example Draco program:
```draco
func abs(n: int32): int32 =
    if (n < 0) -n
    else n;

func fib(n: int32): int32 =
    if (n < 2) 1
    else fib(n - 1) + fib(n - 2);

func main() {
    println("Hello, \{1} + \{2} is \{1 + 2}");
    println("|-12| = \{abs(-12)}");
    println("fib(5) = \{fib(5)}");
    println("""
        Hello, Multi line strings!
        I hope this works!
        """);
    println('\u{1F47D}');
    println("Hello,\nNewlines!");
}
```

And the absolutely atrocious C# it transpiled to (keep in mind, we didn't have type information yet!):
```cs
using static Prelude;
internal static class Prelude
{
    public record struct Unit;
    public record struct Char32(int Codepoint)
    {
        public override string ToString() =>
            char.ConvertFromUtf32(this.Codepoint);
    }
    public static Unit print(dynamic value)
    {
        System.Console.Write(value);
        return default;
    }
    public static Unit println(dynamic value)
    {
        System.Console.WriteLine(value);
        return default;
    }
}
internal sealed class Program
{
    internal static void Main(string[] args) => DracoProgram.main();
}
internal sealed class DracoProgram
{
    internal static dynamic abs(dynamic n)
    {
        dynamic reg_0 = default(Unit);
        dynamic reg_1 = false;
        if (n < 0) {
            reg_1 = true;
        }
        if (!reg_1) goto label_0;
        dynamic reg_2 = - n;
        reg_0 = n;
        goto label_1;
    label_0:;
        reg_0 = n;
    label_1:;
        return reg_0;
        return default(Unit);
    }
    internal static dynamic fib(dynamic n)
    {
        dynamic reg_3 = default(Unit);
        dynamic reg_4 = false;
        if (n < 2) {
            reg_4 = true;
        }
        if (!reg_4) goto label_2;
        reg_3 = 1;
        goto label_3;
    label_2:;
        dynamic reg_6 = n - 1;
        dynamic reg_7 = fib(reg_6);
        dynamic reg_8 = n - 2;
        dynamic reg_9 = fib(reg_8);
        dynamic reg_5 = reg_7 + reg_9;
        reg_3 = reg_5;
    label_3:;
        return reg_3;
        return default(Unit);
    }
    internal static dynamic main()
    {
        dynamic reg_10 = new System.Text.StringBuilder();
        reg_10.Append(\"Hello, \");
        reg_10.Append(1.ToString());
        reg_10.Append(\" + \");
        reg_10.Append(2.ToString());
        reg_10.Append(\" is \");
        dynamic reg_11 = 1 + 2;
        reg_10.Append(reg_11.ToString());
        dynamic reg_12 = println(reg_10.ToString());
        dynamic reg_13 = new System.Text.StringBuilder();
        reg_13.Append(\"|-12| = \");
        dynamic reg_14 = - 12;
        dynamic reg_15 = abs(12);
        reg_13.Append(reg_15.ToString());
        dynamic reg_16 = println(reg_13.ToString());
        dynamic reg_17 = new System.Text.StringBuilder();
        reg_17.Append(\"fib(5) = \");
        dynamic reg_18 = fib(5);
        reg_17.Append(reg_18.ToString());
        dynamic reg_19 = println(reg_17.ToString());
        dynamic reg_20 = new System.Text.StringBuilder();
        reg_20.Append(\"Hello, Multi line strings!\");
        reg_20.Append(\"\\n\");
        reg_20.Append(\"I hope this works!\");
        dynamic reg_21 = println(reg_20.ToString());
        dynamic reg_22 = println(new Char32(128125));
        dynamic reg_23 = new System.Text.StringBuilder();
        reg_23.Append(\"Hello,\\nNewlines!\");
        dynamic reg_24 = println(reg_23.ToString());
        return default(Unit);
    }
}
```

Our compiler finally executed simple programs! Admittedly, we didn't have any type-safety yet and we did invoke Roslyn to compile down the emitted C# code, but this was a major milestone in our eyes.

* 2022 27th of October: Web-compiler in Blazor, TextMate syntax highlighting

I woke up to one of the contributors putting the entire compiler in Blazor, so we could host a playground in a website. This completely blew my mind! Our little compiler, already on web!

![image](https://github.com/Draco-lang/Compiler/assets/7904867/a5027f56-2c27-4550-beb2-3f335397f79e)

While looking simplistic, it already had features such as running, displaying the transpiled C#, or the compiler .NET IL. It also has the feature to share code snippets through the URL, just like [SharpLab](https://sharplab.io/) does. To this day, some contributors use these URLs to share programs/bugs between each other.

This initiative is one of my favorites in the project. It shows, that there is so much more to a language than the compiler, and this makes the project all that more interesting.

This same day started the development of our VS Code extension. All we had back then, was syntax highlighting with some basic TextMate definitions.

* 2022 28th of October: Publish the web editor on our github.io site
* 2022 29th of October: Hotfixes around the web editor
* 2022 4th of November: Initial query system

This is an interesting one! Inspired by projects like [Salsa](https://github.com/salsa-rs/salsa), we wanted a general approach to incremental compiler frontends. One of our contributors showed us, how we can hijack the async state machine of C# to make this more seamless. The gist of it was this:

Computations we wanted to be incremental and their results memoized, we returned the `QueryValueTask` type for it, similarly how `Task` and `ValueTask` would be for regular async:
```cs
QueryValueTask<T> DoComputation(QueryDatabase db, T1 arg1, ...)
{
	...
}
```

Whenever we called a function like the above, the call only happened, if the method wasn't called with these parameters yet, or one of the dependencies changed. If anyone is interested, details can be found in [this issue](https://github.com/Draco-lang/Compiler/issues/68).

The solution was not long lived. While it sounded good in theory, we had more problems with it than it was worth, and ultimately went for a manual memoization solution, that was also replaced by the architecture we have today. Either way, it was a very interesting experiment, and showed how hackable C# was with its features.

* 2022 5th of November: `Result<T, E>` type implemented
* 2022 6th of November: a bunch of things
	* Diagnostics wired out into public API
	* Initial Language Server
	* More extensive parser test suite
	* Merge the compiler API and internals project into one

The Language Server was born, which can be used in a bunch of editors to this day, but the main target was always the VS Code extension. We utilized the [OmniSharp-LSP implementation](https://github.com/OmniSharp/csharp-language-server-protocol), something we would regret later. All our Language Server did at this point was showed diagnostics at the appropriate location and did some basic semantic highlighting.

![image](https://github.com/Draco-lang/Compiler/assets/7904867/fe24e659-402a-4cb9-9492-c7d72cf44908)

* 2022 7th of November: Code cleanup, simplifications, bugfixes
* 2022 8th of November: Floating point literals
* 2022 11th of November:  .NET 6 to .NET 7 update, reproducible builds
* 2022 12th of November: Mutation testing, CLI update, public API update, web editor rewrite
* 2022 13th of November: Red-green tree rewriting utility, web editor updates
* 2022 15th of November: Lexer and parser test suite extension
* 2022 18th of November: Web editor dependency updates, codegen fixes
* 2022 20th of November: Symbol resolution implemented, threw out the query system, misc. fixes

This was the first major semantic check implemented. Now the user couldn't just reference a non-existing name, the variable or function had to be declared appropriately. Shadowing support was also added. This addition improved the codegen accuracy by a lot, especially because C# does not support local variable shadowing.

* 2022 22nd of November: Basic AST structure implemented
* 2022 23rd of November: Stripped off state from the parser
* 2022 24th of November: Code formatting cleanup
* 2022 26th of November: CI tweaks, `Option<T>` type, initial formatter

This was another really interesting contribution, we could finally press Alt-Shift-F in VS Code, and got the code more-or-less formatted! We use this same formatter engine to this day. There are plans to improve it with [ideas from a very famous blog post](https://journal.stuffwithstuff.com/2015/09/08/the-hardest-program-ive-ever-written/), but it hasn't bothered us enough yet to tackle it.

* 2022 27th of November: Codegen fixes
* 2022 7th of December: Web editor theming fixes
* 2022 8th of December: Separated the concept of Token and Trivia
* 2022 11th of December: Web editor uses a web-worker to run the compiler
* 2022 12th of December: Type-checker, type-inference

Yet another major milestone for the compiler: we have type-safety, and some basic type-inference is in place as well! This means that the compiler does not just crash on type-unsafe code, but - for the most part - reports an appropriate error message. This meant, that we could finally turn our parse-tree into the well-typed AST, and update our codegen to utilize the type-information.

The absolute-value and Fibonacci functions recompiled with this version of the compiler yields the following C# code:

```cs
internal sealed class DracoProgram
{
    static DracoProgram()
    {
    }
    internal static System.Int32 abs(System.Int32 sym_1)
    {
        System.Int32 reg_0;
        System.Boolean reg_1 = sym_1 < 0;
        if (!reg_1) goto label_0;
        System.Int32 reg_2 = -sym_1;
        reg_0 = reg_2;
        goto label_1;
    label_0:;
        reg_0 = sym_1;
    label_1:;
        return reg_0;
    }
    internal static System.Int32 fib(System.Int32 sym_3)
    {
        System.Int32 reg_3;
        System.Boolean reg_4 = sym_3 < 2;
        if (!reg_4) goto label_2;
        reg_3 = 1;
        goto label_3;
    label_2:;
        System.Int32 reg_5 = sym_3 - 1;
        System.Int32 reg_6 = fib(reg_5);
        System.Int32 reg_7 = sym_3 - 2;
        System.Int32 reg_8 = fib(reg_7);
        System.Int32 reg_9 = reg_6 + reg_8;
        reg_3 = reg_9;
    label_3:;
        return reg_3;
    }
}
```

This looks way tidier, it finally resembles a register machine target language. More importantly, all the `dynamic` is gone.

* 2022 14th of December: Syntax factory utility, start of e2e testing
* 2022 17th of December: Semantic test suite introduced
* 2022 18th of December: README update, typechecking fixes
* 2022 23rd of December: Rework around location info
* 2022 30th of December: Go-to definition for the Language Server
* 2022 31st of December: Our internal IR and CIL compilation

Another milestone reached! We are now compiling to our custom, register-based IR, which is then translated to CIL, using the `System.Reflection.Metadata` APIs. The reason we are bothering with an IR, is because we want to do optimizations that the JIT does not do, like vectorization. In fact, our compiler already does 3 small optimization steps to make the output nicer: jump-threading, dead block elimination and - the only "real" optimization - tail-call optimization.

Let's take a look at the IR and CIL of the `fib` function now. The Draco IR:
```
assembly 'Output';
proc System.Int32 fib(System.Int32 n):
locals (
  System.Int32 <unnamed>
)
label bb_5:
  System.Boolean reg_3 = less n, 2
  jmp_if reg_3, bb_6, bb_7
label bb_6:
  store <unnamed>, 1
  jmp bb_8
label bb_7:
  System.Int32 reg_4 = sub n, 1
  System.Int32 reg_5 = call fib, [reg_4]
  System.Int32 reg_6 = sub n, 2
  System.Int32 reg_7 = call fib, [reg_6]
  System.Int32 reg_8 = add reg_5, reg_7
  store <unnamed>, reg_8
  jmp bb_8
label bb_8:
  System.Int32 reg_9 = load <unnamed>
  ret reg_9
```

The CIL:
```msil
.method public hidebysig static int32 fib (int32 n) cil managed
{
    // Method begins at RVA 0x2088
    // Header size: 12
    // Code size: 68 (0x44)
    .maxstack 8
    .locals (
        [0] int32,
        [1] bool,
        [2] int32,
        [3] int32,
        [4] int32,
        [5] int32,
        [6] int32,
        [7] int32
    )
    IL_0000: ldarg.1
    IL_0001: ldc.i4.2
    IL_0002: clt
    IL_0004: stloc.1
    IL_0005: ldloc.1
    IL_0006: brtrue IL_0010
    IL_000b: br IL_0017
    IL_0010: ldc.i4.1
    IL_0011: stloc.0
    IL_0012: br IL_003e
    IL_0017: ldarg.1
    IL_0018: ldc.i4.1
    IL_0019: sub
    IL_001a: stloc.2
    IL_001b: ldloc.2
    IL_001c: call int32 FreeFunctions::fib(int32)
    IL_0021: stloc.3
    IL_0022: ldarg.1
    IL_0023: ldc.i4.2
    IL_0024: sub
    IL_0025: stloc.s 4
    IL_0027: ldloc.s 4
    IL_0029: call int32 FreeFunctions::fib(int32)
    IL_002e: stloc.s 5
    IL_0030: ldloc.3
    IL_0031: ldloc.s 5
    IL_0033: add
    IL_0034: stloc.s 6
    IL_0036: ldloc.s 6
    IL_0038: stloc.0
    IL_0039: br IL_003e
    IL_003e: ldloc.0
    IL_003f: stloc.s 7
    IL_0041: ldloc.s 7
    IL_0043: ret
} // end of method FreeFunctions::fib
```

As you can see, while the IR is quite compact, the CIL is very suboptimal (and incorrect, but let's ignore that one for now). This is because the IR uses a register-based, SSA form, while CIL is stack-based. The simplistic conversion we chose is that for each register, we simply allocate a local. This means that a lot of useless copies are made. We are planning to solve this with a process that [LLVM calls stackification](https://llvm.org/doxygen/WebAssemblyRegStackify_8cpp_source.html), which they do for WASM for this exact same situation. This is not implemented to this day, but a prototype is actively being worked on.

## Race to release
At this point, the compiler flow was (almost) complete, we had a basic test-suite, a web editor, a language server, ... All that was left, was to fill in the blanks, and implement features we were planning to ship with the first compiler release. The work was more laid-out for us, we saw the goal we wanted to achieve.

* 2023 1st of January: README updates, find-all-references added for the Language Server
* 2023 2nd of January: Documentation comments, show documentation for symbols on hover in the Language Server

At this point we were also making efforts to retarget the compiler to .NET Standard 2.0, something we would eventually revert and stick to the latest .NET.

* 2023 7th of January: Tore out mutation testing, CIL codegen fixes
* 2023 11th of January: Out of process execution for the web editor, README updates, concept of error codes introduced
* 2023 13th of January: Icon theming for VS Code extension, web editor fixes, Language Server CLI introduction
* 2023 14th of January: Data flow analysis, crash fixes

With this addition, the compiler flow is finally 100% complete. Any more crash or unreported error has to be a bug in the compiler. We detect methods that don't return on all paths, variable usages before initialization, ...

At this stage, dataflow analysis is done on a dataflow graph that is constructed from the AST. This seemed as a great idea at the time, but due to multiple reasons, we will eventually replace it.

* 2023 15th of January: Code style fixes, `break` and `continue` labels introduced
* 2023 16th of January: .NET SDK integration, bugfixes, test suite extension, project templates, first toolset deployment

This is **HUGE**. We could finally have a project file with our source code and issue a `dotnet build` or `dotnet run`, just like with other languages. Users could install the project template from NuGet, then issue a `dotnet new console --language Draco` to create a Draco project. The SDK would be recognized and automatically downloaded by .NET. We finally felt like the compiler is a proper part of the ecosystem.

## To be like Roslyn <3
The next section is completely about filling in the blanks, expanding on what we have, improving code quality, and most importantly of all: get the architecture closer to Roslyn.

* 2023 19th of January: Language Server and VS Code extensions released, CI fixes
* 2023 20th of January: VS Code extension hotfix
* 2023 22nd of January: Floats added to codegen, codegen fixes, CI fixes
* 2023 29th of January: Web editor visual updates
* 2023 4th of February: Scientific notation for floats, formatter fixes
* 2023 5th of February: Rewrote Red-Green Tree generation to use XML, just like Roslyn, utility scripts added
* 2023 26th of February: Web editor UI overhaul
* 2023 27th of February: Web editor fixes
* 2023 19th of March: Getting started guide, source code reader API rework, ICE reporting
* 2023 25th of March: Complete internals rework

To this day, this is [one of the largest PRs merged](https://github.com/Draco-lang/Compiler/pull/199) in the project. It is a huge step towards the long-running intent to bring the architecture closer to Roslyn. We eliminated the query system, introduced the concept of binding, generate the bound tree, its visitors and rewriters from XML, exposed the `SemanticModel` in the API, ... This rework resulted in the structure that we more-or-less stuck with since then.

* 2023 29th of March: Syntax tree utilities
* 2023 30th of March: LSP reimplementation

As foreshadowed, choosing OmniSharp for the Language Server came back to haunt us. The implementation was outdated, overengineered, and overall [just a pain to work with](https://github.com/Draco-lang/Compiler/pull/217#issuecomment-1500973656). We decided to bite the bullet, and do the hard work. We reimplemented LSP as a reusable, extensible package that generated the contracts right from the specification. It is easy to use, update and extend with features we need. The only thing we did not implement ourselves was the JSON-RPC communication, we used [StreamJsonRpc](https://github.com/microsoft/vs-streamjsonrpc) for that - something, that we would regret later.

* 2023 2nd of April: Settings to turn inlay-hints on/off in the Language Server, `SemanticModel` fixes
* 2023 4th of April: Introduction of Fuzz testing
* 2023 5th of April: Refactoring in `SemanticModel`
* 2023 6th of April: Complete IR and CIL codegen rework, flow analysis rework, eliminating the need for dataflow graphs
* 2023 7th of April: Local functions support
* 2023 16th of April: Metadata imports

An _extremely_ exciting addition: we finally interact with the ecosystem! No longer do we need intrinsics to be able to print something, we can just reference `System.Console`! A sample taken from this era, showcasing interaction with the BCL:

```draco
import System.Console;
import System.Text;

func main() {
	var sb = StringBuilder();
	sb.Append("Hello, ");
	sb.Append(123);
	sb.Append(true);
	sb.Append(" - and bye!");
	Write(sb.ToString());
}
```

* 2023 18th of April: Web editor theming fixes
* 2023 20th of April: Semantic model rework, qualified type references, crash fixes

## Tooling? We got tooling!
At this point, the compiler architecture became stable - at least, there weren't major restructurings since then. We could finally focus on finishing the remaining language features, and more importantly, make the tooling nice to use.

* 2023 24th of April: Code completions in the Language Server

![image](https://github.com/Draco-lang/Compiler/assets/7904867/054dd820-da7a-4ad2-a8cf-9e6c565d0ebd)

This was a beautiful sight to see. While the initial implementation wasn't perfect, it already felt great that we didn't have to remember/type out every single name in a namespace.

* 2023 25th of April: Multiline string cutoff fix
* 2023 30th of April: Rework around overloading
* 2023 6th of May: Generate LSP messages from the metamodel instead of Markdown
* 2023 9th of May: Replace JSON-RPC with out own implementation under LSP, crash fix
* 2023 18th of May: Module system

This took a surprisingly long time, but it's finally here. The source code isn't a single file anymore. It can be split into multiple files, the code can be organized into submodules, just like in most other programming languages.

* 2023 21st of May: Basic generics implementation

This took quite a long time. It introduced many-many edges in the type-inference algorithm, which resulted in reworking the constraint solver behind it many-many times. Eventually we got there, and the reward was that a huge chunk of the BCL unlocked before us. Most excitingly, collections:

```draco
import System.Console;
import System.Collections.Generic;

public func main() {
	val s = Stack(); // Inferred to be Stack<int32> from use
    s.Push(1);
    s.Push(2);
    Write(s.Pop());
    Write(s.Pop());
}
```

* 2023 29th of May: .NET debugger developed, debugger TUI

We wanted to start working on the debugger experience, but there were a few problems: the debugger shipped by Microsoft was closed-source, and the [one by Samsung](https://github.com/Samsung/netcoredbg) was written in mostly C++. This sadly didn't suit our wishes, as we would have wanted an open-source and truly cross-platform debugger, written in .NET instead of native code. After a lot of research, we have developed a general-purpose .NET debugging API, that we can later use to develop our debugger. To test the API, we have written a TUI for it using the wonderful [Terminal.Gui](https://github.com/gui-cs/Terminal.Gui) library.

![image](https://github.com/Draco-lang/Compiler/assets/7904867/7cbd5a5d-c76b-4fde-b7b5-497818a6556a)

* 2023 3rd of June: Debug Adapter Protocol implementation and our own Debug Adapter

This time we didn't even bother with an existing protocol implementation. We used the same approach as for LSP, we generate messages right from the specification. The result was that we can finally debug from any editor that supports DAP.

* 2023 9th of June: LSP fixes, Language Server fixes
* 2023 11th of June: Loading more metadata members (properties, indexers, fields), debug adapter refactor, VS Code debugger integration refactor, PDB emission

## Threads, features, everything
At this point, we had a pretty nice toolset. We could edit and debug Draco code with decent support. While the language was really basic, we could use a decent chunk of the BCL already. We could finally focus on things like making the compiler thread-safe, fixing minor bugs, and adding language features that we have been missing for a long time. While the work seems less exciting or groundbreaking than before, there has been lots of important work done in this phase.

* 2023 15th of June: Initial thread-safety refactor
* 2023 18th of June: More threading fixes in the Language Server
* 2023 20th of June: More threading fixes in the core compiler
* 2023 22nd of June: Modules defined in-code
* 2023 24th of June: Arrays support
* 2023 27th of June: Variadic argument list support
* 2023 30th of June: Multidimensional arrays support
* 2023 16th of July: Codegen versioning tweaks
* 2023 17th of July: LSP touch-ups and fixes
* 2023 26th of July: First stage of the type-checker and solver rework, support for renaming in the Language Server
* 2023 29th of July: Intrinsic operations simplification
* 2023 2nd of August: Inheritance internals
* 2023 7th of August: Metadata work on nested structures
* 2023 8th of August: Primitive types merged with their metadata, double binding fix
* 2023 18th of August: Symbol lookup bugfix involving generics
* 2023 21st of August: A bunch of crashbug fixes

These bugs were discovered during one of my trips. I was on a train for 3 hours with a weak laptop and had the latest Draco SDK installed. I've decided to write a console-based Tic-Tac-Toe and discovered quite a few bugs that crashed the compiler.

* 2023 22nd of August: Crashbug fixes in the web editor
* 2023 26th of August: Foreach loops implemented

This wasn't only a long-awaited language feature, but the first thing we ever streamed on the [Draco Twitch channel](https://www.twitch.tv/dracolang)! Since then we try to stream some things semi-regularly, then update the VODs onto our [YouTube channel](https://www.youtube.com/@Draco-lang).

 * 2023 29th of August: Constraint solver rework around location info
 * 2023 2nd of September: Code cleanup, web editor cache invalidation
 * 2023 5th of September: Load documentation comments from metadata
 * 2023 15th of September: Misc. cleanup
 * 2023 19th of September: Basic benchmarking
 * 2023 28th of September: `TypeProvider` optimizations (significant compiler speedups), more benchmarks

## What does the future bring?
The first year of Draco compiler development was exciting! While the language itself is still fairly minimal, we achieved a lot in terms of compiler maturity and tooling. As of right now, we have a bunch of ongoing initiatives we need to wrap up:
 * Compiler optimizations, parallelization
 * Match expressions, pattern matching
 * Stackification for the IR
 * LSP message scheduling rework
 * Lots and lots of smaller things

With that said, there are ongoing efforts to finally specify and agree on [user-defined types](https://github.com/Draco-lang/Language-suggestions/issues/126). Once the specification is done, we will have plenty on our plates for the compiler.

I'm hoping that everyone who contributed or monitored the progress found the challenges we faced interesting. I'm hoping to see many of you in the future of Draco! Thank you so much everyone who contributed ideas, features or even kind words towards the project.