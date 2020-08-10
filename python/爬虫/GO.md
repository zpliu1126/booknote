### 根据关键字获取对应的基因

> 请求API http://golr.geneontology.org/solr/select?defType=edismax&qt=standard&indent=on&wt=json&rows=10&start=0&fl=bioentity,bioentity_name,taxon,panther_family,type,source,synonym,bioentity_label,taxon_label,panther_family_label,score,id&facet=true&facet.mincount=1&facet.sort=count&json.nl=arrarr&facet.limit=25&hl=true&hl.simple.pre=%3Cem%20class=%22hilite%22%3E&hl.snippets=1000&fq=regulates_closure:%22GO:0051740%22&fq=document_category:%22bioentity%22&facet.field=source&facet.field=taxon_subset_closure_label&facet.field=type&facet.field=panther_family_label&facet.field=annotation_class_list_label&facet.field=regulates_closure_label&q=*:*&packet=1&callback_type=search



> 根据基因编号和物种编号 请求序列信息
>
> API: https://www.ncbi.nlm.nih.gov/gene/?term=(ETR1%5BGene+Name%5D)+AND+%3A4565%5BTaxonomy+ID%5D

包含两个筛选条件：

+ Gene+Name 基因名
+ Taxonomy+ID 物种ID

