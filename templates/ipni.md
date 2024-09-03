---
aliases:
  - "{{{fullname}}}"
  - "{{{fullname_abbrev}}}"
ipni_name_id: "{{id}}"
lsid: urn:lsid:ipni.org:names:{{{id}}}
title: "{{{fullname}}}"
links: "{{{linkedFileName}}}"
protologue_doi: "{{doi}}"
---

## Reference

{{fullname}} 
{{#if doi}}
[{{reference}}](https://dx.doi.org/{{doi}})
{{else}}
{{reference}}
{{/if}}

---

{{#if collectorTeam}}
## Type information
Collector team: {{{collectorTeam}}} {{collectionNumber}}
{{#if collectionDate1}}
Collection date: {{collectionDate1s}}
{{/if}}
Locality: {{locality}}
Holotype: {{holotype}}
Isotypes: {{isotypes}}
{{/if}}

{{#if basionymId}}
Basionym: [[{{linkedFileName}}]]
{{/if}}

{{#if basionymOf}}
Combination: [[{{linkedFileName}}]]
{{/if}}

---

{{#if remarks}}
## Remarks
{{remarks}}
{{/if}}

## Tags

#name

---

## Local notes
