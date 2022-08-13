const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

const API_SEARCH_URL = "http://api.gbif.org/v1/grscicoll/collection";
const TEMPLATE = "Template file:";
const DESTINATION_DIR = "Destination folder:";

const FILENAME_FORMAT = "Filename format:";
const FILENAME_FORMAT_DEFAULT = "{{~code~}}({{~name~}})-{{~institutionName~}}";

const ILLEGAL_OBSIDIAN_FILE_NAME_PATTERN = /[\\,#%&\{\}\/*<>?$\'\":@]*/g;

module.exports = {
  entry: start,
  settings: {
    name: "GRSciColl",
    // author: "",
    options: {
      [FILENAME_FORMAT]: {
        type: "text",
        defaultValue: FILENAME_FORMAT_DEFAULT,
      },
      [TEMPLATE]: {
        type: "select",
        options: app.vault.getAbstractFileByPath('templates').children.map((t) => t.path),
      },
      [DESTINATION_DIR]: {
        type: "select",
        options: Object.keys(app.vault.fileMap).filter(function (filemapentry){return Object.keys(app.vault.fileMap[filemapentry]).includes('children')}),
      },
    },
  },
};

let QuickAdd;
let Settings;

function init(params, settings) {
  QuickAdd = params;
  Settings = settings;
}

async function start(params, settings) {
  QuickAdd = params;
  Settings = settings;

  var query = activeDocument.getSelection().toString();
  if (typeof query != "string"){
      query = null;
  }
  if (!query){
    query = await getQuery();
    query = query.searchTerms;
  }
  if (!query) {
    notice("No query entered.");
    throw new Error("No query entered.");
  }

  let possibleColls = await getCollectionsByQueryParams(query);
  let selectedColl = await promptUserForSelectingSuggestions(possibleColls);
  if (selectedColl){
    // Read in template as defined in settings:
    let template_file = app.vault.getAbstractFileByPath(Settings[TEMPLATE]);
    let template = await app.vault.read(template_file);
    // Apply template to coll object:
    let rendered = params.app.plugins.getPlugin('obsidian-handlebar-helper-plugin').compileAndRender(template,selectedColl);
    // Build filename and create file:
    filename_template = Settings[FILENAME_FORMAT];
    fileName = params.app.plugins.getPlugin('obsidian-handlebar-helper-plugin').compileAndRender(filename_template,selectedColl);
    fileName = Settings[DESTINATION_DIR] + '/' + fileName.replace(ILLEGAL_OBSIDIAN_FILE_NAME_PATTERN, "") + '.md';
    console.log(fileName);
    try{
      createdFile = await params.app.vault.create(fileName, rendered);
      if (createdFile){
        // Open it:
        leaf = params.app.workspace.getUnpinnedLeaf();
        await leaf.openFile(createdFile)  
      }
    }
    catch(Error){
      notice('Could not create file / already exists');
    }
  }
  else{
    notice("No collection selected");
    throw new Error("No collection selected.");
  }
}

function formatTitleForSuggestionList(resultItem) {
  var suggestion = `${resultItem.code} - ${resultItem.institutionName} (${resultItem.name})`;
  // if (resultItem.description){
  //   suggestion = suggestion + ` Description: ${resultItem.description}`
  // }
  // if (resultItem.geography){
  //   suggestion = suggestion + ` Geography: ${resultItem.geography}`
  // }
  // if (resultItem.taxonomicCoverage){
  //   suggestion = suggestion + ` Taxonomic coverage: ${resultItem.taxonomicCoverage}`
  // }
  return decodeEntity(suggestion);
}

function decodeEntity(inputStr) {
  var textarea = document.createElement("textarea");
  textarea.innerHTML = inputStr;
  return textarea.value;
}

async function getQuery(){
  return Promise.all([promptUserForSearchTerms()]).then(
    ([searchTerms]) =>
      new Promise((resolve, reject) => {
        if (!searchTerms) {
          notice("No query entered.");
          reject(new Error("No query entered."));
        }
        resolve({ searchTerms });
      })
  );
}
  
function promptUserForSearchTerms(){
  return QuickAdd.quickAddApi.inputPrompt("GRSciColl search terms:");
}

function promptUserForSelectingSuggestions(suggestions) {
  return new Promise((resolve, reject) => {
    QuickAdd.quickAddApi
      .suggester(suggestions.map(formatTitleForSuggestionList), suggestions)
      .then(async (selectedColl) => {
        if (!selectedColl) {
          notice("No choice selected.");
          reject(new Error("No choice selected."));
        }

        resolve(selectedColl);
      });
  });
}



/**
 *
 * @param {object} release The collection data from searching GRSciColl
 * @returns {Collection}
 */
function buildCollectionsData(collection) {
  return collection;
}

/**
 *
 * @param {object} queryParams
 * @throws Will throw Error if no collections are found
 * @returns {Collection[]} The collection results from searching for a collection
 */
async function getCollectionsByQueryParams(queryParams) {
  const searchResults = await fetchCollections(
    API_SEARCH_URL,
    queryParams
  );
  console.log(searchResults);
  if (!searchResults || !searchResults.length) {
    notice("No results found.");
    throw new Error("No results found.");
  }
  return searchResults.map(buildCollectionsData);
}

/**
 *
 * @param {object} queryParams
 * @returns {string} The query string for requests to grscicoll API.
 */
function buildQueryString(queryParam) {
  return queryParam;
}

/**
 *
 * @param {string} url
 * @param {object} queryParams
 * @returns {object[]}
 */
async function fetchCollections(url, queryParam) {
  let finalURL = new URL(url);
  if (queryParam) {
    finalURL.searchParams.append("q", buildQueryString(queryParam));
    finalURL.searchParams.append("masterSourceType", "IH");
  }
  console.log(finalURL);
  return JSON.parse(
    await request({
      url: finalURL.href,
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "ObsidianQuickAddMacro ( n.nicolson@kew.org )",
      },
    })
  )['results'];
}