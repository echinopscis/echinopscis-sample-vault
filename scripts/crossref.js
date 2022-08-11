const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

const API_URL = "https://api.crossref.org/v1/works";
const TEMPLATE = "Template file:";
const DESTINATION_DIR = "Destination folder:";

const FILENAME_FORMAT = "Filename format:";
const FILENAME_FORMAT_DEFAULT = "{{~title~}}";

const ILLEGAL_OBSIDIAN_FILE_NAME_PATTERN = /[\\,#%&\{\}\/*<>?$\'\":@]*/g;

module.exports = {
  entry: start,
  settings: {
    name: "Crossref",
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

  var query = document.getSelection().toString();
  if (typeof query != "string"){
      query = null;
  }
  if (!query){
    query = getFrontmatterDoi();
    if (query){
      if (!await QuickAdd.quickAddApi.yesNoPrompt('Use DOI from frontmatter?')){ 
        query = null;
      }
    } 
  }
  if (!query){
    query = await getQuery();
    query = query.searchTerms;
  }
  if (!query) {
    notice("No query entered.");
    throw new Error("No query entered.");
  }
  var selectedRef;
  if (isDoi(query)){
    selectedRef = await fetchReference(API_URL, query);
  }
  else{
    let possibleRefs = await getRefsByQueryParams(query);
    selectedRef = await promptUserForSelectingSuggestions(possibleRefs);
  }
  if (selectedRef){
    console.log(selectedRef);
    // Read in template as defined in settings:
    let template_file = app.vault.getAbstractFileByPath(Settings[TEMPLATE]);
    let template = await app.vault.read(template_file);
    // Apply template to coll object:
    let rendered = params.app.plugins.getPlugin('obsidian-handlebar-helper-plugin').compileAndRender(template,selectedRef);
    // Build filename and create file:
    filename_template = Settings[FILENAME_FORMAT];
    fileName = params.app.plugins.getPlugin('obsidian-handlebar-helper-plugin').compileAndRender(filename_template,selectedRef);
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
    notice("No reference selected");
    throw new Error("No reference selected.");
  }
}

function formatTitleForSuggestionList(resultItem) {
  var suggestion = `${resultItem.title}`;
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

function getFrontmatterDoi(){
  var doi;
  leaf = app.workspace.getUnpinnedLeaf();
  var filemeta = app.metadataCache.getFileCache(leaf.view.file);
  if (Object.keys(filemeta).includes("frontmatter")){
    if (Object.keys(filemeta.frontmatter).includes("doi")){
      doi = filemeta.frontmatter.doi;
    }
  }
  return doi;
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
  return QuickAdd.quickAddApi.inputPrompt("Crossref search terms:");
}

function promptUserForSelectingSuggestions(suggestions) {
  return new Promise((resolve, reject) => {
    QuickAdd.quickAddApi
      .suggester(suggestions.map(formatTitleForSuggestionList), suggestions)
      .then(async (selectedRef) => {
        if (!selectedRef) {
          notice("No choice selected.");
          reject(new Error("No choice selected."));
        }

        resolve(selectedRef);
      });
  });
}



/**
 *
 * @param {object} reference The reference data searching CrossRef
 * @returns {Reference}
 */
function buildReferencesData(reference) {
  return reference;
}

/**
 *
 * @param {object} queryParams
 * @throws Will throw Error if no collections are found
 * @returns {Reference[]} The reference results from searching for a reference
 */
async function getRefsByQueryParams(queryParams) {
  const searchResults = await fetchReferences(
    API_URL,
    queryParams
  );
  console.log(searchResults);
  if (!searchResults || !searchResults.length) {
    notice("No results found.");
    throw new Error("No results found.");
  }
  return searchResults.map(buildReferencesData);
}

/**
 *
 * @param {object} queryParams
 * @returns {string} The query string for requests to crossref API
 */
function buildQueryString(queryParam) {
  return queryParam;
}

function isDoi(str){
  var possibleDoi = str
  if (/^doi:[^\s]+$/i.test(str)){
    possibleDoi = str.replace(/^doi:/i,'')
  }
  return /^10.[^\s]+$/i.test(possibleDoi);
}

function cleanDoiPrefix(str){
  var cleaned = str;
  if (/^doi:[^\s]+$/i.test(str)){
    cleaned = str.replace(/^doi:/i,'')
  }
  return cleaned;
}

/**
 *
 * @param {string} url
 * @param {object} queryParams
 * @returns {object[]}
 */
async function fetchReferences(url, queryParam) {
  let finalURL = new URL(url);
  finalURL.searchParams.append("query", buildQueryString(queryParam));
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
  )['message']['items'];
}

async function fetchReference(url, doi) {
  let finalURL = new URL(url + '/' + cleanDoiPrefix(doi));
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
  )['message'];
}