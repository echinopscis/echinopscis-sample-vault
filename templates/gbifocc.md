---
aliases: ["{{recordedBy}} {{recordNumber}}", "{{collectingEventAlias}}", "{{catalogNumber}}", "{{{searchterm}}}"]
title: "{{recordedBy}} {{recordNumber}}"
gbifid: {{key}}
{{#if decimalLatitude}}{{#if decimalLongitude}}location: [{{decimalLatitude}},{{decimalLongitude}}]{{/if}}{{/if}}
---

>[!info] GBIF occurrence information for {{recordedBy}} {{recordNumber}}
> gbifid: {{key}}

--- 

{{#if imageZoomUrl}}
## Media
{{{imageZoomUrl}}}
{{/if}}

## Holder

institutionCode: {{institutionCode}}
collectionCode: {{collectionCode}}

## Collecting event

recordedBy: {{{recordedBy}}}
recordNumber: {{recordNumber}}
eventDate: {{eventDate}}

## Links

[{{key}}](https://gbif.org/occurrence/{{key}})

## Tags

#occurrence/{{basisOfRecord}}

{{#if typeStatus}}#type/{{typeStatus}}{{/if}}

---

## Local notes