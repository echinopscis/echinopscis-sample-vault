const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

const API_SEARCH_URL = "https://api.bionomia.net/user.json";
const USER_PROFILE_URL = "https://bionomia.net";

const TEMPLATE = "Template file:";
const DESTINATION_DIR = "Destination folder:";

const FILENAME_FORMAT = "Filename format:";
const FILENAME_FORMAT_DEFAULT = "{{~fullname~}} {{~fn_lifespan~}}";

const ILLEGAL_OBSIDIAN_FILE_NAME_PATTERN = /[\\,#%&\{\}\/*<>?$\'\":@]*/g;

module.exports = {
  entry: start,
  settings: {
    name: "Bionomia",
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
  console.log(settings);
  let query = await getQuery();
  if (!query) {
    notice("No query entered.");
    throw new Error("No query entered.");
  }
  console.log(query.searchTerms);

  let possibleProfiles = await getProfilesByQueryParams(query.searchTerms);
  let selectedProfile = await promptUserForSelectingSuggestions(possibleProfiles);
  if (selectedProfile){
    selectedProfile.lifespan = cleanLifeSpan(selectedProfile.lifespan);
    // Read in template as defined in settings:
    let template_file = app.vault.getAbstractFileByPath(Settings[TEMPLATE]);
    let template = await app.vault.read(template_file);
    // Apply template to profile:
    let rendered = params.app.plugins.getPlugin('obsidian-handlebar-helper-plugin').compileAndRender(template,selectedProfile);
    // Build filename and create file:
    filename_template = Settings[FILENAME_FORMAT];
    fileName = params.app.plugins.getPlugin('obsidian-handlebar-helper-plugin').compileAndRender(filename_template,selectedProfile);
    fileName = Settings[DESTINATION_DIR] + '/' + fileName.replace(ILLEGAL_OBSIDIAN_FILE_NAME_PATTERN, "") + '.md';
    console.log(fileName);
    createdFile = await params.app.vault.create(fileName, rendered);
    // Open it:
    leaf = params.app.workspace.getUnpinnedLeaf();
    await leaf.openFile(createdFile)  
  }
  else{
    notice("No profile selected");
    throw new Error("No profile selected.");
  }
}

function formatTitleForSuggestionList(resultItem) {
  var suggestion = `${resultItem.fullname_reverse}`;
  if (resultItem.lifespan){
    suggestion = suggestion + ` (${resultItem.lifespan})`
  }
  if(resultItem.description){
    suggestion = suggestion + ` (${resultItem.description})`
  }
  return decodeEntity(suggestion);
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
  return QuickAdd.quickAddApi.inputPrompt("Bionomia search terms:");
}

function promptUserForSelectingSuggestions(suggestions) {
  return new Promise((resolve, reject) => {
    QuickAdd.quickAddApi
      .suggester(suggestions.map(formatTitleForSuggestionList), suggestions)
      .then(async (selectedProfile) => {
        if (!selectedProfile) {
          notice("No choice selected.");
          reject(new Error("No choice selected."));
        }

        resolve(selectedProfile);
      });
  });
}


function cleanLifeSpan(str){
  var clean = [];
  var entityPatt = /^\&.*?$/;
  if (str != null){
    str.split(' ').forEach(function stripEntities(s){
      if (entityPatt.test(s)){
        if (s == '&ndash;'){
          clean.push('-');
        }
      }
      else{
        clean.push(s);
      }
    });
  }
  return clean.join(' ');
}


/**
 *
 * @param {object} profile The profile data from searching Bionomia
 * @returns {Profile}
 */
function buildProfileData(profile) {
  return profile;
}

/**
 *
 * @param {object} queryParams
 * @throws Will throw Error if no profiles are found
 * @returns {Profile[]} The results from searching Bionomia for matching profiles
 */
async function getProfilesByQueryParams(queryParams) {
  const searchResults = await fetchProfiles(
    API_SEARCH_URL,
    queryParams
  );
  console.log(searchResults);
  if (!searchResults || !searchResults.length) {
    notice("No results found.");
    throw new Error("No results found.");
  }
  return searchResults.map(buildProfileData);
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
async function fetchProfiles(url, queryParam) {
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
  );
}

///////////////////////////////////////////////////////////////////////////////
// Functions to test query format
///////////////////////////////////////////////////////////////////////////////
function isORCID(str) {
  return /^\d{4}\-\d{4}\-\d{4}\-\d{4}$/.test(str);
}

function isWikidataQid(str) {
    return /^Q\d+$/.test(str);
  }