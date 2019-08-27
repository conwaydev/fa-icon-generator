import { icon, library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronRight as fasChevronRight,
  faCheckCircle as fasCheckCircle
} from "@fortawesome/pro-solid-svg-icons";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import fs from "fs";

const writeFile = (path, data, opts = "utf8") => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, opts, err => {
      if (err) reject(err);
      else resolve();
    });
  });
};

function generateFontAwesomeModifiers() {
  const icons = [fasChevronRight, fasCheckCircle, faChevronRight];

  icons.forEach(async iconRef => {
    library.add(iconRef);

    const iconContents = icon({
      prefix: iconRef.prefix,
      iconName: iconRef.iconName
    }).abstract[0];

    fs.appendFile(
        "./Icon.twig",
        `
{% if "${iconRef.prefix}-${iconRef.iconName}" in modifier %}
  {% include 'atoms/SVG/SVG.twig' with {
    modifier: modifier,
    view_box: "${iconContents.attributes.viewBox}",
    path: "${iconContents.children[0].attributes.d}"
  } %}
{% endif %}`
    );

    const jsonContents = JSON.stringify(
        {
          modifier: `${iconRef.prefix}-${iconRef.iconName}`,
          icon: iconContents
        },
        null,
        "\t"
    );

    await writeFile(`./modifiers/Icon~${iconRef.prefix}-${iconRef.iconName}.json`, jsonContents);
  });
}

generateFontAwesomeModifiers();
