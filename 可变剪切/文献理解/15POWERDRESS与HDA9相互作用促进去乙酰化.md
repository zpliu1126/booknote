# 15POWERDRESS与HDA9相互作用促进去乙酰化

### Abstract 

组蛋白的乙酰化与基因表达是紧密相关的，乙酰化往往能够促进基因的表达。通过调节两个相反的复合物**HATs**组蛋白（乙酰基转移酶）和**HDACs**（组蛋白去乙酰基复合物）的平衡，来调节基因的乙酰化水平。拟南芥中HDACs就是一个很大的基因家族，对不同的基因进行突变之后出现不同的表型，说明这些基因可能扮演者不同的作用；究竟是什么原因导致这些基因功能的多样性仍旧是未知的。研究就发现这个POWERDRESS蛋白能够与HDA9相互作用，促进组蛋白H3的去乙酰化，对POWERDRESS和HAD9分别进行突变之后，组蛋白H3上(K9、K14、K27)上都出现比较高的乙酰化水平。通过转录组的数据分析发现，两种突变体中存在一些重叠基因。通过对POWERDRESS结构域分析发现了这个  SANT2 domain  它和HDACs中的亚基有一定的同源性，对H3组蛋白具有亲和性，因此可能与HDA9相互作用形成一个HDACs复合物，来对H3组蛋白进行去乙酰化。

### Background

1. 组蛋白修饰包括 乙酰化、甲基化、磷酸化和泛素化，都是一些可逆的反应，往往参与调控植物的发育、基因组的完整性和逆境的响应中。
2. 在拟南芥中鉴定到18个HDACs基因，通过系统发生树分析，这些基因分为3大类：HDA1、HD2、SIR2-like，其中12个HDACs基因属于HDA1，参与到植物发育、生殖过程、激素信号和DNA甲基化。HD2包括4个HDACs基因主要参与到植物的发育和逆境的响应中，另外2个HDACs基因属于第三组参与到线粒体的能量代谢和细胞的去分化中。
3. 总的来说，组蛋白修饰酶由多种蛋白复合物组成，它们之间相互作用来调节酶的活性，对反应的底物特异性的识别，招募一些其他的辅因子。在拟南芥的研究中发现，一些染色质修饰的酶和转录因子能够与HDACs相互作用。其中研究最透彻的也就是HDA1(HDA6,HDA7,HDA9,HDA19)中的两个基因HDA6和HDA19。HDA6控制植物在恰当的时间开花，同时与DNA甲基转移酶相互作用，调节基因组上的转座子和重复序列。HDA19参与到油菜是内脂信号途径，分别与  转录因子BZR1  、  WRKY 38/62  相互作用。
4.   SANT   这个保守的结构域在许多染色质修饰复合物中都出现，并且与酶的活性、底物的亲和能力都有关。在拟南芥中  POWERDRESS 蛋白包含两个保守的 SANT   结构域。
5. 通过对PWR和HDA9分别进行突变之后，发现两者出现一些重叠的基因，例如与植物开花相关的AGL19。通过对组蛋白的去乙酰化来抑制基因的表达。

### Result

1. PWR的保守结构域能够绑定到修饰后的H3上，表明它可能参与到组蛋白修饰。
2. 构建了突变体pwr和hda，发现pwr突变体中H3出现过度乙酰化，并且与hda9的表型类似。
3. 紧接着探究PWR和HDA9，是否影响特定位置的乙酰化，或者它们之间有没有相同的靶标，做了H3K9ac和H3K14ac的CHIP-seq实验，发现在基因区域，TSS和TTS区域有显著性的峰的富集。
4. 使用MEME-ChIP搜索pwr和hda9中共有的peak区域的motif，发现一些共有的motif。表明它们可能高度相关
5. 对两个突变体进行RNA-seq分析，发现一些共有的靶标基因，找了单个已经报道的基因AGL19进行举例说明，pwr和hda19共同调控它

### Discussion

1. PWR中包含了与动物中HDAC蛋白相同的SANT 保守结构域，这也是作者想看一下这个蛋白对组蛋白的修饰有没有什么作用

   >   Unlike the specific binding of the SMRT SANT2 domain to an unacetylated histone H4 tail (32), the PWR SANT2 domain preferentially
   > binds to acetylated histone H3. Yu et al.  

2. PWR和HDA9有一定关系

   >   The physical interaction between HDA9 and PWR and the similar morphological and molecular defects in the pwr and hda9 mutants support the hypothesis that PWR and HDA9 act in the same complex  
   >

3. 提出PWR在组蛋白修饰中的两个作用,PWR通过识别异染色质区域的甲基化来招募HDA9，对这个区域进行去乙酰化，调控基因转录

   >   PWR may act as a histone code reader of which the SANT2 domain recognizes
   > H3K9me1/me2 and interprets its repressive mode through histone deacetylation by recruiting HDA9 
   
4. PWR-HDA9如何识别特定位点，发现了**GAAGAA**motif，有研究表明这个motif显著性的富集在靠近剪切位点富集的exon区域；表明PWR-HDA9可能有助于外显子的剪切。也有可能是这个motif与基因的乙酰化有关，才显著性的富集，并不是直接被复合物识别的


### 参考

1.   POWERDRESS and HDA9 interact and promote histone H3 deacetylation at specific genomic sites
   in Arabidopsis   https://doi.org/10.1073/pnas.1618618114 