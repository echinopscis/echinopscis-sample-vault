## Welcome

This is the sample [[Glossary#Vault|vault]] for "echinopscis" - an experiment in creating an extensible notebook for open science.

These instructions are a [[Glossary#Page|page]] in Obsidian, formatted in Markdown and located on your local computer. You can edit this page - toggle between view and edit mode using <kbd>Ctrl</kbd>+<kbd>E</kbd>. 

By default these instructions are "pinned" so that they will always be visible as we create new pages. Any new pages that you create or open by navigating a link will open in a separate pane to the right.

## About this demonstration

This vault has been configured with some tools which enable easy access, linking and visualisation of biodiversity informatics data. 

The rest of this page gives a worked example of how to use these. Occasionally, some extra information about Obsidian and pointers to the Obsidian documentation has been included in this page in "tip" sections. These look like this - if you click on the coloured bar the contents will unroll.

>[!tip]- Tips and extra information about Obsidian
>These tip boxes explain Obsidian concepts and show links to the main [Obsidian help pages](https://help.obsidian.md).

Functions are available via the command palette in Obsidian - a searchable list of the functions of the system.

>[!tip]- Command palette
>Functions in Obsidian can be accessed through a searchable command palette - this is accessible using the key combination <kbd>Ctrl</kbd>+<kbd>P</kbd>
>Read more about the command palette in its [Obsidian help page](https://help.obsidian.md/Plugins/Command+palette)


## Names
Lets say that your research starts with a published plant name:

1. Open the command palette using the key combination <kbd>Ctrl</kbd>+<kbd>P</kbd> and search for the IPNI plugin by typing "IPNI". Select it by hitting return.
2. Type in a plant name - eg "Solanum aspersum"
3. Select an entry from the list of IPNI matches shown

The system will create a new page in your vault, holding the details of the plant name from IPNI. You'll notice that the page has a tag [\#name)](obsidian://search?query=\#name) to indicate its contents. Remember that Obsidian is primarily a note-taking environment, so you can annotate this page, or use it as a reference in your work - much as you would use a citation in your reference manager when writing.

If you swap into edit mode (using <kbd>Ctrl</kbd> + <kbd>E</kbd>), you'll see that the IPNI name page has some structured data at the top of the page, including a persistent identifier for the object represented by the page. All pages can hold this "frontmatter", and in this worked example we will use these values later when other plugins and processes read the data (eg to display on a map). One useful way to use frontmatter is to establish "aliases" - you'll see that the name page that you have just created has a list of aliases, including the abbreviated form of the species name (where the genus name is abbreviated to its initial letter). This will help the system propose links as you enter more content into the vault.

>[!tip]- Frontmatter
> See more about frontmatter in the [Obsidian help pages](https://help.obsidian.md/Advanced+topics/YAML+front+matter)


If you select to add a name from IPNI that is a combination - the linked basionym record will also be added and the two name pages will be linked together. 

As well as selecting the quickadd command via the command palette and then typing in a name - you can also highlight some text, then when you select the IPNI command, this will be passed into the search function so you don't have to retype it. This "search using highlighted text" function is available for each of the four biodiversity informatics quickadd scripts in the sample vault, i.e. names (from IPNI), specimens (GBIF-mediated occurrences), person profiles (from Bionomia) and collections (from GRSciColl).

## Specimens
One thing an author does when publishing a new plant name is to cite the type specimens that they have selected. Many specimens are now digitised and available in GBIF so we will next search for the specimens using the collector name and number:

1. Open the command palette using the key combination <kbd>Ctrl</kbd>+<kbd>P</kbd> and search for the GBIF occurrence plugin by typing "GBIF". Select it by hitting return.
2. Type in an occurrence search, e.g. "Cuatrecasas 11471"
3. Select an entry from the list of GBIF occurrences shown

Again, the system will create a new page in your vault, holding the details of the specimen as mobilised through GBIF. If an image is available, this will be shown with zoom / pan functions etc. 

>[!tip]- Backlinks
>Obsidian tries to facilitate linking by showing you what links to your current page ("backlinks"). These can be seen in the right hand pane (the backlink pane can be shown using the command palette - hit <kbd>Ctrl</kbd>+<kbd>P</kbd> and type "backlink", then select "Show backlinks pane"). As well as actual links, the system will also propose links, eg if it finds the title text of your current page embedded in another page's content. 

## People (authors, collectors, determiners etc)

The previous steps have added a name and a specimen. These entities were both created by people, performing different roles:

- an author of a nomenclatural act
- a collector of specimen material
- a determiner (or identifier) of specimen material

This vault has a plugin to search for person profiles in Bionomia:

1. Open the command palette using the key combination <kbd>Ctrl</kbd>+<kbd>P</kbd> and search for the Bionomia plugin by typing "Bionomia". Select it by hitting return.
2. Type in a part of a person name eg: "Cuatrecasas"
3. Select an entry from the list of Bionomia profiles shown

As in the previous steps, the system will create a new page in your vault, holding the details of the person as read from Bionomia. 

## Institutions

Institutions hold specimens and employ people, so we can also search for relevant institutions from the Global Registry of Scientific Collections (GRSciColl). As before:

1. Open the command palette using the key combination <kbd>Ctrl</kbd>+<kbd>P</kbd> and search for the GRSciColl plugin by typing "GRSciColl". Select it by hitting return.
2. Type in an institution name or code eg: "US"
3. Select an entry from the list of institutional profiles shown


## Citations

Obsidian is a notetaking and writing environment, so it has a few plugins which facilitate the use of bibliographic references. This sample vault has been set up with the "citations" plugin, which reads a file of bibliographic data and allows you to create a note-taking page based on a scholarly work, and to embed references in your writing (these are the functions that we are seeking to replicate when working with specimens).


## Term definitions

Species descriptions use precise language and a whole set of technical terms. This sample vault has a term dictionary that can be used to give definitions. To view a term definition, highlight a term - e.g. "spinose", right click and select "look up" - a definition pane will open on the right hand side of the screen.

## Adding content from external tools

### Web
You can set up your web browser to clip web content (complete pages or highlighted sections of text) and send these to a new page in Obsidian.

To try it out:
1. Open your web browser and ensure that the bookmark toolbar is visible
2. Open this page: https://echinopscis.github.io/installation/
3. Locate the "Send to Obsidian" link in step 5 and drag it to your browser toolbar
4. Click it - you should get a new page added in your vault.

### Spreadsheet format data
Its also possible to add a link to each row in a spreadsheet (or Open Refine) that will create or open an associated page in Obsidian. This could be useful to integrate tabular data (eg a datafile of specimens) with your working notes on their descriptions (in Obsidian).

>[!tip]- Custom URI protocol "obsidian://"
>Both the web clipper and spreadsheet integration make use of Obsidian's [custom URL protocol](https://help.obsidian.md/Advanced+topics/Using+obsidian+URI)

## Linking
tbc

## Visualisations

### Spatial

This vault has a mapping plugin enabled, which can read location coordinates from the frontmatter of pages, and use them to plot points on a map. Open the [[Map]] page to see a map with the collecting event coordinates plotted on it. The markers are active so that clicking on a marker will open the associated page.

### Network

In this example, we've created a small set of pages and established links between them. A graph view can be used to visualise the web of connections. You can open the graph view in one of three ways, by using either:

1. The graph icon in the left hand "ribbon"
2. The key combination <kbd>Ctrl</kbd> + <kbd>G</kbd>
3. The command palette, by searching for "graph" and selecting "open graph view"


## Applications

### Taxonomic research
If you are researching specimens, this kind of workflow may be useful to indicate conspecificity between specimens, and to see where the type specimens are located as you describe and group specimens (remember that types and potential species groups can be distinguished using tagging and linking). 

### Contributing to the "digital extended specimen"
TBC

## Roadmap
See https://echinopscis.github.io/roadmap/

## Contributing
See https://echinopscis.github.io/contributing/
