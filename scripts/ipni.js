const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

const API_SEARCH_URL = "https://ipni.org/api/1/search";
const API_NAME_URL = 'https://ipni.org/api/1/n/';

const FILENAME_FORMAT = "Filename format:";
const FILENAME_FORMAT_DEFAULT = "{{~fullname~}}";
const DESTINATION_DIR = "Destination folder:";

const TEMPLATE = "Template file:";
const RETRIEVE_LINKED_NAMES = "Retrieve linked names:";

module.exports = {
  entry: start,
  settings: {
    name: "IPNI names",
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
      [RETRIEVE_LINKED_NAMES]: {
        type: "toggle",
        defaultValue:false,
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
  console.log(settings);
  let query = await getQuery();
  if (!query) {
    notice("No query entered.");
    // throw new Error("No query entered.");
  }
  else{
    console.log(query.searchTerms);
    let possibleNames = await getNamesByQueryParams(query.searchTerms);
    console.log(possibleNames);
    let selectedName = await promptUserForSelectingSuggestions(possibleNames);
    if (selectedName){
      if (selectedName.basionymId && Settings[RETRIEVE_LINKED_NAMES]){
        var basionymName = await getByLsid(selectedName.basionymId);
        console.log(basionymName);
        await saveSelectedName(basionymName,selectedName,params, app, false);  
      }
      await saveSelectedName(selectedName,basionymName, params, app, true);
    }
    else{
      notice("No name selected");
      // throw new Error("No name selected.");
    }
  }
}

async function saveSelectedName(selectedName, linkedName, params, app, open){  
  hbrenderer = params.app.plugins.getPlugin('obsidian-handlebar-helper-plugin');
  selectedName.fullname = `${selectedName.name} ${selectedName.authors}`;
  if (linkedName){
    linkedName.fullname = `${linkedName.name} ${linkedName.authors}`;
  }
  selectedName.holotype=extractType(selectedName.typeLocations, 'holotype');
  selectedName.isotypes=extractType(selectedName.typeLocations, 'isotype');
  selectedName.fullname_abbrev = buildAbbreviatedName(selectedName);
  // Build filename and create file:
  filename_template = Settings[FILENAME_FORMAT];
  fileName = hbrenderer.compileAndRender(filename_template, selectedName);
  if (linkedName){
    linkedFileName = hbrenderer.compileAndRender(filename_template,linkedName);
    selectedName.linkedFileName = linkedFileName;
  }
  fileName = Settings[DESTINATION_DIR] + '/' + fileName + '.md';
  // Read in template as defined in settings:
  let template_file = app.vault.getAbstractFileByPath(Settings[TEMPLATE]);
  let template = await app.vault.read(template_file);
  // Apply template to name object:
  let rendered = hbrenderer.compileAndRender(template,selectedName);
  createdFile = await params.app.vault.create(fileName, rendered);
  // Open it:
  if (open){
    leaf = params.app.workspace.getUnpinnedLeaf();
    await leaf.openFile(createdFile)  
  }
}

///////////////////////////////////////////////////////////////////////////////
// Formatting and cleaning functions
///////////////////////////////////////////////////////////////////////////////
function buildAbbreviatedName(selectedName){
  console.log(selectedName.rank);
  if (/^(spec|subspec|var|f)\./.test(selectedName.rank)){
    console.log('abbreviating');
    return `${selectedName.name} ${selectedName.authors}`.replace(selectedName.genus, selectedName.genus[0] + '.');
  }
  else{
    console.log('not abbreviated');
    return `${selectedName.name} ${selectedName.authors}`;
  }  
}

function extractType(typelist, typeoftype){
  if (typelist){
    return typelist.split(';').filter(function (typestmt) {
      var type_regex = new RegExp('^' + typeoftype);
      return type_regex.test(typestmt);
    }).join('; ').replace(typeoftype, '');
  }  
}

function isLsid(str) {
  return /^urn:lsid:ipni\.org:names:.*$/.test(str);
}

function isIpniId(str) {
    return /^\d+\-[1-3]$/.test(str);
  }
  
function formatTitleForSuggestionList(resultItem) {
    console.log(resultItem)
  return decodeEntity(`${resultItem.name} ${resultItem.authors}`);
}

function decodeEntity(inputStr) {
  var textarea = document.createElement("textarea");
  textarea.innerHTML = inputStr;
  return textarea.value;
}

async function getQuery(){
  var query = document.getSelection().toString();
  if (typeof query != "string"){
      query = null;
  }
  if (query){
    return query;
  }
  else{
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
}
  
function promptUserForSearchTerms(){
  return QuickAdd.quickAddApi.inputPrompt("IPNI name search terms:");
}

function promptUserForSelectingSuggestions(suggestions) {
  return new Promise((resolve, reject) => {
    QuickAdd.quickAddApi
      .suggester(suggestions.map(formatTitleForSuggestionList), suggestions)
      .then(async (selectedName) => {
        if (!selectedName) {
          notice("No choice selected.");
          reject(new Error("No choice selected."));
        }

        resolve(selectedName);
      });
  });
}

/**
 *
 * @param {object} name The name data from searching IPNI
 * @returns {Name}
 */
function buildNameData(name) {
  return name;
}

/**
 *
 * @param {object} queryParams
 * @throws Will throw Error if no profiles are found
 * @returns {Name[]} The results from searching IPNI for matching names
 */
async function getNamesByQueryParams(queryParams) {
  var searchResults;
  if (isIpniId(queryParams)){
    searchResults = await getById(queryParams);  
  }
  else if (isLsid(queryParams)){
    searchResults = await getByLsid(queryParams);  
  }
  else{
    searchResults = await fetchNames(
    API_SEARCH_URL,
    queryParams
    );
  }
  console.log(searchResults);
  if (!searchResults || !searchResults.length) {
    notice("No results found.");
    throw new Error("No results found.");
  }
  return searchResults.map(buildNameData);
}

function buildQueryString(queryParam){
  return queryParam;
}

/**
 *
 * @param {string} url
 * @param {object} queryParams
 * @returns {object[]}
 */
async function fetchNames(url, queryParam) {
  let finalURL = new URL(url);
  if (queryParam) {
    finalURL.searchParams.append("q", buildQueryString(queryParam));
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

async function getById(id) {
  const url = API_NAME_URL + '/' + id;
  const res = await apiGetById(url, null, 'application/json');
  if (!res) {
    notice("No results found.");
    throw new Error("No results found.");
  }
  return res;
  }
  
  async function getByLsid(id) {
  const url = API_NAME_URL + '/' + id;
  const res = await apiGetById(url, null, 'application/json');
  if (!res) {
    notice("No results found.");
    throw new Error("No results found.");
  }
  return res;
  }
  
  async function apiGetById(url, data, content_type) {
    let finalURL = new URL(url);
    let finalContent_type = "application/json";
    if (content_type)
      finalContent_type = content_type;
    if (data)
      Object.keys(data).forEach((key) =>
        finalURL.searchParams.append(key, data[key])
      );
    const res = await request({
      url: finalURL.href,
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": finalContent_type,
      },
    });
    return JSON.parse(res);
  }