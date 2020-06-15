## MEME本地化





### 使用

```bash
meme ../TM1sequence.fa  -rna -oc .  -mod zoops   -nmotifs 50 -minw 6 -maxw 20
```

- `input.fasta` 可以是 DNA、RNA 或 蛋白质序列。
- `-protein` 指定 `input.fasta` 的类型。
- `-oc` 指定输出文件路径，`.` 即为当前目录。
- `-mod` 假定 motif 的分布模式，详见 http://meme-suite.org/doc/meme.html。
- `-minw` motif 的最小宽度。
- `-maxw` motif 的最大宽度。





### 参考

1.  [https://hui-liu.github.io/blog/meme%E6%9C%AC%E5%9C%B0%E7%89%88%E7%9A%84%E4%BD%BF%E7%94%A8/](https://hui-liu.github.io/blog/meme本地版的使用/) 



