[![pipeline status](https://git.epam.com/epm-dce/sag/table-component/badges/master/pipeline.svg)](https://git.epam.com/epm-dce/sag/table-component)

# TABLE COMPONENTS

Component is written in TypeScript.

### Members of teams with merge rights

-   [Yerbol Syzdyk](https://telescope.epam.com/who/Yerbol_Syzdyk)
-   [Siarhei Zanimonets](https://telescope.epam.com/who/Siarhei_Zanimonets)

## USE IN PROJECTS

### INSTALL

From GitLab

```
npm i --save git+https://git.epam.com/epm-dce/sag/table-component.git
```


## DEVELOPMENT

### INSTALL LOCALLY

```
git clone git@git.epam.com:epm-dce/sag/table-component.git
or
git clone https://git.epam.com/epm-dce/sag/table-component.git

cd table-component
npm i
```

### RUN STORYBOOK

```
npm run storybook
```

Open in browser: `http://localhost:6009/`

#### DEV LOCAL IN PROJECT USAGE

-   git clone this into the `table_component_folder` locally
-   follow install/setup steps above
-   use `npm i table_component_folder` in your `your_app_folder` where you plan to use components
-   if you encounter issues with `react` duplications, one way to fix:
    > go to table_component `table_component_folder` and run `npm link ../your_app_folder/node_modules/react`

## Testing

Firstly, start storybook by command `npm run storybook` and start docker application (wait until it will be up)
Secondly, in separate terminal start docker container with chrome inside by command `npm run docker:chrome`

-   For run tests of all stories: `npm run test:storyshots`
-   For run tests of one story: `npm run test:storyshots -- --story=Buttons`
-   For update screenshots: `npm run test:storyshots -- -u`
-   For update screenshots of one story: `npm run test:storyshots -- --story=Buttons -u`

## Generate documentation correctly

-   Use destructed components:<br>
    <b>right</b> &mdash; export const Button = memo(...) <br>
    <b>wrong</b> &mdash; export const Button = React.memo(...)
-   If you use HOC, eg

    > export const TimelineStepper = withStyles(styles)(TimelineStepperRoot)

    export "root" component

    > export const TimelineStepperRoot = memo(...

    and use it as a "component" in stories

    > .addDecorator(...)<br>
    > .addParameters({component: TimelineStepperRoot})<br>
    > .add(...)

-   To create a description or to set "default" value for a prop use JSDoc.<br>
    See examples at https://github.com/strothj/react-docgen-typescript-loader
-   You can clean cache manually if it needed by removing folder ./.storybook/typescript-docgen-cache-loader/cache
