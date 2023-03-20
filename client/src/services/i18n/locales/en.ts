// tslint:disable:max-line-length
export const en = {
  shared: {
    platformName: 'OilCase',
    ok: 'Ok',
    save: 'Save',
    cancel: 'Cancel',
    calculator: 'Calculator',
    download: 'Download curves',
    logout: 'Log out',
    profile: 'Profile',
    traceBuild: ' Manage your track',
    trace: 'Track',
    settings: 'Settings',
    experience: 'exp.',
    close: 'Close',
    instruction: 'Help',
    scatterPlot: 'Scatter plot',
    core: 'Core',
    samplesNumber: 'N samples',
    trendLine: 'trend line',
    editQuestionsForm: 'Edit survey form',
    explanation: 'Explanation',
    maxDepth: 'Max depth',
    minDepth: 'Min depth',
    increaseScale: 'Increase vertical tablet scale',
    decreaseScale: 'Decrease vertical tablet scale',
    warningOnlyTenPercentFromCoreData: 'You can exclude no more than 10% of the total number of core points',
  },
  notification: {
    goToLink: 'Follow the link',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSfnZKaioN3_Jv8sYxxSJY49cxO1GYro2qOsR65ADWYkhNWEvA/viewform',
  },
  curvesBrowser: {
    charts: 'Well logs',
    all: 'All',
    forWholeApp: 'For Whole App',
    forThisTab: 'For this tab',
  },
  chart: {
    logarithmic: 'log.',
    maxLimit: 'Max limit',
    minLimit: 'Min limit',
    limit: 'limit',
    changeColor: 'Change color',
  },
  noteChart: {
    comments: 'Comments',
    placeholder: 'Write here...',
    instructionMessage: 'To add a comment for the interval, click on the "+".',
  },
  structureChart: {
    structures: 'Structures',
    placeholder: 'Choose...',
    instructionMessage: 'To add a structure for the interval, click on the "+".',
  },
  verticalBarChart: {
    grainSize: 'Grain size',
    placeholder: 'Whrite grain size...',
    instructionMessage: 'To add grain size for the interval, click on the "+".',
  },
  editableList: {
    depth: 'Depth',
    visibility: 'Vis.',
    value: 'Value',
  },
  lithologySelectList: {
    shale: 'Shale',
    sand: 'Sand',
    coal: 'Coal',
    shalySand: 'Shaly sand',
    limestone: 'Limestone',
    siltstone: 'Siltstone',
  },
  warningMessages: {
    fieldsAreRequired: 'All fields are required',
    repeatIncorrect: 'The new password was incorrectly repeated. Please try again.',
    needToBuildTrace: 'It would be nice to build a track before moving on.',
    problemWithChangeTab: 'Problem! 1. The target tab must follow the order of the constructed track.'
      + ' 2. You can switch to saved tabs if the track has been rebuilt. 3. The current tab, from which'
      + ' the transition is made, must be saved. 4. Tabs up to the current one must be processed and saved.',
  },
  features: {
    curvesDownload: {
      number: '#',
      curve: 'Curve',
      calculatedCurvesForApp: 'Calculated curves for whole app',
      calculatedCurvesForTabs: 'Calculated curves for tabs',
      otherCurves: 'Other users curves',
      downloadAll: 'Download all',
      noCurves: 'There are no curves',
    },
    calculator: {
      calculatedCurves: 'Calculated curves',
      forWholeApp: 'For whole app',
      forThisTab: 'For this tab',
      selectForInsert: 'Select a curve or parameter to insert into an equation',
      calculatedOnlyForThisTab: 'Calculate only for this tab',
      needToInsertEquation: 'It would be a good idea to start by typing an expression before pressing the "="'
        + ' button to calculate the curve.',
      nameIsAlreadyExist: 'A curve with the same name already exists in application. Change the name and try again.',
      parenthesesBalance: 'The number of open parentheses must match the number of closing parentheses.',
      instructionDisclaimer: 'without translation',
      instructionLogicalOperatorsHeader: 'Logical operators',
      instructionLogicalOperators: 'without translation',
      instructionFunctionHeader: 'Functions',
      instructionFunction: 'without translation',
    },
    authorization: {
      wellcomeMessage: 'Welcome to OilCase Online Practice platform!',
      login: 'Login',
      email: 'E-mail',
      password: 'Password',
      signIn: 'Login',
    },
    privateArea: {
      trace: 'Track',
      userData: 'User info',
      name: 'Name',
      surname: 'Surname',
      specialty: 'Specialty',
      course: 'Course (REM / PE)',
      experience: 'Experience in GIS interpretation, years',
      expectations: 'What do you expect from this application?',
      changePassword: 'Change password',
      enterOldPassword: 'Enter old password',
      enterNewPassword: 'Enter new password',
      repeatNewPassword: 'Repeat new password',
      change: 'Change',
      needToFillUserInfo: 'It would be nice to fill in user information before going further.',
      needBoth: 'It would be nice to build a track and to fill in user information before moving on.',
      download: 'Click to download',
      downloadHeader: 'Download input data',
    },
    traceBuild: {
      trace: 'Track',
      instructionMessage: 'Build your own track by dragging and dropping the blocks from the column on the right',
      clearTrack: 'Clear track',
      saveTrack: 'Save track',
      start: 'Start',
      finish: 'Finish',
    },
    reservoirsDefinition: {
      firstQuestion: 'What do you think is called a reservoir?',
      secondQuestion: 'What are the qualitative features of reservoir determination do you know?',
      instructionMessage: 'Calculate a new discrete reservoir / non- reservoir plot using the conditional'
        + ' statements (if, then) in the Calculator. Please set a conditional expression in the Calculator,'
        + ' in accordance with which the presence of a reservoir and its absence is determined. After'
        + ' calculating, you can visualize it using the checkboxes in the column on the right.',
    },
    lithology: {
      lithology: 'Lithology',
      choose: 'Choose...',
      instructionMessage: 'To fill the lithology column, first set the lithology levels by clicking on the'
        + ' desired depth on the graphs on the left. Then click on the "+" and add lithology intervals. After'
        + ' adding intervals, edit them by clicking on the edit button (with a pencil) in each interval. You'
        + ' can delete all levels and intervals of lithology at once by clicking the second button next to the'
        + ' "+" in the header of this column. Or delete only levels selectively by clicking on the "x" in the'
        + ' depth column.',
    },
    shaliness: {
      shaliness: 'Shaliness',
      sandLine: 'sand line',
      shaleLine: 'shale line',
      instructionMessage: 'Click on the graphs on the left. The first click on any of the graphs in the right'
      + ' place sets the clay line, the second click - the sand line.'
      + ' You can delete all levels at once by clicking on the button next to the heading of this column. Or each'
      + ' level separately by pressing "X". The result of the work in the section should be the shaliness curve'
      + ' calculated for the tab and before saving it should be the only one rendered (as it will be needed in'
      + ' further calculations).',
    },
    baseParameters: {
      baseParameters: 'Base parameters',
      addParameter: 'Add parameter',
      name: 'Name',
      value: 'Value',
      calculationLink: 'Link to file with calculations',
      comments: 'Comments',
      message: 'Describe approach used for calculation of parameter. What is this parameter for?',
      warningMessage: 'You must fill in all parameter fields and delete parameters with empty fields before saving.',
    },
    porosity: {
      instructionMessage: 'First, you need to calculate several curves of porosity according to the assumed equation'
        + ' in the Calculator. The calculation of the curves should be in percent, since the points of porosity on the'
        + ' core are in percentages. After the curves have been calculated, they can be selected in the column on the'
        + ' right for viewing. When choosing curves, it is necessary to select a curve that fit the laboratory porosity'
        + ' data as accurately as possible. Core porosity data is visualized independently. Once the optimal curve is'
        + ' found, you need to leave it active and this curve will be used in further steps (check-box on).',
    },
    waterSaturation: {
      instructionMessage: 'First, you need to calculate several curves of water saturation according to the assumed'
        + ' equation in the Calculator. The calculation of the curves should be in percent, since the points of water'
        + ' saturation on the core are in percentages. After the curves have been calculated, they can be selected in'
        + ' the column on the right for viewing. When choosing curves, it is necessary to select a curve that fit the'
        + ' laboratory water saturation data as accurately as possible. Core water saturation data is visualized'
        + ' independently. Once the optimal curve is found, you need to leave it active and this curve will be used in'
        + ' further steps (check-box on).',
    },
    permeability: {
      instructionMessage: 'First, you need to calculate several curves of permeability according to the assumed equation'
        + ' in the Calculator. After the curves have been calculated, they can be selected in the column on the right for'
        + ' viewing. When choosing curves, it is necessary to select a curve that fit the laboratory permeability data as'
        + ' accurately as possible. Core permeability data is visualized independently. Once the optimal curve is found,'
        + ' you need to leave it active and this curve will be used in further steps (check-box on).',
    },
    cutOffs: {
      shaliness: 'Shaliness',
      gs: 'GS',
      porosity: 'Porosity',
      nt: 'NT',
      waterSaturation: 'W.satur.',
      gop: 'GP',
      permeability: 'Permeab.',
      gp: 'GP',
      np: 'NP',
      inputValues: 'Input values',
      calculatedValues: 'Calculated values',
      apply: 'Apply',
      shaleCutOff: 'Shale cut-off',
      porosityCutOff: 'Porosity cut-off',
      waterSaturationCutOff: 'Water saturation cut-off',
      permeabilityCutOff: 'Permeability cut-off',
      grossSand: 'Gross thickness (GS), m',
      netThickness: 'Net thickness (NT), m',
      grossOilPay: 'Gross pay (GP), m',
      grossPay: 'Gross pay (GP), m',
      netPay: 'Net pay (NP), m',
      grossInterval: 'Gross interval (automatically based on previously calculated reservoirs), m',
      instructionMessage: '1. Shale volume, porosity, water saturation and permeability curves are taken automatically'
        + ' from the previously finished sections. 2. If the columns with these curves are empty, it means that you'
        + ' did not calculate them in the previous steps, or did not mark the curves (did not visualize) when saving'
        + ' the tab. 3. If you visualize several curves, the first of the visualized ones will be taken. 4. In order'
        + ' to finish this section and use the necessary curves, you need to rebuild the track and go through the'
        + ' corresponding sections. 5. The total thickness is taken automatically from the section ‘Reservoir intervals’'
        + ', if it is not available before the current tab, you also need to rebuild the route. The first of the rendered'
        + ' discrete curves will be taken. 6. To build thickness - click the ‘Apply’ button. 7. If the boundary value is'
        + ' not specified, the field must be empty, since 0 is also a value and is involved in calculations.',
    },
    fluidsType: {
      fluid: 'Fluid',
      question: 'How to determine the type of fluid that fills the pore space of a reservoir?',
      instructionMessage: 'To fill the fluid column, first set the fluid levels by clicking on the desired depth on'
        + ' the graphs on the left. Then click on the "+" and add fluid intervals. After adding intervals, edit them'
        + ' by clicking on the edit button (with a pencil) in each interval. You can delete all levels and intervals'
        + ' of fluids at once by clicking the second button next to the "+" in the header of this column. Or delete'
        + ' only levels selectively by clicking on the "x" in the depth column. Also, do not forget to fill in the'
        + ' column with the explanation for each interval to the right.',
      secondInstructionMessage: 'Intervals are taken automatically from the column on the left. Just edit the'
        + ' content of the intervals.',
      selectorPlaceholder: 'Choose type of the level...',
      fluidBoundaryLevel: 'Fluid boundary level',
      oilWaterContactLevel: 'Oil water contact',
      gasOilContactLevel: 'Gas oil contact',
      oil: 'Oil',
      water: 'Water',
      oilWithWater: 'Oil with water',
      waterWithOil: 'Water with oil',
      owc: 'OWC',
      goc: 'GOC',
    },
    perforationIntervals: {
      perforation: 'Perf. intervals',
      perforationInterval: 'Perf. int.',
      question: 'What does the position of perforation intervals in producing wells affect?',
      instructionMessage: 'To fill the perforation intervals, first set the perforation levels by clicking on the'
        + ' desired depth on the graphs on the left. Then click on the "+" and add perforation intervals. After adding'
        + ' intervals, edit them by clicking on the edit button (with a pencil) in each interval. You can delete all'
        + ' levels and intervals of perforation at once by clicking the second button next to the "+" in the header of'
        + ' this column. Or delete only levels selectively by clicking on the "x" in the depth column. Also, do not'
        + ' forget to fill in the column with the explanation for each interval to the right.',
      secondInstructionMessage: 'Intervals are taken automatically from the column on the left. Just edit the content'
        + ' of the intervals.',
    },
    depositionalEnvironment: {
      coreLithology: 'Core lithology',
      grainSize: 'Grain size',
      depositionalStructures: 'Depositional structures',
      coreDescription: 'Core description',
      instructionMessage: 'To add a lithology interval click on the "+".',
      secondInstructionMessage: 'Intervals are taken automatically from core lithology. Just edit the content of each interval.',
      thirdInstructionMessage: 'Describe below the depositional environment in which your sand body was formed. Explain'
        + ' your answer. Also leave a link to the 3D block diagram (link to google disk or another cloud).',
      result: 'Result',
      bioturbationStructures: 'Bioturbation',
      climbingCurrentRipples: 'Climbing structures',
      crossBedding: 'Cross lamination',
      currentRipples: 'Current ripple',
      doubleMudDrapes: 'Double mud drapes',
      escapeStructures: 'Water escape structures',
      flameStructures: 'Flame structures',
      flatLamination: 'Horizontal lamination',
      flazerBedding: 'Flazer bedding',
      fluidMuds: 'Fluid muds', //
      gradatedBedding: 'Graded bedding',
      hcs: 'Hcs', //
      lenticularBedding: 'Lenticular bedding', //
      loadCast: 'Slump structures',
      softSedimentDeformation: 'Deformation structures',
      troughCrossBedding: 'Trough cross bedding',
      waveRipples: 'Wave ripple',
      wavyLamination: 'Wavy lamination', //
      incorrectInterval: 'Interval boundaries are not entered correctly',
    },
    analogueField: {
      whatIsAnalogueField: 'What analogue field is? Write your understanding of this term.',
      whatIsMainParametrs: 'What parameters are key when choosing an analogue field?',
      whatIsUsefulInfo: 'What useful information can be extracted from an analogue field?',
      analogueFieldName: 'Enter the name of the analog field for your facility.',
      explanation: 'Explain your answer below.',
      gisScreenshotLink: 'Leave below the link (cloud) for a screenshot of a well logging curve'
        + ' that describes the physical properties of a reservoir in an analogue field.',
      sourcesLink: 'Leave below the link to the sources that describe the analogue deposit (articles etc.).',
    },
    summarySection: {
      resultLogView: 'Result log view',
      createResultLog: 'Create result log view by marking the desired data in the column on the right.',
      calculationsAndRecommendations: 'STOIIP calculations and recommendations for development strategy',
      writeSomeRecommendations: 'Write some recommendations for development strategy and STOIIP value.',
      expand: 'Expand',
      collapse: 'Collapse',
      recommendations: 'Your recommendations for development strategy:*',
      stoiip: 'Estimate STOIIP in million tons in standard conditions:',
      recoveryFactor: 'Recovery factor:',
      oilPrice: 'Oil price:',
      profit: 'The oil company will make a profit:',
      warning: 'This point, as the name suggests, should be the last on the track. What do you think? If'
        + ' you agree, rebuild the track.',
      lithologyDataSource: 'The data is taken from the lithology definition tab.',
      fluid: 'Fluid',
      fluidDataSource: 'The data is taken from the tab for determining the type of fluid and OWC.',
      perforation: 'Perf. int.',
      perforationDataSource: 'The data is taken from the tab for defining perforation intervals.',
      congratulations: 'Congratulations! You have completed the entire route. A check will show whether it is correct or not. We want to improve '
        + 'our application, so your opinion about it is very important to us. Please leave your feedback by filling out the form '
        + 'at the link https://docs.google.com/forms/d/e/1FAIpQLSfnZKaioN3_Jv8sYxxSJY49cxO1GYro2qOsR65ADWYkhNWEvA/viewform'
        + 'Thank you for participating!',
    },
  },
  tabs: {
    reservoirIntervals: { text: 'Reservoir intervals', altText: 'Reservoir intervals' },
    lithology: { text: 'Lithology', altText: 'Lithology' },
    shaliness: { text: 'Shaliness', altText: 'Shaliness' },
    porosity: { text: 'Porosity', altText: 'Porosity' },
    waterSaturation: { text: 'Water saturation', altText: 'Water saturation' },
    permeability: { text: 'Permeability', altText: 'Permeability' },
    cutOffs: { text: 'Cut-offs', altText: 'Cut-offs' },
    baseParameters: { text: 'Base parameters (a, m, n, Rw)', altText: 'Base parameters' },
    fluidsType: { text: 'Type of fluids and contacts', altText: 'Type of fluids and contacts' },
    perforationIntervals: { text: 'Perforation intervals', altText: 'Perforation intervals' },
    analogueField: { text: 'Analogue field', altText: 'Analogue field' },
    depositionalEnvironment: { text: 'Depositional environment', altText: 'Depositional environment' },
    conclusions: {
      text: 'Conclusions and recommendations',
      altText: 'Conclusions and recommendations',
    },
  },
};
