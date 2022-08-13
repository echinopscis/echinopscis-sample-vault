const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

const API_OCC_BASE = "https://api.gbif.org/v1/occurrence/"
const API_SEARCH_URL = API_OCC_BASE + "search";
const API_CLUSTER_SUFFIX = "/experimental/related"

const TEMPLATE = "Template file:";
const DESTINATION_DIR = "Destination folder:";
const RETRIEVE_LINKED_OCCS = "Retrieve linked occurrences";
const INTERPRET_NUMBER_AS_RECORDNUMBER = "Interpret numbers as recordnumbers?";

const FILENAME_FORMAT = "Filename format:";
const FILENAME_FORMAT_DEFAULT = "{{collectingEventAlias}} - {{year}} ({{collectionCode}})";

const ILLEGAL_OBSIDIAN_FILE_NAME_PATTERN = /[\\,#%&\{\}\/*<>?$\'\":@]*/g;

module.exports = {
  entry: start,
  settings: {
    name: "GBIF mediated occurrences",
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
      [RETRIEVE_LINKED_OCCS]: {
        type: "toggle",
        defaultValue:false,
      },
      [INTERPRET_NUMBER_AS_RECORDNUMBER]: {
        type: "toggle",
        defaultValue: false,
        // placeholder: "Interpret numbers as recordnumbers?",
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

  let possibleOccs = await getOccurrencesByQueryParams(query);
  let selectedOcc = await promptUserForSelectingSuggestions(possibleOccs);
  if (selectedOcc){
    selectedOcc = await augmentOccurrenceData(selectedOcc, query);
    // Read in template as defined in settings:
    let template_file = app.vault.getAbstractFileByPath(Settings[TEMPLATE]);
    let template = await app.vault.read(template_file);
    // Apply template to occ object:
    let rendered = params.app.plugins.getPlugin('obsidian-handlebar-helper-plugin').compileAndRender(template,selectedOcc);
    // Build filename and create file:
    filename_template = Settings[FILENAME_FORMAT];
    fileName = params.app.plugins.getPlugin('obsidian-handlebar-helper-plugin').compileAndRender(filename_template,selectedOcc);
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
    notice("No occurrence selected");
    throw new Error("No occurrence selected.");
  }
}

function formatTitleForSuggestionList(resultItem) {
  console.log('formatTitleForSuggestion', resultItem);
var suggestion = decodeEntity(`${resultItem.family} ${resultItem.scientificName} - ${resultItem.recordedBy} ${resultItem.recordNumber} (${resultItem.year}) (${resultItem.collectionCode})`);
if (isGeoReferenced(resultItem)){
  suggestion = suggestion + ' [georeferenced]';
}
if (occ2ImageZoomUrl(resultItem)){
  suggestion = suggestion + ' [imaged]';
}
if (resultItem.isInCluster){
  suggestion = suggestion + ' [clustered]';    
}
return suggestion;
}

function isGeoReferenced(selectedOcc){
  flag = (('decimalLatitude' in selectedOcc) & (selectedOcc.decimalLatitude != null));
  flag = (flag & ('decimalLongitude' in selectedOcc) & (selectedOcc.decimalLongitude != null));
  return flag;
}

function formatLocation(selectedOcc){
  if (isGeoReferenced(selectedOcc)){
    return `[${selectedOcc.decimalLatitude}, ${selectedOcc.decimalLongitude}]`;
  }
  else return "[]";
}

function media2StillImage(media){
  return media.filter(function (mediaelem) {
    return mediaelem['type'] == 'StillImage';
  })  
}

function occ2ImageZoomUrl(occ){
  zoomurl = "";
  if ('media' in occ){
    mediaelems = media2StillImage(occ['media']);
    console.log(mediaelems);
    if (mediaelems.length > 0 && 'identifier' in mediaelems[0]){
      encodedImageUrl = encodeURIComponent(mediaelems[0]['identifier']);
      console.log(encodedImageUrl);
      zoomurl = `<iframe src="https://www.gbif.org/tools/zoom/simple.html?src=//api.gbif.org/v1/image/unsafe/${encodedImageUrl}" width="400" height="600">`;
    }
  }
  return zoomurl;
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

function detectRecordNumber(query){
  if (Settings[INTERPRET_NUMBER_AS_RECORDNUMBER]){
    const p = /^[0-9]+$/;
    // Loop through terms of query, prefix any numbers with recordNumber:
    var queryterms = [];
    query.split(' ').forEach(function prefixNumber(value){
                                              console.log('value: ' + value);
                                              if (p.test(value)){
                                                queryterms.push('recordNumber:' + value);
                                              }
                                              else{
                                                queryterms.push(value);
                                              }
                                            });
    query = queryterms.join(' ');
    console.log(query);
  }
  return query;  
}

function promptUserForSearchTerms(){
  return QuickAdd.quickAddApi.inputPrompt("GBIF occurrence search terms:");
}

function promptUserForSelectingSuggestions(suggestions) {
  return new Promise((resolve, reject) => {
    QuickAdd.quickAddApi
      .suggester(suggestions.map(formatTitleForSuggestionList), suggestions)
      .then(async (selectedOcc) => {
        if (!selectedOcc) {
          notice("No choice selected.");
          reject(new Error("No choice selected."));
        }

        resolve(selectedOcc);
      });
  });
}

/**
 *
 * @param {object} release The occurrence data from searching GBIF
 * @returns {Occurrence}
 */
function buildOccurrencesData(occurrence) {
  imageZoomUrl = occ2ImageZoomUrl(occurrence);
  occurrence.imageZoomUrl = imageZoomUrl;
  return occurrence
}

async function augmentOccurrenceData(occurrence, query){
  const rbFirstFamilyName = await recordedBy2FirstFamilyName(occurrence.recordedBy);
  occurrence.rbFirstFamilyName = rbFirstFamilyName;
  occurrence.collectingEventAlias = `${occurrence.rbFirstFamilyName} ${occurrence.recordNumber}`;

  const location = formatLocation(occurrence);
  occurrence.location = location;

  occurrence.searchterm = query;

  return occurrence;
}

/**
 *
 * @param {object} queryParams
 * @throws Will throw Error if no collections are found
 * @returns {Occurrence[]} The occurrence results from searching for a occurrence
 */
async function getOccurrencesByQueryParams(queryParams) {
  const searchResults = await fetchOccurrences(
    API_SEARCH_URL,
    queryParams
  );
  console.log(searchResults);
  if (!searchResults || !searchResults.length) {
    notice("No results found.");
    throw new Error("No results found.");
  }
  return searchResults.map(buildOccurrencesData);
}

/**
 *
 * @param {object} queryParams
 * @returns {string} The query string for requests to GBIF occurrence API.
 */
function buildQueryParams(queryString) {
  queryString = detectRecordNumber(queryString);
  return query2Params(queryString);
}

function extractPrefixedSearchTerms(query){
  return query.split(' ').filter(function (term) {
    return term.includes(':');
  })  
}

function extractSimpleSearchTerms(query){
  return query.split(' ').filter(function (term) {
    return ! term.includes(':');
  })  
}

  
function term2key(term){
  return term.split(':')[0]
}
function term2val(term){
  return term.split(':')[1]
}

function query2Params(query){
  prefixedTermList = extractPrefixedSearchTerms(query)
  console.log(prefixedTermList)
  simpleTerms = extractSimpleSearchTerms(query)
  console.log(simpleTerms)
  var params = prefixedTermList.reduce(function(obj, x) {
    obj[term2key(x)] = term2val(x);
    return obj;
  }, {});
  params['q'] = simpleTerms;
  params['basisOfRecord'] = 'PRESERVED_SPECIMEN';
  return params;
}

/**
 *
 * @param {string} url
 * @param {object} queryParams
 * @returns {object[]}
 */
async function fetchOccurrences(url, queryParam) {
  let finalURL = new URL(url);
  if (queryParam) {
    queryParams = buildQueryParams(queryParam);

    for (const [key, value] of Object.entries(queryParams)) {
      console.log(key, value);
      finalURL.searchParams.append(key, value);
    }
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

  async function recordedBy2FirstFamilyName(s){
    let finalURL = new URL('https://api.bionomia.net/parse');
    finalURL.searchParams.append('names', s);
  
    const res = await request({
      url: finalURL.href,
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res)
    let firstFamilyName = "";
    jsonres = JSON.parse(res);
    if (jsonres.length > 0){
      firstFamilyName = jsonres[0]['parsed'][0]['family'];
    }
    return firstFamilyName;  
  }  