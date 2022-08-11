---
aliases: ["{{fullname}}","{{fullname_abbrev}}"]
ipniid: {{id}}
lsid: {{lsid}}
title: "{{fullname}}"
links: "{{linkedFileName}}"
doi: "{{doi}}"
---

{{fullname}}

{{#if collectorTeam}}
Collector team: {{collectorTeam}} {{collectionNumber}}
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

{{#if remarks}}
## Remarks
{{remarks}}
{{/if}}

#name