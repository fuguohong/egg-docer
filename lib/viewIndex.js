/**
 * Created Date: 2020/7/24
 * Author: fgh
 * Description: 生成index.html
 */
'use strict';

module.exports = config => {
  const basePath = config.docer.prefix;
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${config.name}</title>
    <link rel="stylesheet" type="text/css" href="${basePath}/swagger-ui.css" >
    <link rel="icon" type="image/png" href="${basePath}/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="${basePath}/favicon-16x16.png" sizes="16x16" />
    <style>
      html
      {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }

      *,
      *:before,
      *:after
      {
        box-sizing: inherit;
      }

      body
      {
        margin:0;
        background: #fafafa;
      }
    </style>
  </head>

  <body>
    <div id="swagger-ui"></div>
    <script src="${basePath}/swagger-ui-bundle.js"> </script>
    <script src="${basePath}/swagger-ui-standalone-preset.js"> </script>
    <script>
    window.onload = function() {
      // Begin Swagger UI call region
      const ui = SwaggerUIBundle({
        url: "${basePath}/swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      })
      window.ui = ui
    }
  </script>
  </body>
</html>
  `;
};
