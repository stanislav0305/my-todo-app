import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ["./src/app/type-orm-database/data-source-for-migration.ts"],
    rules: {
      "fsd/no-public-api-sidestep":
        "off" /* Forbidden sidestep of public API when importing from "../../entities/tasks/types/task". 
      In src\app\type-orm-database\data-source-for-migration.ts
      TypeORM migration can work only with that paths formats ("../../entities/tasks/types/task")
      */,
    },
  },
  {
    files: ["./src/pages/**"],
    rules: {
      "fsd/no-segmentless-slices": "off",
      "fsd/forbidden-imports": "off", //Forbidden import from higher layer "app".
    },
  },
  {
    files: ["./src/widgets/**"],
    rules: {
      "fsd/no-public-api-sidestep": "off", //Forbidden sidestep of public API when importing from "@/src/app/providers/app-data-provider".
      "fsd/forbidden-imports": "off", //Forbidden import from higher layer "app".
      "fsd/insignificant-slice": "off", //This slice has only one reference in slice "widgets\word-list". Consider merging them.
    },
  },
  {
    files: ["./src/features/**"],
    rules: {
      "fsd/forbidden-imports": "off", //Forbidden import from higher layer "app".
      "fsd/insignificant-slice": "off", //This slice has only one reference in slice "widgets\word-list". Consider merging them.
      "fsd/segments-by-purpose": "off", //This segment's name should describe the purpose of its contents, not what the contents are.
      "fsd/repetitive-naming": "off", //Repetitive word "task" in slice names.
    },
  },
  {
    files: ["./src/entities/**"],
    rules: {
      "fsd/inconsistent-naming": "off",
      "fsd/segments-by-purpose": "off", //This segment's name should describe the purpose of its contents, not what the contents are.
    },
  },
  {
    files: ["./src/shared/**"],
    rules: {
      "fsd/public-api": "off", //This segment is missing a public API.
      "fsd/no-reserved-folder-names": "off", //Having a folder with the name "lib" inside a segment could be confusing because that name is commonly used for segments. Consider renaming it.
      "fsd/no-public-api-sidestep": "off", //Forbidden sidestep of public API when importing from "@/src/shared/theme/model"
      "fsd/forbidden-imports": "off", //Forbidden import from higher layer "app".
    },
  },
]);
