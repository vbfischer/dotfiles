/**
 @singleton
*/
Ext.define('Beacon.manager.case.CaseFactoryManager', {
  alternateClassName: 'CaseFactoryManager',

  requires: [
    'Beacon.store.domain.cases.CasesTypeStore',
    'Beacon.manager.code.CodeAttributeManager',
    'Beacon.store.domain.code.CodeFamilyStore',
    'Beacon.manager.store.StoreManager',
    'Beacon.store.domain.status.StatusStore',
    'Beacon.model.activity.ActivityCompleteModel',
    'Beacon.model.opportunity.OpportunityCompleteModel',
    'Beacon.store.domain.country.CountryStore',
    'Beacon.model.domain.contact.ContactSummaryModel',
    'Beacon.model.appointment.AppointmentModel',
    'Beacon.manager.code.CodeManager',
    'Beacon.model.domain.contact.ContactAddressModel',
    'Beacon.model.domain.task.TaskSummaryModel',
    'Beacon.model.activity.ActivityAttributeModel',
    'Utils.Ext'
  ],

  singleton: true,
  config: {},

  getDefaultAppointmentDateRange: function() {
    var currentDateTime = new Date();
    var currentYear = currentDateTime.getFullYear();
    var currentMonth = currentDateTime.getMonth();
    var currentDay = currentDateTime.getDate();
    var currentHour = currentDateTime.getHours();
    var currentMin = currentDateTime.getMinutes();

    if(currentMin < 30) {
      currentMin = 30;
    } else {
      currentMin = 0;
      currentHour = currentHour + 1;
    }

    var startDate = new Date(currentYear, currentMonth, currentDay, currentHour, currentMin, 0);
    var endDate = Ext.Date.add(startDate, Ext.Date.MINUTE, 30);

    return {
      StartDate: startDate,
      EndDate: endDate
    };

  },

  createAppointmentSync: function(practiceModel, dateRange) {
    var theCase = Ext.create('Beacon.model.appointment.AppointmentModel');
    theCase.set('customerId', practiceModel.get('sapId'));
    theCase.set('sapId', practiceModel.get('sapId'));
    theCase.set('customerName', practiceModel.getName());
    theCase.set('caseType', CaseType.APPOINTMENT);

    var jurisdictionCode = this.getJurisdictionCode(practiceModel);

    theCase.addCode(jurisdictionCode);

    theCase.addCode(CodeManager.findCodeByCodeTypeAndValue('CASE_TYPE',
      'APPOINTMENT'));

    var salesRoleCode = CodeManager.findCodeByCodeTypeAndValue('SALES_ROLE',
      'GENERAL');
    theCase.addCode(salesRoleCode);
    theCase.addCode(this.getSalesUserType(false));

    var method = this.findCode('COMMUNICATION_METHOD', 'APPOINTMENT_342_CF',
      theCase);
    if (method) {
      theCase.addCode(method);
      theCase.set('method', method);
    }

    theCase.set('status', Beacon.model.domain.status.StatusModel.parseValue(1));
    theCase.set('priority', Beacon.model.domain.priority.PriorityModel.parseValue(
      1));

    var defaultStartDate = dateRange ? dateRange.StartDate : new Date();
    var defaultEndDate = dateRange ? dateRange.EndDate :  new Date();

    theCase.set('scheduledStart', defaultStartDate);
    theCase.set('scheduledEnd', defaultEndDate);

    theCase.set('scheduledStartDate', defaultStartDate);
    theCase.set('scheduledStartTime', defaultStartDate);

    theCase.set('scheduledEndDate', defaultEndDate);
    theCase.set('scheduledEndTime', defaultEndDate);

    var accountDetails = practiceModel.practiceAccountDetail;
    if(!accountDetails) {
      accountDetails = practiceModel.get('accountDetails');
    }

    if (accountDetails) {

      var locationStr = accountDetails.get('name') + ", SAP: " +
        practiceModel.get('sapId');

      locationStr += ', ' + accountDetails.get('address1');
      if (accountDetails.get('address2')) {
        locationStr += " " + accountDetails.get('address2');
      }

      locationStr += ', ' + accountDetails.get('city') + ', ' +
        accountDetails.get('state') + ', PH: ' + accountDetails.get(
          'phoneNumber');

      theCase.set('location', locationStr);
    }

    theCase.populateCodes();

    return theCase;
  },
  /**
   * Create a new {@link Beacon.model.appointment.AppointmentModel} using the specified practice model.
   * @param {Beacon.model.practice.PracticeModel} practiceModel
   * @return {Beacon.model.appointment.AppointmentModel} The new appointment model.
   */
  createAppointment: function(practiceModel, dateRange, callback) {
    var me = this,
      codeFamilyId = CaseType.APPOINTMENT.get('codeFamilyId');

    Deft.Promise.all([
        this.loadCodeFamilyData(codeFamilyId),
        this.loadCodeFamilyData(422)
    ]).then({
      success: function(records) {
        var theCase = me.createAppointmentSync(practiceModel, dateRange);
        callback(theCase, true);
      }
    }).done();
  },

  createAlert: function(practiceModel) {
    var theAlert = Ext.create('Beacon.model.alert.PracticeAlertModel');

    theAlert.set('spaId', practiceModel.get('sapId'));
    theAlert.set('customerId', practiceModel.get('sapId'));
    theAlert.set('isDeleted', false);

    return theAlert;
  },

  createOpportunity: function(practiceModel) {
    Bn.getInstance('DomainCasesTypeStore'); //Make sure store is loaded
    var me = this,
      outcomeCode,

      theCase = Ext.create(
        'Beacon.model.opportunity.OpportunityCompleteModel');

    theCase.set('sapId', practiceModel.get('sapId'));
    theCase.set('customerId', practiceModel.get('sapId'));
    theCase.set('customerName', practiceModel.getName());
    theCase.setId(null);

    //Opportunity case type
    theCase.set('caseType',
      CaseType.OPPORTUNITY);

    theCase.set('estCloseDate', new Date());

    theCase.addCode(me.getJurisdictionCode(practiceModel));
    theCase.addCode(me.getSalesUserType());

    theCase.set('currencyCd', me.getDefaultCurrencyCode(practiceModel));

    outcomeCode = this.findCode('OUTCOME', 'IN_PROCESS', theCase);
    // log.debug("outcomeCode="+outcomeCode);

    //theCase.set('OUTCOME',outcomeCode)
    theCase.addCode(outcomeCode);

    theCase.set('status', Beacon.model.domain.status.StatusModel.parseValue(1));
    theCase.set('priority', Beacon.model.domain.priority.PriorityModel.parseValue(
      1));

    theCase.populateCodes();

    return theCase;
  },

  createActivityFromCase: function(practiceModel, theCase) {
    var newActivity = this.createActivity(practiceModel, false);

    return newActivity;
  },

  /**
   * Create a new Sales Activity case.
   * Note: assumes all edit data has been retrieved already, and the required
   * codeFamily, etc are available.
   */
  createActivity: function(practiceModel, isFts) {
    Bn.getInstance('DomainCasesTypeStore'); // Make sure store is loaded
    Bn.getInstance('DomainActivityTypeStore'); // Make sure store is loaded
    Bn.getInstance('DomainCodeFamilyStore');
    var me = this,
      theCase = Ext.create('Beacon.model.activity.ActivityCompleteModel');


    theCase.set('sapId', practiceModel.get('sapId'));
    theCase.set('customerId', practiceModel.get('sapId'));
    theCase.set('customerName', practiceModel.getName());
    theCase.setId(null);

    var jurisdictionCode = me.getJurisdictionCode(practiceModel);

    //Activity case type
    if (isFts === true) {
      theCase.set('caseType',
        CaseType.FTS_SALES_ACTIVITY);
      var caseCode = theCase.addCode(CodeManager.findCodeByCodeTypeAndValue(
        'CASE_TYPE',
        'FTS_SALES_ACTIVITY'));
    } else {
      theCase.set('caseType',
        CaseType.SALES_ACTIVITY);
      theCase.addCode(CodeManager.findCodeByCodeTypeAndValue('CASE_TYPE',
        'SALES_ACTIVITY'));
    }

    theCase.set('actualStart', new Date());

    theCase.addCode(jurisdictionCode);
    var salesUserType = me.getSalesUserType(isFts);
    theCase.addCode(salesUserType);
    /*
		theCase.addCode(codeFamilyStore.findCodeByCodeTypeAndValue('RIDE_WITH_TYPE',
																   'RIDE_WITH_NONE'));
        */
    theCase.addCode(CodeManager.findCodeByCodeTypeAndValue('RIDE_WITH_TYPE',
      'RIDE_WITH_NONE'));

    theCase.set('status', Beacon.model.domain.status.StatusModel.parseValue(3));
    theCase.set('priority', Beacon.model.domain.priority.PriorityModel.parseValue(
      1));
    theCase.set('currencyCd', me.getDefaultCurrencyCode(practiceModel));

    var firstTopic = Ext.create('Beacon.model.activity.ActivityTopicModel');
    firstTopic.set('activityType',
      ActivityType.TOPIC);
    firstTopic.addCode(caseCode);

    firstTopic.addCode(CodeManager.findCodeByCodeTypeAndValue('ACTIVITY_TYPE',
      'TOPIC'));
    StoreManager.getRecord('DomainCodeFamilyStore', 422, function() {
      //firstTopic.codeModels().addCode(me.getJurisdictionCode(practiceModel));
      firstTopic.codeModels().add(jurisdictionCode);
    });

    firstTopic.codeModels().add(salesUserType);

    firstTopic.set('statusId', Beacon.model.domain.status.StatusModel.parseValue(
      3));
    firstTopic.set('actionStart', new Date());
    firstTopic.set('seqNum', 0);
    // firstTopic.set('communicationSession',
    // 			   Ext.create('Beacon.model.domain.CommunicationSession',
    // 						  {sapId: sapId,
    // 						   sessionType: outbound,
    // 						   communicationMethod: visit}));

    theCase.activities().add(firstTopic);

    theCase.populateCodes();
    firstTopic.populateCodes();

    return theCase;
  },

  createImportedTask: function(practiceModel, importedTask, isFts) {
    var theTask = this.createTask(practiceModel, isFts),
      statusStore = Bn.getInstance('DomainStatusStore'),
      priorityStore = Bn.getInstance('DomainPriorityStore');

    if (importedTask && importedTask.get) {
      var taskStatus = importedTask.get('status');

      if (taskStatus === "Completed") {
        theTask.set('status', statusStore.findRecord('displayString',
          'Closed'));
      }

      var taskPriority = importedTask.get('priority');
      if (taskPriority === 'High') {
        theTask.set('priority', priorityStore.findRecord('displayString',
          taskPriority));
      }

      var taskDescription = '';

      if (importedTask.get('subject')) {
        taskDescription = 'Subject: ' + importedTask.get('subject');
      }

      if (importedTask.get('body')) {
        taskDescription += '\nNotes: ' + importedTask.get('body');
      }

      theTask.set('description', taskDescription);

      if (importedTask.get('endDate')) {
        theTask.set('dueDateDate', importedTask.get('endDate'));
      }

      if (importedTask.get('dueDateTime')) {
        theTask.set('dueDateTime', importedTask.get('dueDateTime'));
      }

      if (importedTask.get('itemId')) {
        theTask.set('exchItemId', importedTask.get('itemId'));
      }

      if (importedTask.get('itemKey')) {
        theTask.set('exchItemChangeKey', importedTask.get('itemKey'));
      }
    }

    return theTask;
  },

  createTask: function(practiceModel, isFts) {
    var me = this,
      theTask = Ext.create('Beacon.model.domain.task.TaskSummaryModel'),
      caseTypeStore = Bn.getInstance('DomainCasesTypeStore'),
      codeFamilyStore = Bn.getInstance('DomainCodeFamilyStore'),
      activityTypeStore = Bn.getInstance('DomainActivityTypeStore'),
      activity = Ext.create('Beacon.model.activity.ActivityTopicModel'),
      activityAttribute = Ext.create(
        'Beacon.model.activity.ActivityAttributeModel');

    theTask.setId(null);
    theTask.set('sapId', practiceModel.get('sapId'));
    theTask.set('customerId', practiceModel.get('sapId'));
    theTask.set('customerName', practiceModel.getName());
    theTask.set('caseType', CaseType.SALES_TASK);

    theTask.addCode(CodeManager.findCodeByCodeTypeAndValue('CASE_TYPE',
      'SALES_TASK'));
    theTask.addCode(CodeManager.findCodeByCodeTypeAndValue('SALES_ROLE',
      'GENERAL'));

    theTask.addCode(me.getSalesUserType(isFts));
    theTask.addCode(me.getJurisdictionCode(practiceModel));
    theTask.set('status', Beacon.model.domain.status.StatusModel.parseValue(1));
    theTask.set('priority', Beacon.model.domain.priority.PriorityModel.parseValue(
      1));

    activity.set('activityType', ActivityType.SALES_TASK);
    activity.set('statusId', Beacon.model.domain.status.StatusModel.parseValue(
      1));
    activity.set('actionStart', new Date());
    activity.set('seqNum', 0);

    activityAttribute.set('attributeTypeId', 39);
    activityAttribute.set('name', 'ReminderTime');
    activity.activityAttributes().add(activityAttribute);

    theTask.activities().add(activity);
    theTask.populateCodes();
    activity.populateCodes();

    return theTask;
  },

  addActivityTopic: function(theCase) {
    var newTopic = Ext.create('Beacon.model.activity.ActivityTopicModel'),
      store = Bn.getInstance('DomainActivityTypeStore'); // Make sure store is loaded

    //Topic activity type
    newTopic.set('activityType',
      ActivityType.TOPIC);

    newTopic.addCode(theCase.getCode('CASE_TYPE'));
    newTopic.addCode(CodeManager.findCodeByCodeTypeAndValue('ACTIVITY_TYPE',
      'TOPIC'));
    newTopic.addCode(theCase.getCode('JURISDICTION'));
    newTopic.addCode(theCase.getCode('SALES_USER_TYPE'));
    newTopic.set('statusId', Beacon.model.domain.status.StatusModel.parseValue(
      3));
    newTopic.set('actionStart', new Date());
    newTopic.set('seqNum', theCase.activities().getCount());

    theCase.activities().add(newTopic);

    return newTopic;
  },

  getJurisdictionCode: function(practiceModel) {
    var countryStore = Bn.getInstance('DomainCountryStore'),
      country;

    practiceModel = practiceModel || Security.user.session.getActivePractice();


    //should only have access to create opportunity/activity if the
    // practiceModel already exists
    //also the only functionality that uses getJurisdiction code are create
    // opportunity/activity so we know that countryCode should have already been
    // set
    if (practiceModel) {
      country = practiceModel.getCountryCode();
      // log.debug("getJurisdictionCode: "+country);

      var cm = countryStore.getById(country);
      if (cm) {
        // If possible, return the jurisdiction code defined in the country table
        // for this country.
        var codeId = cm.jurisdictionCodeId;
        //log.debug("codeId="+codeId);

        if (codeId) {
          var jurisdictionCodeStore = StoreManager.getRecord(
            'DomainCodeFamilyStore', 422);
          // log.debug("store="+jurisdictionCodeStore, jurisdictionCodeStore);
          if (jurisdictionCodeStore && jurisdictionCodeStore.codes()) {
            return CodeManager.findCode(jurisdictionCodeStore.codes(), codeId);
          }
        }
      }

      //log.error("Unable to find country model for country: "+country);
      var jurCode = undefined;
      // log.debug("country="+country);
      switch (country) {
        case 'US':
        case 'CA':
          jurCode = CodeManager.findCodeByCodeTypeAndValue('JURISDICTION',
            'NA');
          break;
        default:
          jurCode = CodeManager.findCodeByCodeTypeAndValue('JURISDICTION',
            'EU');
          break;
      }
      // log.debug("jurCode="+jurCode);
      if (!jurCode) {
        log.error("NO JURISDICTION CODE FOUND!");
      }
      return jurCode;
    } else {
      log.error("Practice model not found, can't select jurisdiction code!");
    }
    return undefined;
  },

  getDefaultCurrencyCode: function(practiceModel) {

    practiceModel = practiceModel || Security.user.session.getActivePractice();

    var country = practiceModel.getCountry(),
      countryStore = Bn.getInstance('DomainCountryStore'),
      currencyCd = countryStore.getCurrencyForCountry(country);

    // log.debug("country="+country);
    // log.debug("currencyCd="+currencyCd);
    return currencyCd;
  },

  /**
   * Return the appropriate SALES_USER_TYPE code for the current user.
   *
   * TODO: This needs to be data driven.
   */
  getSalesUserType: function(isFts) {
    var code;
    if (isFts === true) {
      code = CodeManager.findCodeByCodeTypeAndValue('SALES_USER_TYPE', 'FTS');
    } else {
      code = CodeManager.findCodeByCodeTypeAndValue('SALES_USER_TYPE',
        'SALES');
    }
    // log.debug("getSalesUserType("+isFts+")="+code);
    return code;
  },

  findCode: function(codeType, codeValue, theCase) {
    var codes = CodeAttributeManager.getValidCodesOfType(codeType,
      theCase.codeModels().getCodeMap(),
      theCase.getCodeFamilyId());

    for (var ix = 0; ix < codes.length; ix++) {
      var code = codes[ix];
      if (code.get('codeValue') == codeValue) {
        // log.debug("Found it: "+code);
        return code;
      }
    }
    // log.debug("Code not found: "+codeType, codeValue, codes);
    return null;
  },

  /**
   * Create a new Contact.
   * Note: assumes all edit data has been retrieved already, and the required
   * codeFamily, etc are available.
   * @param {Beacon.model.practice.PracticeModel} practiceModel
   */
  createContact: function(practiceModel) {
    var me = this,
      store = Bn.getInstance('DomainCasesTypeStore'), // Make sure store is loaded
      theContact = Ext.create(
        'Beacon.model.domain.contact.ContactSummaryModel'),
      codeFamilyStore = Bn.getInstance('DomainCodeFamilyStore');

    theContact.set('sapId', practiceModel.get('sapId'));
    theContact.setId(null);

    var codeFamily345 = Bn.getInstance('DomainCodeFamilyStore').findRecord(
      'codeFamilyId', 345);

    //Create initial records for phone, email, and address.
    //(Upon save, empty addresses will be removed from record
    //DE6142 - But only do this if we're servicing this request from Desktop Web:
    if (Bn.isExt) {
      var businessPhoneTypeCode = CodeManager.findCodeByCodeTypeAndValue(
        'CONTACT_PHONE_TYPE', 'BUSINESS_PHONE_CONTACT_TYPE');
      var item = this.createContactPhone(theContact);
      item.set('typeCode', businessPhoneTypeCode);

      item = this.createContactEmail(theContact);
      item.set('typeCode', CodeManager.findCodeByCodeTypeAndValue(
        'CONTACT_EMAIL_TYPE', 'BUSINESS_EMAIL_CONTACT_TYPE'));

      item = this.createContactAddress(theContact);
    }

    return theContact;
  },

  /**
   * Creates a new phone number {@link Beacon.model.domain.contact.ContactAddressModel} for the specified contact.
   * @param {Beacon.model.domain.contact.ContactSummaryModel} contact The contact to add this phone number.
   */
  createContactPhone: function(contact) {
    var item = Ext.create('Beacon.model.domain.contact.ContactAddressModel');
    item.set('contactId', contact.get('contactId'));

    var commMethod = Ext.create(
      'Beacon.model.domain.communication.CommunicationMethodModel');
    commMethod.set('methodId', 1); // phone
    commMethod.set('method', "Phone");

    item.set('commMethod', commMethod);

    contact.phoneNumbers().add(item);
    return item;
  },

  /**
   * Creates a new email {@link Beacon.model.domain.contact.ContactAddressModel} for the specified contact.
   * @param {Beacon.model.domain.contact.ContactSummaryModel} contact The contact to add this email model.
   */
  createContactEmail: function(contact) {
    var item = Ext.create('Beacon.model.domain.contact.ContactAddressModel');
    item.set('contactId', contact.get('contactId'));

    var commMethod = Ext.create(
      'Beacon.model.domain.communication.CommunicationMethodModel');
    commMethod.set('methodId', 3); // email
    commMethod.set('method', "Email");

    item.set('commMethod', commMethod);

    contact.emailAddresses().add(item);
    return item;
  },

  /**
   * Creates a new physical address {@link Beacon.model.domain.contact.ContactAddressModel} for the specified contact.
   * @param {Beacon.model.domain.contact.ContactSummaryModel} contact The contact to add this address model.
   */
  createContactAddress: function(contact) {
    var item = Ext.create('Beacon.model.domain.contact.ContactAddressModel');
    item.set('contactId', contact.get('contactId'));

    var commMethod = Ext.create(
      'Beacon.model.domain.communication.CommunicationMethodModel');
    commMethod.set('methodId', 5); // physical address
    commMethod.set('method', "Visit");
    //log.debug("commMethod="+ commMethod, commMethod);
    //log.debug("commMethod.data="+commMethod.getData(true));

    item.set('commMethod', commMethod);

    contact.physicalAddresses().add(item);
    return item;
  },

  /**
   * Create a new {@link Beacon.model.cases.CaseAttachmentModel} using the specified caseId and practice model.
   * Note: assumes all edit data has been retrieved already, and the required
   * codeFamily, etc are available.
   * @param {Beacon.model.practice.PracticeModel} practiceModel
   * @param {Number} caseId The id of the case for this attachment.
   * @return {Beacon.model.cases.CaseAttachmentModel} The new attachment model.
   */
  createAttachment: function(caseId, practice) {
    var me = this,
      store = Bn.getInstance('DomainCasesTypeStore'), // Make sure store is loaded
      record = Ext.create('Beacon.model.cases.CaseAttachmentModel');

    record.set('caseId', caseId);
    record.set('customerId', practice.get('sapId'));

    record.setId(null);

    return record;

  },

  loadCodeFamilyData: function(codeFamilyId) {
    var deferred = Ext.create('Deft.Deferred');

    StoreManager.getRecord('DomainCodeFamilyStore', codeFamilyId, {
      callback: function(codeFamily) {
        deferred.resolve(codeFamily);
      }
    });

    return deferred.promise;
  }
});
