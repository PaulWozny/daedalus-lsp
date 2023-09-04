import type { Model  } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { DaedalusLanguageMetaData } from '../language/generated/module.js';
import { createDaedalusServices } from '../language/daedalus-module.js';
import { extractAstNode } from './cli-util.js';
import { generateJavaScript } from './generator.js';
import { NodeFileSystem } from 'langium/node';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createDaedalusServices(NodeFileSystem).Daedalus;
    const constantDef = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateJavaScript(constantDef, fileName, opts.destination);
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .version(require('../../package.json').version);

    const fileExtensions = DaedalusLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program.parse(process.argv);
}
