It's been a year since our last blog post, so it's time for another retrospective to see what we managed to achieve in a year. The year had its ups and downs, people getting interested and disinterested in the project, phases of burnout, but we managed to put together enough progress to justify a blogpost about it.

## Right after the first birthday

With motivations still high, we jumped right back into working on the compiler.

- 2023 13th of October: Stackification complete in the code-generation backend

This was a very important step that made the generated IL code much more tidy. The intermediate representation we translate to is register-based, but then we have to translate that to the stack-based MSIL code. Originally we took the lazy approach here and allocated a lot of local variables, only using the stack to move in and out of these local "registers".

**TODO: Show example of this, have screenshots, add some explanation and source for the algorithm**

- 2023 17th of October: Support for type-aliases in the compiler

This feature isn't really exposed to the end-user to this day, but could be in the future, if we decide to. Currently, this is used to alias well-known primitive types from the standard library, so the user can type `int32` instead of `System.Int32` for example.

- 2023 21st of October: LSP and DAP communication refactor
- 2023 27th of October: Crashbuf fix for LSP cancellation
- 2023 29th of October: Formatter rework, diagnostic bag fixes, character literals
- 2023 22nd of November: PowerShell script fixes

After a bunch of fixes we added a small feature that we were missing all along, character literals! They are not too unsimilar to the C# character literals. The only major difference would be the Unicode codepoint escape sequence, which is in the format `'\u{123ABC}'`, just like in Draco string literals.

## To cut down the tree

Internally, we had 3 major tree representations in the compiler:
 1. The syntax tree. This is pretty self-explanitory, directly contains the parsed source code without throwing out any detail from it. Even comments and whitespaces are stored as trivia around the tokens.
 2. The untyped tree. The reason for this will be explained below, but a slight hint: Roslyn does not need this and we only need this because of the amount of type-inference we do.
 3. The bound tree. This is essentially the abstract syntax tree, with known types and resolved symbols. The flow analysis, lowering and code generation can work off of this tree.

So what's up with that untyped tree? Since we do full function-local type inference, we can't always know in a single pass, what kind of node to construct or what the type of something is. For example, looking at the following Draco code:

```swift
func main() {
    // assuming the existence of a func default<T>(): T
    val x = default();
    val y = x.Successor();
    x = 5;
}
```

Initially, the type of `x` is unknown. When trying to look at the next line, we call a method called `Successor()` on it, we have no way to resolve, until we have more information about the type. The bound tree would expect to know all the symbols and types at this point, so we can't create a bound tree from this right away. This is why we introduced an awkward in-between state, something more abstract than the syntax tree, but with less type and symbolic information than the bound tree.

This caused plenty of pain-points around type checking. For example, the rough flow of checking, if a `for` loop is type-safe and valid, is the following.

 1. Check what the type of the iterated collection is, call it `TCollection`
 2. Check, if `TCollection` has a method called `GetEnumerator()`, which returns a type `TEnumerator`
 3. Check, if `TEnumerator` has a method called `MoveNext()`, which returns a `bool`
 4. Check, if `TEnumerator` has a property called `Current`, which returns a type `TElement`
 5. Check, if `Telement` is assignable to the type of the loop variable, in case it's explicitly typed

Imagine, that we could not infer the exact type of the collection yet. How do we check if it has a method called `GetEnumerator()`? We can't! The solution? Introducing various kinds of sentinel, delay and placeholder nodes in the untyped tree, with the sole purpose of pushing back the check, evaluation or node construction to the point, where we have more information available from future code. With this mentality, the untyped tree basically became an incomplete copy of the bound tree, with node such as `UntypedLocalExpression` or `UntypedDelayedExpression`.

This caused multiple maintainability issues. First off, binding had to be written essentially twice. Once when translating the syntax tree to untyped trees, and then the untyped trees to bound trees - with the constraint solver invoked in between for more type information. Second, the code became multiply nested with callbacks. It was not uncommon to see this:

