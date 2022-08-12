## Vault
A *vault* is a project (or workspace) in Obsidian. You can create multiple vaults, each with their own configuration and set of plugins.

---

## Page
A *page* is the unit of an Obsidian vault, and is simply a text file on your computer's file system. You can view the file for the current page in your computer's file explorer by using "Show in system explorer" - this is accessible from the context menu for each page (click the three vertical dots in the page's title bar), by right clicking a file in the folder view in the left hand pane, or via the command palette (open using <kbd>Ctrl</kbd>+<kbd>P</kbd> and search for "system").

---

## Folder
Just like in your computer's file system, folders are used to arrange files into a hierarchy. When searching, you can create search terms regarding a page's position in its containing folder(s), as well as the attributes and content of the page itself.

---

## Tag
Traditionally we have grouped related resources using a hierarchical file system structure, tags allow us to group resources wherever they are in a structure.
Tags themselves can be hierarchical, eg when tagging specimens we can use this kind of hierarchy:
- \#type
- \#type/HOLOTYPE
- \#type/ISOTYPE

All templates in this sample vault place any tags at the foot of the page.

---

## Link

Two kinds of link are possible in Obsidian:
1. A link to another page in the vault - these are surrounded by double square braces - e.g. [[Start here]]
1. A markdown link to a web resource - these first specify the link text in square braces, then the link destination in round brackets, e.g. [Obsidian](https://obsidian.md)

---

## Outgoing links
Out-going links are the links that have been established in your current page - or those that could be established (see [[Glossary#Link proposal]].
You can open the outgoing links pane using the command palette: hit <kbd>Ctrl</kbd>+<kbd>P</kbd> and type "outgoing", then select "Show outgoing links pane". The destinations can be filtered using search syntax. 

---

## Backlinks
Backlinks the opposite of out-going links, they show you "what links here" and are useful to see the connections between the different parts of your research. For example if you have pages representing concepts, then backlinks will show you all the pages that link to your current page. You can open the backlink pane using the command palette: hit <kbd>Ctrl</kbd>+<kbd>P</kbd> and type "backlink", then select "Show backlinks pane". The sources of backlinks can be filtered using search syntax. 

---

## Link proposal
The Obsidian interfaces tries to facilitate linking between the pages in your vault. When you are viewing the outgoing links or backlinks panes, you will see that they are grouped into two categories:
- **Linked mentions** - an explicit link was detected
- **Unlinked mentions** - text was found in the page which matches the title or alias of a page in your vault - these can be converted into explicit links by clicking the "link" button

---


## Graph

Once pages have been linked, the links between them can be visualised in a graph, and this can be used to understand how topics group together, and to navigate between pages.
Two kinds of graph view are possible:
- The **default** (available from "open graph view") shows the complete contents of the vault
- A **local graph view** is available from each page - showing the connections to and from the current page. This sample vault has set up a local graph view in the right hand pane, this is updated each time you change page or add a new link.

---

## Plugin

Obsidian is designed to be extensible, and plugins can be installed to add new functions. These are differentiated into:
- **Core plugins**, distributed by the Obsidian team
- **Community plugins**, developed by third parties (like the biodiversity informatics data access scripts in this vault)
