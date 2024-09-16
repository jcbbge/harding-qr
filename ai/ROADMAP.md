## This project is a personal portfolio/website. Initially, this was intended to be a professional updated and maintained website for me as I transition from a developer to Product Management. But a website doesn’t have to be a brochure that compartmentalizes one's infinite self — into three glossy pages. I'm more interested in “website as a digital garden-home-world”, so this is an exploration:

- the ethos and intention to sell / show / prove / substantiate — versus the intention to exist, inhabit, and be
- how brochure-like websites compartmentalize and limit the self into a marketing “niche”
- on building a nourishing garden-world to hold the multi-dimensional, expansive creative self — and invites visitors to linger
  -why building a rich digital world to share your creative wealth is the key to inviting in prosperity

Currently, my website is built around the idea of interactive gameplay. I need other ideas to build out to further the explored topics but as of right now:

Active Goals:

- create a Scrumble Word Game that can be loaded on each page

Refactor Goals:

- Consider using createMemo for complex computations that are used in the render function, such as emptyIndexInGrid.
- The updateLetterBox function is quite long and complex. Consider breaking it down into smaller, more focused functions for better maintainability.
- Instead of using setTimeout for playing sounds after state updates, consider using Solid.js's createEffect to react to state changes and play sounds accordingly.
- The getIconImg function could be memoized if it's called frequently with the same arguments.
- Consider using Solid.js's batch function when making multiple related state updates to optimize performance.
- Overall, the component follows Solid.js conventions well, but there's always room for further optimization and refinement.

Stretch Goals:

- add party kit for visitors to have live interactions while visiting my site.
- add a blog page

## Session Summary (2024-09-15, 09:06)

Start of Session
Task Overview:

- [ ] Re-wire functionality for Settings letterboxes
  - [ ] can display settings icons for Theme, Mode, and Patter
  - [ ] can update Theme, change Mode, and pick Pattern
  - [ ] does save to localstorage
- [ ] Add tests for Settings
  - [ ] each setting is laid out in grid space. Theme first, Mode second, Pattern third
  - [ ] select options are cycled through with upward and downward nav
  - [ ] settings change and update on Return key and Space bar
        ...

## Session Summary (2024-09-15, 20:13)
## Session Updated (2024-09-15, 09:06)
Task Overview:
- [ ] Re-wire functionality for Settings letterboxes
  - [ ] can display settings icons for Theme, Mode, and Patter
  - [ ] can update Theme, change Mode, and pick Pattern
...


## End of Session Updates
Task Overview:
- [x] Re-wire functionality for Settings letterboxes
  - [x] can display settings icons for Theme, Mode, and Patter
  - [x] can update Theme, change Mode, and pick Pattern
  - [x] does save to localstorage
- [ ] Add tests for Settings
  - [ ] each setting is laid out in grid space. Theme first, Mode second, Pattern third
  - [ ] select options are cycled through with upward and downward nav
  - [ ] settings change and update on Return key and Space bar
 ...

## Session Summary (2024-09-16, 09:42)
Start of Session
Task Overview:
- [x] Re-wire functionality for Settings letterboxes
  - [x] can display settings icons for Theme, Mode, and Patter
  - [x] can update Theme, change Mode, and pick Pattern
  - [x] does save to localstorage
- [ ] Add tests for Settings
  - [ ] each setting is laid out in grid space. Theme first, Mode second, Pattern third
  - [ ] select options are cycled through with upward and downward nav
  - [ ] settings change and update on Return key and Space bar
- [ ] Bug fix for changeing letterbox
 ...
