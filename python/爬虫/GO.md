### 根据关键字获取对应的基因

> 请求API http://golr.geneontology.org/solr/select?defType=edismax&qt=standard&indent=on&wt=json&rows=10&start=0&fl=bioentity,bioentity_name,taxon,panther_family,type,source,synonym,bioentity_label,taxon_label,panther_family_label,score,id&facet=true&facet.mincount=1&facet.sort=count&json.nl=arrarr&facet.limit=25&hl=true&hl.simple.pre=%3Cem%20class=%22hilite%22%3E&hl.snippets=1000&fq=regulates_closure:%22GO:0051740%22&fq=document_category:%22bioentity%22&facet.field=source&facet.field=taxon_subset_closure_label&facet.field=type&facet.field=panther_family_label&facet.field=annotation_class_list_label&facet.field=regulates_closure_label&q=*:*&packet=1&callback_type=search



