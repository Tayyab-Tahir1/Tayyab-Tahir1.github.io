---
title: Evaluating the w2v-BERT 2.0 speech tokenizer
slug: w2v-bert
order: 10
tier: compact
year: "2024"
status: Completed, team project
summary: Testing whether features from the w2v-BERT 2.0 encoder make good discrete tokens for a speech language model.
result: "Layer 16 gave the best probe accuracy (**88.4%**). The speech language model stayed near chance on sBLIMP syntax (0.501) after two epochs."
role: Team member, Université de Toulon (team of four)
tools: [Python, PyTorch, scikit-learn (MiniBatchKMeans), HPC cluster]
question: Do the internal features of a large speech encoder carry enough structure to train a language model on speech alone?
findings:
  - A probe on each encoder layer picked layer 16 as the most informative, at 88.4% accuracy.
  - "sBLIMP syntax accuracy was 0.498 after one epoch and 0.501 after two, close to the 0.5 of chance."
limitation: Compute allowed only two training epochs on Libri-Light, so the near-chance sBLIMP score says little either way about the tokenizer.
cover: ../../assets/projects/w2v-bert/cover.jpg
coverAlt: "Illustration of a microphone feeding a stack of encoder layers with one glowing layer, which turns into token cubes that feed a language-model block."
youtube: ""
figures:
  - src: ../../assets/projects/w2v-bert/w2v-bert-pipeline.png
    kind: method
    caption: Layer-16 features of w2v-BERT 2.0 are quantised with k-means into speech tokens that train a speech language model, evaluated on sBLIMP.
  - src: ../../assets/projects/w2v-bert/bert-layer-probe.png
    kind: result
    caption: Probe accuracy for each encoder layer; layer 16 is best at 88.4%.
links:
  code: https://github.com/Tayyab-Tahir1/Evaluating-w2v-BERT-2.0-Speech-Tokenizer-for-Speech-Models
---

We used the w2v-BERT 2.0 encoder as the tokenizer of a speech language model. A probe on each layer chose the
layer to quantise, k-means turned its features into discrete speech tokens, and a transformer language model
was trained on those tokens from LibriSpeech (100 h) and Libri-Light (60k h).
