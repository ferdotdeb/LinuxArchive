<script setup></script>

<template>
  <!-- <link rel="stylesheet" href="./css/base.css">
  <link rel="stylesheet" href="./css/github-box.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet"> -->
  <div class="outer">
    <div class="box" id="box">
      <div class="header">
        <div class="octo" aria-hidden="true">
          <img
            alt=""
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          />
        </div>
        <div class="title">
          <div class="name" id="fileName">Loading…</div>
          <div class="meta" id="fileMeta">—</div>
        </div>
      </div>

      <div class="buttons">
        <a id="viewBtn" class="btn-link" target="_blank" rel="noopener noreferrer"
          >View on GitHub</a
        >
        <a id="rawBtn" class="btn-link" target="_blank" rel="noopener noreferrer">Raw</a>
        <button id="downloadBtn" type="button">Download</button>
        <button id="copyUrlBtn" type="button">Copy URL</button>
        <button id="copyContentBtn" type="button">Copy Content</button>
      </div>

      <div class="footer-note" id="footerNote"></div>
    </div>
  </div>
</template>

<style></style>
