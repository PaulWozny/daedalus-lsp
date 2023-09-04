import {
  clearDocuments,
  expectNoIssues,
  expectError,
  expectWarning,
  parseHelper,
  validationHelper,
} from "langium/test";
import { createDaedalusServices } from "../src/language/daedalus-module.js"; //'../src/language-server/hello-world-module';
import { Model } from "../src/language/generated/ast.js";
import { EmptyFileSystem } from "langium";
import { afterEach, describe, test } from "vitest";

const services = createDaedalusServices(EmptyFileSystem);
const parse = parseHelper(services.Daedalus);
const locator = services.Daedalus.workspace.AstNodeLocator;
const validate = validationHelper<Model>(services.Daedalus);

describe("Parse Deadalus", () => {
  // necessary, otherwise test runs can interfere!!
  afterEach(() => {
    clearDocuments(services.Daedalus);
  });

  describe("Parse integer constants", () => {
    test("Declaration has case insensitive keywords", async () => {
      const validation = await validate(`
    const int FIGHT_NONE = 0;
    CONST int FIGHT_LOST = 1;
    const INT CRIME_THEFT = 3;
    `);
      expectNoIssues(validation);
    });

    test.todo("Declaration with lowercase identifier", async () => {
      const validation = await validate(`
    const int fight_none = 0;
    `);
      expectWarning(validation, "Constant name should be uppercase.", {
        // node: validation.document.diagnostics?.at(0).,
        property: "name",
      });
    });

    test("Declaration that references another constant", async () => {
      const validation = await validate(`
    const int FIGHT_NONE = 0;
    const int FIGHT_LOST = FIGHT_NONE + 1;
    `);
      expectNoIssues(validation);
    });

    test("Operation on constants", async () => {
      const validation = await validate(`
    const int FIGHT_NONE = 0;
    const int FIGHT_LOST = FIGHT_NONE + 1;
    const int FIGHT_WON = 3 - FIGHT_LOST;
    const int FIGHT_CANCEL = FIGHT_WON + 1;
    `);
      expectNoIssues(validation);
    });
  });

  describe("Parse string constants", () => {
    test("Declaration has case insensitive keywords", async () => {
      const validation = await validate(`
      const string CURSOR_TEXTURE = "CURSOR.TGA";
      const STRING PRINT_LINESEPERATOR = "~";
      CONST string PIR_1326_DAN_DUELWP = "P17_HAVEN_ARENA_01";
      `);
      expectNoIssues(validation);
    });

    test.todo("Declaration can't be initialized with integer", async () => {
      const validation = await validate(`
      const string CURSOR_TEXTURE = 0;
      `);
      expectError(validation, "Constant declaration cannot be initialized.", {
        // node: validation.document.diagnostics?.at(0).,
        property: "name",
      });
    });
  });

  describe("Parse variable declaration", () => {
    test("String declaration", async () => {
      const validation = await validate(`
      var string M_PARFONTNAME;
      `);
      expectNoIssues(validation);
    });

    test("Multiple string declarations", async () => {
      const validation = await validate(`
      var string M_PARFONTNAME, M_PARBACKPIC, M_PARALPHAMODE;
      `);
      expectNoIssues(validation);
    });

    test("String array declaration", async () => {
      const validation = await validate(`
      var string M_PARTEXT[10];
      `);
      expectNoIssues(validation);
    });

    test.todo("Declaration and immediate assignment is forbidden", async () => {
      const validation = await validate(`
      var string s = "Hello World!";
      `);
      expectError(validation, "Variable declaration cannot be initialized.", {
        // node: validation.document.diagnostics?.at(0).,
        property: "name",
      });
    });

    test("Single integer declaration", async () => {
      const validation = await validate(`
      var INT M_PARDIMY;
      `);
      expectNoIssues(validation);
    });

    test("Multiple integer declarations", async () => {
      const validation = await validate(`
      var int M_PARALPHA, M_PARTYPE;
      `);
      expectNoIssues(validation);
    });

    test("Integer array declaration", async () => {
      const validation = await validate(`
      var int M_PARONSELACTION[5];
      `);
      expectNoIssues(validation);
    });
  });

  describe("Parse variable declaration and assignment", () => {
    test("String assignment", async () => {
      const validation = await validate(`
      var string M_PARFONTNAME;
      M_PARFONTNAME = "fontname.tga";
      `);
      expectNoIssues(validation);
    });

    test("Integer assignment", async () => {
      const validation = await validate(`
      var int M_PARALPHA;
      M_PARALPHA = 12;
      `);
      expectNoIssues(validation);
    });

    test("Multiple integer assignments", async () => {
      const validation = await validate(`
      var int M_PARALPHA, M_PARTYPE;
      M_PARALPHA = 12;
      M_PARTYPE = 1;
      `);
      expectNoIssues(validation);
    });
  });

  //   test('Single declaration and single reference', async () => {
  //     const validation = await validate(`
  //      person Anna Hello Anna!
  //     `);
  //     expectNoIssues(validation);
  //   });

  //   test('Multiple declarations and multiple references', async () => {
  //     const validation = await validate(`
  //    person Anna
  //    Hello Peter!
  //    person Bob
  //    person Peter
  //    Hello Anna!
  //    Hello Anna!
  //   `);
  //     expectNoIssues(validation);
  //   });
});

// describe('Unsuccessful parser tests', () => {
//   // necessary!!
//   afterEach(() => {
//     clearDocuments(services.Daedalus);
//   });

//   test('Declaration with lowercase name', async () => {
//     const validation = await validate(`
//      person anna person Peter
//     `);
//     // walk through parsed model to determine culprit of warning
//     const person = (validation.document.parseResult.value.[0] as Person);
//     expectWarning(validation, 'Person name should start with a capital.', {
//       node: person,
//       property: 'name'
//   });
//   });

//   // TODO: Here we should get a cross-reference error!
//   // How to express this expectation in the test?
//   test('Wrong Reference', async () => {
//     const validation = await validate(`
//      person Anna
//      Hello Peter!
//     `);
//     expectNoIssues(validation); // TBC
//   });
// });
