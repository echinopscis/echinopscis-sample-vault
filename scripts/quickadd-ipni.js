const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

const API_SEARCH_URL = "https://ipni.org/api/1/search";
const API_NAME_URL = 'https://ipni.org/api/1/n/';

const FILENAME_FORMAT = "Filename format:";
const FILENAME_FORMAT_DEFAULT = "{{VALUE:fullname}}";

// import {
//     MarkdownView,
//   } from "obsidian";


module.exports = {
  entry: start,
  settings: {
    name: "IPNI",
    author: "RBG Kew",
    options: {
      [FILENAME_FORMAT]: {
        type: "text",
        defaultValue: FILENAME_FORMAT_DEFAULT,
        // placeholder: "Interpret numbers as recordnumbers?",
      },
    },
  },
};

let QuickAdd;
let Settings;

async function start(params, settings) {
  QuickAdd = params;
  Settings = settings;
  
  var query = document.getSelection().toString();
  // console.log(query)
  // console.log(query.toString())
  // console.log(typeof query)
  if (typeof query != "string"){
    query = null;
  }
  console.log(query)

  if (!query) {
    query = await QuickAdd.quickAddApi.inputPrompt(
        "Name:"
      );
  }

  if (!query) {
    notice("No query entered.");
    throw new Error("No query entered.");
  }

  let selectedName;

  if (isLsid(query)) {
    selectedName = await getByLsid(query);
  } else if (isIpniId(query)) {
    selectedName = await getById(query);
  } else {
    const results = await getByQuery(query);

    const choice = await QuickAdd.quickAddApi.suggester(
      results.map(formatTitleForSuggestion),
      results
    );
    if (!choice) {
      notice("No choice selected.");
      throw new Error("No choice selected.");
    }

    // selectedPerson = await getByOrcid(choice.orcid);
    selectedName = choice;
    console.log(selectedName)
  }

  var holotype=extractType(selectedName.typeLocations, 'holotype');
  var isotype=extractType(selectedName.typeLocations, 'isotype');

  var citation_type_template_mapper={'comb. nov.':'IPNI_comb_templ','comb. et stat. nov.':'IPNI_comb_templ', 'tax. nov.':'IPNI_templ'};
  console.log(citation_type_template_mapper[selectedName.citationType]);
  
  await params.quickAddApi.executeChoice(citation_type_template_mapper[selectedName.citationType], {
    ...selectedName,
    fullname: `${selectedName.name} ${selectedName.authors}`,
    fullname_abbrev: buildAbbreviatedName(selectedName),
    lsid: selectedName.fqId,
    id: selectedName.id,
    basionym: selectedName.basionymStr ? selectedName.basionymStr : " ",
    collectorTeam: selectedName.collectorTeam ? selectedName.collectorTeam : " ",
    collectionNumber: selectedName.collectionNumber ? selectedName.collectionNumber : " ",
    holotype: holotype ? holotype : " ",
    isotypes: isotype ? isotype : " ",
    remarks: selectedName.remarks ? selectedName.remarks : " ",
    // fileName: replaceIllegalFileNameCharactersInString(selectedName.id),
    // fileName: Settings[FILENAME_FORMAT],
    // typeLink: `[[${selectedPerson.Type === "movie" ? "Movies" : "Series"}]]`,
    fileName: Settings[FILENAME_FORMAT],
  });

  // QuickAdd.variables = {
  //   ...selectedName,
    
  //   fullname: `${selectedName.name} ${selectedName.authors}`,
  //   fullname_abbrev: buildAbbreviatedName(selectedName),
  //   lsid: selectedName.fqId,
  //   id: selectedName.id,
  //   collectorTeam: selectedName.collectorTeam ? selectedName.collectorTeam : " ",
  //   collectionNumber: selectedName.collectionNumber ? selectedName.collectionNumber : " ",
  //   holotype: holotype ? holotype : " ",
  //   isotypes: isotype ? isotype : " ",
  //   remarks: selectedName.remarks ? selectedName.remarks : " ",
  //   // fileName: replaceIllegalFileNameCharactersInString(selectedName.id),
  //   // fileName: Settings[FILENAME_FORMAT],
  //   // typeLink: `[[${selectedPerson.Type === "movie" ? "Movies" : "Series"}]]`,
  //   fileName: Settings[FILENAME_FORMAT],
  // };

  // console.log(QuickAdd.variables)
}

function buildAbbreviatedName(selectedName){
  console.log(selectedName.rank);
  if (/^(spec|subspec|var|f)\./.test(selectedName.rank)){

  // }
  // if (selectedName.rank in ["spec.","subspec.","var.","f."]){
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

// function extractIsotypes(typelist){
//   return typelist.split(';').filter(function (typestmt) {
//     return /^isotype/.test(typestmt);
//   }).join('; ');  
// }

function formatTypeList(typelist){
  return typelist.split(';').map((typestmt) => `- ${typestmt}`).join('\n');
}

function linkifyList(list) {
  if (list.length === 0) return "";
  if (list.length === 1) return `[[${list[0]}]]`;

  return list.map((item) => `[[${item.trim()}]]`).join(", ");
}


function isLsid(str) {
  return /^urn:lsid:ipni\.org:names:.*$/.test(str);
}

function isIpniId(str) {
    return /^\d+\-[1-3]$/.test(str);
  }
  
function formatTitleForSuggestion(resultItem) {
    console.log(resultItem)
  return decodeEntity(`${resultItem.name} ${resultItem.authors}`);
}

function decodeEntity(inputStr) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = inputStr;
    return textarea.value;
}

async function getByQuery(query) {
    console.log(query)
  const searchResults = await apiGet(API_SEARCH_URL, {
    q: query,
  });

  if (!searchResults || !searchResults.length) {
    notice("No results found.");
    throw new Error("No results found.");
  }

  return searchResults;
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

function linkifyList(list) {
  if (list.length === 0) return "";
  if (list.length === 1) return `[[${list[0]}]]`;

  return list.map((item) => `[[${item.trim()}]]`).join(", ");
}

function replaceIllegalFileNameCharactersInString(string) {
  console.log(string)
  return string.replace(/[\\,#%&\{\}\/*<>?$\'\":@]*/g, "");
}

async function apiGet(url, data, content_type) {
  let finalURL = new URL(url);
  let finalContent_type = "application/json";
  if (content_type)
    finalContent_type = content_type;
  if (data)
    Object.keys(data).forEach((key) =>
      finalURL.searchParams.append(key, data[key])
    );

//   finalURL.searchParams.append("apikey", Settings[API_KEY_OPTION]);

  console.log(finalURL)
  console.log(finalContent_type)
  const res = await request({
    url: finalURL.href,
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": finalContent_type,
    },
  });

  console.log(res)
  return JSON.parse(res)['results'];
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

//   finalURL.searchParams.append("apikey", Settings[API_KEY_OPTION]);

  console.log(finalURL)
  console.log(finalContent_type)
  const res = await request({
    url: finalURL.href,
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": finalContent_type,
    },
  });

  console.log(res)
  return JSON.parse(res);
}