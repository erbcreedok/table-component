[![pipeline status](https://git.epam.com/epm-dce/sag/table-component/badges/master/pipeline.svg)](https://git.epam.com/epm-dce/sag/table-component)

# TABLE COMPONENTS

Component is written in TypeScript.

### Members of teams with merge rights

-   [Yerbol Syzdyk](https://telescope.epam.com/who/Yerbol_Syzdyk)
-   [Siarhei Zanimonets](https://telescope.epam.com/who/Siarhei_Zanimonets)

### Setup npm repository

1. Generate **YOUR_PERSONAL_TOKEN**:

    ```powershell
    curl -u user_name@epam.com:your_personal_password https://artifactory.epam.com/artifactory/api/npm/auth
    ```

2. Create `.npmrc` file in `/next-app` and replace **YOUR_PERSONAL_TOKEN** to token from previous step:

    ```
    Optional: you can use common place to keep your .npmrc in user scope or global scope
    ```

   https://docs.npmjs.com/cli/v8/configuring-npm/npmrc#files

    ```powershell
    @core:registry=https://artifactory.epam.com/artifactory/api/npm/epm-dce-npm/
    //artifactory.epam.com/artifactory/api/npm/epm-dce-npm/:always-auth=true
    //artifactory.epam.com/artifactory/api/npm/epm-dce-npm/:_auth=YOUR_PERSONAL_TOKEN
    @perf:registry=https://artifactory.epam.com/artifactory/api/npm/epm-dce-npm/
    //artifactory.epam.com/artifactory/api/npm/epm-dce-npm/:always-auth=true
    //artifactory.epam.com/artifactory/api/npm/epm-dce-npm/:_auth=YOUR_PERSONAL_TOKEN
    @health:registry=https://artifactory.epam.com/artifactory/api/npm/epm-dce-npm/
    //artifactory.epam.com/artifactory/api/npm/epm-dce-npm/:always-auth=true
    //artifactory.epam.com/artifactory/api/npm/epm-dce-npm/:_auth=YOUR_PERSONAL_TOKEN
    @projects:registry=https://artifactory.epam.com/artifactory/api/npm/EPM-PRJ-external-widgets/
    //artifactory.epam.com/artifactory/api/npm/EPM-PRJ-external-widgets/:always-auth=true
    //artifactory.epam.com/artifactory/api/npm/EPM-PRJ-external-widgets/:_auth=YOUR_PERSONAL_TOKEN
    @teams:registry=https://artifactory.epam.com/artifactory/api/npm/EPM-DMTM-npm/
    //artifactory.epam.com/artifactory/api/npm/EPM-DMTM-npm/:always-auth=true
    //artifactory.epam.com/artifactory/api/npm/EPM-DMTM-npm/:_auth=YOUR_PERSONAL_TOKEN
    @planner:registry=https://artifactory.epam.com/artifactory/api/npm/epm-dce-npm/
    //artifactory.epam.com/artifactory/api/npm/epm-dce-npm/:always-auth=true
    //artifactory.epam.com/artifactory/api/npm/epm-dce-npm/:_auth=YOUR_PERSONAL_TOKEN
    @okr:registry=https://artifactory.epam.com/artifactory/api/npm/epm-dce-npm/
    //artifactory.epam.com/artifactory/api/npm/epm-dce-npm/:always-auth=true
    //artifactory.epam.com/artifactory/api/npm/epm-dce-npm/:_auth=YOUR_PERSONAL_TOKEN
    ```


## USE IN PROJECTS

### INSTALL

from Artifactory

*don't forget to add `@core` to your .npmrc file*

```
npm i --save @core/table-component
```


## DEVELOPMENT

### INSTALL LOCALLY

```
git clone "https://gerrit.delivery.epam.com/table-component" && (cd "table-component" && mkdir -p .git/hooks && curl -Lo `git rev-parse --git-dir`/hooks/commit-msg https://gerrit.delivery.epam.com/tools/hooks/commit-msg; chmod +x `git rev-parse --git-dir`/hooks/commit-msg)

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
