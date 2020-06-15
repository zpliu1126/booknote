

```bash
png(file = "AtUp.png", width = 600, height = 420)
ggplot(data, aes(x = V4, y = V3)) +
  geom_point(aes(size = V5, color = -1 * log10(V7))) +
  scale_color_gradient2(
    low = "#dff9fb",
    mid = "#4834d4",
    high = "#ff7979",
  ) +
  theme_linedraw(base_size = 15) +
  theme(
    axis.text.x = element_text(size = "10"),
    axis.text.y = element_text(size = "16", family = "Times"),
    axis.title.y = element_blank(),
    axis.title.x = element_text(size = "15", family = "Times"),
    legend.title = element_text(
      family = "Times", colour = "#2c3e50",
      size = 14
    ),
    legend.text = element_text(color = "#2c3e50"),
  ) +
  xlab("gene ratio") +
  labs(size = "Gene Count", color = "-lg(p-adjust)")
dev.off()
```

