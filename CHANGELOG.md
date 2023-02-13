#NotifictionType was changed:

-   success -> success
-   exclamation -> error
-   information -> warning
-   hint (new)
-   custom (new)

# Build version `0.2.*`

## Button sizes have been changed:

-   xsmall = 24px
-   small = 30px
-   medium = 36px
-   large = 42px

## Update sizes in your applications:

-   small -> xsmall

## MultiselectCheckboxes component was renamed:

-   MultiselectCheckboxes -> Picker

#Color palette was changed:

-   Basics.White -> Common.White
-   Basics.Background -> Additional.Greyscale[100]
-   Basics.LightestGrey -> Additional.Greyscale[300]
-   Basics.LightGrey -> Additional.Greyscale[400]
-   Basics.Grey -> Additional.Greyscale[700]
-   Basics.DarkGrey -> Additional.Greyscale[800]
-   Basics.DarkestGrey -> Additional.Greyscale[900]
-   Basics.Primary -> Basics.LightBlue[600]
-   Basics.SemanticAmber -> Basics.Amber[700]
-   Basics.SemanticLightGreen -> Basics.LightGreen[700]
-   Basics.SemanticRed -> Basics.Red[700]

#Color-names was changed accordingly:

-   basicsWhite -> common-white
-   basicsBackground -> additional-greyscale100
-   basicsLightestGrey -> additional-greyscale300
-   basicsLightGrey -> additional-greyscale400
-   basicsGrey -> additional-greyscale700
-   basicsDarkGrey -> additional-greyscale800
-   basicsDarkestGrey -> additional-greyscale900
-   basicsPrimary -> basics-lightblue600
-   basicsSemanticAmber -> basics-amber700
-   basicsSemanticLightGreen -> basics-lightgreen700
-   basicsSemanticRed -> basics-red700

#"background" & "color" prefixed color-names changed by the same principle

-   background-basicsWhite -> background-common-white
-   color-basicsWhite -> color-common-white

#FontColor palette removed

#Notification component updated

-   Position variants added: topLeft | top | topRight | bottomRight | bottom | bottomLeft
-   "bottomLeft" position set as default
-   "preventAutoClose" added to params prop
-   "Close all notifications" button added when notifications quantity > 1
-   "useNotification()" hook added

#Icons pack has been updated
**_Added_ icons to _action_ folder:**

-   Photo24
-   Refresh24

**_Added_ icons to _communication_ folder**

-   GeoTag24

**_Added_ icons to _file_ folder**

-   Attachment12
-   Download12
-   Export12
-   FileEml24
-   FileVideo24
-   Import12
-   Upload12

**_Added_ to _navigation_ folder:**

-   ChevronLeftLeft12
-   ChevronLeftLeft18
-   ChevronLeftLeft24
-   ChevronRightRight12
-   ChevronRightRight18
-   ChevronRightRight24

**_Removed_ from _table_ folder**

-   ColumnsSpecial18
-   GroupBySpecial

**_Renamed_ from _table_ folder**

-   ColumnsSpecial18 => Columns18
-   GroupBySpecial18 => GroupBy18
-   FiltrationSpecial18 => Filtration18
-   InfoFillSpecial18 => InfoFill18
-   InfoOutlineSpecial18 => InfoOutline18
-   SortAscSpecial18 => SortAsc18
-   SortDescSpecial18 => SortDesc18
-   SwapSpecial18 => Swap18

**New folders:**

_**colorful**_

