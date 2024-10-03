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