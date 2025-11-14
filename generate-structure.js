// generate-structure.js
import fs from 'fs/promises';
import path from 'path';

const structure = {
  ".env.example": "",
  "package.json": "",
  "prisma": {
    "schema.prisma": "",
    "seed.ts": ""
  },
  "src": {
    "app": {
      "(marketing)": {
        "page.tsx": ""
      },
      "dashboard": {
        "page.tsx": ""
      },
      "campaigns": {
        "new": {
          "page.tsx": ""
        }
      },
      "flyer": {
        "[id]": {
          "page.tsx": ""
        }
      },
      "api": {
        "campaigns": {
          "route.ts": ""
        },
        "contacts": {
          "route.ts": ""
        },
        "upload": {
          "route.ts": ""
        },
        "flyer": {
          "render": {
            "route.ts": ""
          }
        },
        "whatsapp": {
          "send": {
            "route.ts": ""
          }
        }
      }
    },
    "components": {
      "ContactPicker.tsx": "",
      "CostEstimator.tsx": "",
      "FlyerPreview.tsx": "",
      "WhatsAppMessagePreview.tsx": ""
    },
    "lib": {
      "db.ts": "",
      "validate.ts": "",
      "storage.ts": ""
    },
    "providers": {
      "whatsapp": {
        "index.ts": "",
        "BaileysProvider.ts": "",
        "TwilioProvider.ts": ""
      }
    },
    "services": {
      "llm": {
        "index.ts": "",
        "costing.ts": ""
      },
      "campaign.ts": ""
    },
    "styles": {
      "globals.css": ""
    }
  },
  "tsconfig.json": ""
};

async function createStructure(basePath, obj) {
  for (const [name, value] of Object.entries(obj)) {
    const fullPath = path.join(basePath, name);
    if (typeof value === "string") {
      await fs.writeFile(fullPath, value);
      console.log(`Created file: ${fullPath}`);
    } else {
      await fs.mkdir(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
      await createStructure(fullPath, value);
    }
  }
}

(async () => {
  const root = process.cwd();
  await createStructure(root, structure);
  console.log("✅ Project structure created.");
})();
