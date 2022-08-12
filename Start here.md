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

If you swap into edit mode (using <kbd>Ctrl</kbd> + <kbd>E</kbd>), you'll see that the IPNI name page has some structured data at the top of the page, including:
-  a persistent identifier for the name object represented by the page. 
-  a persistent identifier for journal article in which the name was published 
- aliases to help propose links between pages - here we have the abbreviated form of the species name (where the genus name is abbreviated to its initial letter)

We can use these to connect more resources and propose links.

>[!tip]- Frontmatter
> See more about frontmatter in the [Obsidian help pages](https://help.obsidian.md/Advanced+topics/YAML+front+matter)

Note: if you select to add a name from IPNI that is a combination - the linked basionym record will also be added and the two name pages will be linked together. (Making this work in the other direction, from a basionym to potentially multiple later combinations, is [planned but not yet implemented](https://github.com/echinopscis/echinopscis-quickadd/issues/7))

## Shortcuts - using highlighted text to search
As well as selecting the quickadd command via the command palette and then typing in a name - you can also highlight some text, then when you select the IPNI command, this will be passed into the search function so you don't have to retype it. This "search using highlighted text" function is available for each of the biodiversity informatics quickadd scripts in the sample vault, i.e. names (from IPNI), specimens (GBIF-mediated occurrences), person profiles (from Bionomia), collections (from GRSciColl) and literature (from Crossref).

## Literature

We can use the DOI associated with an IPNI record to retrieve metadata about the containing article in which the nomenclatural act was published, using a quickadd script that accesses [crossref](https://crossref.org). This is available through the command palette, by searching for "crossref".
It will first try to use the DOI from the frontmatter, but you can also choose to enter search terms (either a DOI or keywords from the title and authors etc). As described above, you can also highlight text and search for it in crossref. If you select an article, a new page is added, and its tagged as a reference.

## Specimens
One thing an author does when publishing a new plant name is to cite the type specimens that they have selected. Many specimens are now digitised and available in GBIF so we will next search for the specimens using the collector name and number. This is available in the IPNI record, so we can highlight the text and use it as our search term. 

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


## Connecting external tools

Obsidian has a [custom URL protocol](https://help.obsidian.md/Advanced+topics/Using+obsidian+URI) which can be used to connect web browsers and spreadsheets to post data into obsidian. This means that you can clip web content  (complete pages or highlighted sections of text) and send these to a new page in Obsidian. In a spreadsheet (or Open Refine), you can add a link to each row that will create or open an associated page in Obsidian. This could be useful to integrate tabular data (eg a datafile of specimens) with your working notes on their descriptions (in Obsidian).

### Reference managers
We've used a script to access data from the crossref API, but Obsidian can also be configured to connect to your reference manager using the "[citations](https://github.com/hans/obsidian-citation-plugin)" plugin. This reads a file of bibliographic data and allows you to create a note-taking page based on a scholarly work, and to embed references in your writing (these are the functions that we are seeking to replicate when working with specimens).

## Visualisations

### Spatial

This vault has a mapping plugin enabled, which can read location coordinates from the frontmatter of pages, and use them to plot points on a map. Open the [[Map]] page to see a map with the collecting event coordinates plotted on it. The markers are active so that clicking on a marker will open the associated page.

### Graph (network visualisation)

In this example, we've created a small set of pages and established links between them. A graph view can be used to visualise the web of connections. You can open the graph view in one of three ways, by using either:

1. The graph icon in the left hand "ribbon"
2. The key combination <kbd>Ctrl</kbd> + <kbd>G</kbd>
3. The command palette, by searching for "graph" and selecting "open graph view"


## Applications

### Taxonomic research
If you are researching specimens, this kind of workflow may be useful to indicate conspecificity between specimens, and to see where the type specimens are located as you describe and group specimens (remember that types and potential species groups can be distinguished using tagging and linking). 

### Contributing to the "digital extended specimen"

We've seen that this software toolkit simplifies the access and linking of specimen related resources.
We think that this could contribute to the digital extended specimen effort in two ways: firstly, a greater awareness of how resources can be explored when they are linked should help embed the concept and gain community support. On a more practical level, the actual links made - in context, by expert researchers - could be useful to help integrate data and form the connections necessary to realise the digital extended specimen.

## Roadmap

You can read about the phases of work that we would like to follow at: https://echinopscis.github.io/roadmap/

## Other resources
You can find a list of useful resources from users and developers of Obsidian at: https://echinopscis.github.io/roadmap/
## Contributing

We're interested in all kinds of contributions (not just technical ones) - see some suggestions at: https://echinopscis.github.io/contributing/

If you spot any errors or inconsistencies in this example demonstration, then please do let us know, preferably by raising an issue on github at: https://github.com/echinopscis/echinopscis-sample-vault/issues
