---
aliases: ["{{recordedBy}} {{recordNumber}}", "{{ffalias}}", "{{catalogNumber}}"]
title: "{{recordedBy}} {{recordNumber}}"
gbifid: {{key}}
{{#if decimalLatitude}}{{#if decimalLongitude}}location: [{{decimalLatitude}},{{decimalLongitude}}]{{/if}}{{/if}}
---

>[!info] GBIF occurrence information for {{recordedBy}} {{recordNumber}}
> gbifid: {{key}}

--- 

{{{imageZoomUrl}}}

[{{key}}](https://gbif.org/occurrence/{{key}})

---

```juggl
local: "{{fileName}}"
```

#occurrence

{{#if typeStatus}} #type/{{typeStatus}}{{/if}}
