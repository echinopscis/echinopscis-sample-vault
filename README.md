# echinopscis-sample-vault
A sample [obsidian](https://obsidian.md) vault, preconfigured for biodiversity informatics

## How to use

See: https://echinopscis.github.io/installation/

## Contents

Contains the following plugins:

|Function |Plugin / script | Dependencies |
|-|-|-|
|Scripted access to remote resources |[QuickAdd](https://github.com/chhoumann/quickadd)| |
|Data access - botanical names | [IPNI](#ipni-names) | [QuickAdd](https://github.com/chhoumann/quickadd), [handlebar-helper](https://github.com/echinopscis/obsidian-handlebar-helper-plugin) |
|Data access - specimen occurrences | [GBIF](#gbif-mediated-occurrences) | [QuickAdd](https://github.com/chhoumann/quickadd), [handlebar-helper](https://github.com/echinopscis/obsidian-handlebar-helper-plugin) |
|Data access - people | [Bionomia](#bionomia-profiles) | [QuickAdd](https://github.com/chhoumann/quickadd), [handlebar-helper](https://github.com/echinopscis/obsidian-handlebar-helper-plugin) |
|Data access - institutions | [Global Registry of Scientific Collections](#global-registry-of-scientific-collections) | [QuickAdd](https://github.com/chhoumann/quickadd), [handlebar-helper](https://github.com/echinopscis/obsidian-handlebar-helper-plugin) |
|Data access - literature | [Crossref](#crossref-literature) | [QuickAdd](https://github.com/chhoumann/quickadd), [handlebar-helper](https://github.com/echinopscis/obsidian-handlebar-helper-plugin) |
|Visualisation - spatial | [Leaflet](https://github.com/valentine195/obsidian-leaflet-plugin) | [Dataview](https://github.com/blacksmithgu/obsidian-dataview) |
|Utility - templating | [handlebar-helper](https://github.com/echinopscis/obsidian-handlebar-helper-plugin) | |
|Utility - data querying | [Dataview](https://github.com/blacksmithgu/obsidian-dataview)| |
|User interface - folder differentiation | [Icon folder](https://github.com/FlorianWoelki/obsidian-icon-folder) |[Remix icons](https://remixicon.com/) |

### QuickAdd scripts

These [QuickAdd](https://github.com/chhoumann/quickadd) scripts access frequently used biodiversity informatics resources to create representative pages in an [Obsidian](https://obsidian.md) vault, so that the user can:
- *annotate* them with their own notes
- *link* them together and *explore* connections
- *cite* them as references in research outputs like taxonomic treatments and articles

#### Dependencies

The following Obsidian plugins are required in order to use these scripts:

- [QuickAdd](https://github.com/chhoumann/quickadd)
- [Handlebar helper](https://github.com/echinopscis/obsidian-handlebar-helper-plugin)

#### Structure

Each quickadd script consists of two parts - a data access script and a template which is used to format the structured data response into an Obsidian page.

A data access script generally has the following configuration options:

1. Filename format (using a handlebarsjs snippet)
1. Template
1. Folder in which to place newly created files

A data access script generally follows these steps:

1. Detect if the currrent page has selected text, if so use this as the search term
1. If no selected text detected, show an input box for search terms
1. Translate search terms to an API call to a remote data resource
1. Present the user with a set of matching records, so that they can select one
1. Format the selected record using the template, and open the new page

The template is written using handlebarsjs, and the [handlebar helper](https://github.com/echinopscis/obsidian-handlebar-helper-plugin) is required to process the template. The call to process the template is made in the data access script.

#### Data resources

##### GBIF mediated occurrences

- Script: [scripts/gbif.js](scripts/gbifocc.js)
- Template: [templates/gbif.md](templates/gbifocc.md)
- Notes: Configuration options control the interpretation of search terms - eg the user can opt to treat any numeric search terms as record numbers (to facilitate searching for botanical specimens).  

##### IPNI names

- Script: [scripts/ipni.js](scripts/ipni.js)
- Template: [templates/ipni.md](templates/ipni.md)
- Notes: Configuration options allow the user to specify if a page for the basionym should also be created, if the selected name is a combination. 

##### Global Registry of Scientific Collections

- Script: [scripts/grscicoll.js](scripts/grscicoll.js)
- Template: [templates/grscicoll.md](templates/grscicoll.md)

##### Bionomia profiles

- Script: [scripts/bionomia.js](scripts/bionomia.js)
- Template: [templates/bionomia.md](templates/bionomia.md)

##### Crossref literature

- Script: [scripts/crossref.js](scripts/crossref.js)
- Template: [templates/crossref.md](templates/crossref.md)
- Notes: The script will try to detect a DOI from the frontmatter of the current file, if one is found the script will ask the user to verify that it should be used. Otherwise the user can enter search terms (author, title keywords, year etc).

## Contributing

Comments are welcome - please use the github issue tracker associated with this project: [echinopscis/echinopscis-sample-vault/issues](https://github.com/echinopscis/echinopscis-sample-vault/issues)