```cs
var sequenceExpr = new UntypedDelayedExpression(sequence.Type, () =>
{
    var memberConstraint = constraintSolver.MemberConstraint(sequence.Type, "GetEnumerator");
    return new UntypedDelayedExpression(memberConstraint, () =>
    {
        // ...
    });
});
```

And finally, if we ever had to do type-checks on a node, we had to take into account that it could be one of the placeholders or delays anytime, and had to wrap that logic itself into a delay node to deal with this.

If you have ever seen [asynchronous JavaScript code](https://www.stoman.me/articles/async-await-promises-callbacks-in-javascript) before async/await, you might get a very familiar feeling. This is the exact same problem! When we don't know something yet, it would be awesome to suspend the evaluation of the current node, continue binding other nodes, or even evaluate some constraints in the constraint solver. I told this to [Kuinox](https://github.com/Kuinox/), who immediately got to work, and not even an hour later presented the prototype: binding tasks, that work exactly like JavaScript async callbacks.

We started reworking the binding to use async/await with these tasks, binding the syntax tree and immediately constructing a bound tree, skipping the untyped tree entirely. The work was quite nerve wracking, as I had no idea if this was gonna work how I imagined it, if we'd hit an impossible edge-case we didn't account for and all the work was for nothing. After a month of hard work, probably [one of my favorite PRs](https://github.com/Draco-lang/Compiler/pull/344) got merged on the 28th of November. It async-ified our binding logic and got rid of:
 * All of the untyped tree
 * All of the logic needed to bridge the untyped tree to the bound tree
 * Lots of nesting complexity
 * Lots of node-type checks in the binder code

This was one of the biggest tech-debt we were carrying for quite a while and made introducing and debugging features quite painful, and now it's gone. The async-ified version turned out better than what I could have ever imagined.

## A depressing end and start of the year

The project hit one of its biggest inactive gaps yet. To keep personal matters short, I was feeling quite burnt-out on working on personal projects next to a full-time .NET developer job. I needed to find other hobbies to mentally recharge and re-gather my motivation for the project. During this time, Kuinox stepped in again and carried the project on his shoulders to not let it get abandoned. I'm infinitely grateful for everyone who contributed during this time and special thanks to him for holding it out as long as I needed time.

- 2023 28th of November: Additional utility PowerShell scripts
- 2023 5th of December: Fix a bug with spaces in paths in the SDK integration
- 2023 14th of December: Publishing the Language Server Protocol and Debug Adapter protocol implementations to NuGet (people wanted to use our implementations!)
- 2023 16th of December: Cleanup around the symbol hierarchy
- 2023 22nd of December: CI workflow updates to the playground
- 2024 21st of January: PowerShell utility script improvements, bug fix in the language server to update a freshly opened document
- 2024 23rd of January: Playground build script improvement, merking well-known types and intrinsic symbols

This last one might deserve a few words of explanation. Almost all compilers will have a set of intrinsic symbols that the compiler needs to know about. Primitives, all the built-in operations, the base type for all objects, known types of certain operations - like `System.Type` from `typeof(T)` - and so on. So far, we have represented these builtin types separately from the ones living in `System`, so for example, `int32` was actually a different type from `System.Int32`. This PR merged the two and got rid of a lot of ugly edge cases.

- 2024 24th of January: Better error reporting for cases where the well-known primitives can't be located, formatter bugfixes, report error when import declarations are qualified with a visibility modifier
- 2024 25th of January: Utility script fix
- 2024 27th of January: Reworked IO workers in the debugger which fixes a bug
- 2024 30th of January: Variance cleanup for symbol hierarchy
- 2024 31st of January: Publish JsonRpc as a package - which was missing to be able to actually reuse the LSP and DAP implementations
- 2024 7th of February: Upgrade to .NET 8
- 2024 11th of February: Fixes on the Playground
- 2024 18th of February: Basic debugger tests, debugger tracing for VS Code extension
- 2024 23rd of February: Loading operators from metadata

Until this point the language could not use any operators that were custom defined for a type. We needed to improve the lookup code to allow looking into both operand types for the given operator - in addition to intrinsicly defined operators - and allow either of the lookups and resolutions to fail.

- 2024 25th of February: Multithreading improvements, debugger bugfixes
- 2024 1st of May: Reworked how registers get allocated for intrinsic methods, fixes a bug
- 2024 1st of June: Lexer bugfixes
- 2024 3rd of June: Removed stryker, as it wasn't really utilized

## Less debt, more stability

After a lengthy break with very few commits from me, I felt motivated again to jump back into working on the language and the compiler. I am generally very happy with spending time on other things I've found joy in, and in the long term made me appreciate this project even more. I've decided that I'd like to focus on improving code quality, traceability and fix crashbugs in general. The next section will contain mostly that, with occasional features sprinkled in.

- 2024 3rd of June: Migrated the Playground into a separate repository, as the compiler has a stable enough API at this point - it also got rid of the brittle JS toolchain needed to build the Playground, which was part of the solution
- 2024 8th of July: General codebase cleanup, utilizing .NET 8 features like primary constructors
- 2024 13th of July: Basic project system, LSP convenience methods

Until now, the language server always assumed that a Draco project only uses the .NET BCL and did not resolve package references defined in the projectfile. The essence of the problem is locating the DLLs on the users machine for the BCL and downloaded NuGet packages. Until now, we used a package called [Basic.Reference.Assemblies](https://www.nuget.org/packages/Basic.Reference.Assemblies/) in the language server that kept the .NET BCL in memory. This did not only not look for package references, but also locked us into the .NET version shipped with the package.

The solution was something called [design-time builds](https://github.com/dotnet/project-system/blob/main/docs/design-time-builds.md). After learning about them, we wrote a basic project system implementation that is able to perform a design-time build, which does things like restore and collects all the parameters that would be passed into the compiler, but does not actually invoke compilation. This allowed us to read out the metadata reference locations from the users machine, and finally get rid of the ugly hack of shipping the entire BCL metadata with the language server. Excitingly, we could finally see code suggestions for 3rd party packages for the first time in the language server!

- 2024 14th of July: CHR solver library

This has been long in the backburner. We have discussed before, how the current constraint solver for the type system is kind of hard to trace and reason about, and some uniform formalization could improve it drastically. [Constraint Handling Rules](https://en.wikipedia.org/wiki/Constraint_Handling_Rules) came up in my mind from my university days, and we decided to write a library that implements a .NET-hosted CHR solver. The compiler did not utilize CHR yet, but the library was merged into the repository for future use.

- 2024 16th of July: Refactor overload resolution
- 2024 17th of July: Passing down the cancellation token in the entire flow of the LSP/DAP implementations
- 2024 20th of July: Cancellation support for language client in LSP
- 2024 25th of July: Ship a few example programs with the compiler
- 2024 29th of July: Updates to the readme, it's been long obsolete
- 2024 5th of August: Rework the type system to use the CHR solver, default value intrinsic function

The solver we wrote a while back finally passed all of our regression testing, when integrated into the type system. This brought along things like better traceability, something that helped us trace down quite a few bugs.

**TODO: show example of visual trace, explain**

- 2024 12th of August: Type system and overload resolution bugfixes
- 2024 13th of August: Language server fixes, inlay hints for generics
- 2024 15th of August: Basic delegates

Until now, the language didn't have any kinf od first-class function support. This update brought in the most basic version of delegates, which can be stored in `System.Action` and `System.Func` types. There are still no lambdas or closures in the language, but named functions can be passed around as delegates now.

- 2024 20th of August: Internal API simplifications, crashfixes, separated string escape sequences as separate tokens in string literals
- 2024 21st of August: Range-Span API cleanup for the syntax tree, introduced a REPL

While my main focus was improvements, I've been finding myself using tools like [csharprepl](https://github.com/waf/CSharpRepl) more and more, so I really wanted to implement a REPL for Draco. After a little prototyping, the base REPL was working and can be installed with `dotnet tool install -g dracorepl`.

- 2024 22nd of August: REPL bugfixes, syntax highlighter service in the compiler, [PrettyPrompt](https://github.com/waf/PrettyPrompt) integration for the REPL, compiler concurrency bugfix, debugger bugfixes, project system bugfixes (busy day, huh)
