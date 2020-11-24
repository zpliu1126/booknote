### 表观遗传调控基因的转录



#### 1.全基因组甲基化水平的展示



#### 1.IR、intron在CG甲基化上的差异

+ 过滤掉那些没有`CG`甲基的片段
+ 

```python
#计算序列中CG含量
 for i in range(0,len(lines),2):
        lines[i]=lines[i].strip("\n")
        seq2[lines[i]]=seq2.get(lines[i],str(len(re.findall(r'CG',lines[i+1]))))
        
##计算甲基化的C的数目
awk '$10<=0.05&&$5!="."{a[">"$1":"$2-1"-"$3]+=1}$10>0.05||$5=="."{a[">"$1":"$2-1"-"$3]+=0}END{for(i in a){print i"\t"a[i]}}' intron_CpG_rep1.txt >333
```

#### 2. intron和两侧exon在CpG甲基化水平上的差异



#### 3.进化过程中基因转录本发生变化的同源基因，甲基化水平是否存在差异

+ DMGs和DSS

+ > 保守AS和不保守AS，在CpG甲基化水平的差异
  >
  > The maize methylome influences mRNA splice sites
  > and reveals widespread paramutation-like switches
  > guided by small RNA  

  

















#### 不同剪切事件在表观上的差异





#### 三种基因在CDS区域、UTR区域中表观上的差异

同一个基因组内进行比较

+ 完全保守的基因
+ 半保守基因
+ 差异基因