-   AdaptationLogo18
-   AssessmentLogo18
-   AutointLogo18
-   BenefitsLogo18
-   CalendarLogo18
-   CarbonFootprintLogo18
-   CdpLogo18
-   CloudLogo18
-   CommunicationsLogo18
-   CompensationLogo18
-   CompetencyLogo18
-   ConnectLogo18
-   ContributeLogo18
-   CourseLogo18
-   CrmLogo18
-   CtcLogo18
-   DatahubLogo18
-   DeliveryCentralLogo18
-   DocumentsLogo18
-   ElementsLogo18
-   EpamsLogo18
-   EventsLogo18
-   ExitLogo18
-   FolderLogo18
-   GlobalMenuLogo18
-   GrowLogo18
-   HandbookLogo18
-   HeroesLogo18
-   ImLogo18
-   InfoLogo18
-   InfoportalLogo18
-   InviteLogo18
-   LearnLogo18
-   LearnStudioLogo18
-   LibraryLogo18
-   MenuLogo18
-   NovaV4Logo18
-   OpportunitesLogo18
-   OpportunitiesLogo18
-   OsmLogo18
-   ParkingLogo18
-   PasswordLogo18
-   PlusNewLogo18
-   PresaleLogo18
-   ProjectsLogo18
-   PulseV2Logo18
-   RecognitionLogo18
-   ReportPortalLogo18
-   ReportsLogo18
-   RsaLogo18
-   SignatureLogo18
-   Staffing2Logo18
-   StaffingLogo18
-   StaffingRadarLogo18
-   StafStreamLogo18
-   StoreLogo18
-   SupportLogo18
-   SvnLogo18
-   TalkLogo18
-   TelescopeLogo18
-   TimeLogo18
-   UpsaLogo18
-   VacationLogo18
-   VideoLogo18
-   WelcomeLogo18
-   ZoeLogo18

_**white**_

-   AdaptationLogo18
-   AssessmentLogo18
-   CdpLogo18
-   CommunicationsLogo18
-   CompensationLogo18
-   CompetencyLogo18
-   ConnectLogo18
-   CrmLogo18
-   DeliveryCentralLogo18
-   ExitLogo18
-   FeedbackLogo18
-   GrowLogo18
-   HealthLogo18
-   HeroesLogo18
-   ImLogo18
-   InfoportalLogo18
-   LearnLogo18
-   LibraryLogo18
-   MenuLogo18
-   NovaLogo18
-   PeopleProgrammsLogo18
-   PerfLogo18
-   ProjectsLogo18
-   PsaLogo18
-   PulseLogo18
-   RecognitionLogo18
-   TalKLogo18
-   TelescopeLogo18
-   ZoeLogo18

# Tooltip has been changed

-   overflow has two variants like dark and light
-   now overflow feature has dark variant by default

# Build version `0.5.*`

## Chip component has been updated according to design

### New Feature

#### Chip

-   Info
-   Drag and drop icon
-   Avatar source
-   Added 4 types of size

#### IconButton

-   Cursor changing

### Breaking changes

-   Uppercase feature has been removed
-   Avatar feature has been removed
-   Cursor feature has been removed
-   Delete Icon feature has been removed
-   Square chip component has been removed

### Deprecated, it should be removed in new minor version

#### Chip

-   Outline variant
-   Background color

### Icons pack has been updated

**_Added_ to _action_ folder**

-   History12
-   Schedule12
-   Tune12
-   Tune18
-   Clock18

**_Added_ to _content_ folder**

-   Plus12
-   Plus18
-   ClearOutline18
-   ClearOutline24

**_Added_ to _fav_n_rates_ folder**

-   Favorite12

**_Removed_ from _content_ folder**

-   AddOutline12

**_Renamed_ from _content_ folder**

-   Clear18 => ClearFill18
-   Clear24 => ClearFill24

### SnackbarNotification

-   SnackbarNotification component has been removed (use Notification component)### ExpansionPanel

-   Folder has been changed from `src/ExpandPanel` to `src/ExpansionPanel`

# Build version `0.6.*`

## Input

-   It was added new sizes for Input component: `xlagre` and `xxlarge`
-   For now according to design `small` 24px -> `xsmall`, `small` - 30 px

# Build version `0.8.*`

## NavigationMenu

-   Popover was changed with Popper
-   Remove props getTooltipContainer

## BreadCrumbs

-   Remove prop getContainerRef

## BreadcrumbsEllipsis

-   Remove prop containerRef

## Ellipsis

-   Remove prop containerRef
