-- Attribute types
Insert into SYSTEM_ATTRIBUTE_TYPE (ATTRIBUTE_TYPE_ID,ATTRIBUTE_TYPE,ATTRIBUTE_TYPE_DESCRIPTION,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED) values (60,'LOCAL_URL','Link to an internal web resource',709,to_timestamp('01-JUL-14 04.21.33.989150000 PM','DD-MON-RR HH.MI.SSXFF AM'),709,to_timestamp('01-JUL-14 04.21.33.989150000 PM','DD-MON-RR HH.MI.SSXFF AM'),0);


--Hot List system attributes

insert into system_attributes ( ATTRIBUTE_ID, ATTRIBUTE_TYPE_ID, ATTRIBUTE_NAME, ATTRIBUTE_VALUE, ATTRIBUTE_DESCRIPTION, DATA_TYPE_ID, created_on, created_by, is_deleted )
values( system_attributes_seq.nextval, 7, 'hotlist.needy.customer.threshold', '8', 'Number of calls in 30 days', 4, systimestamp, 938, 0 );


insert into system_attributes ( ATTRIBUTE_ID, ATTRIBUTE_TYPE_ID, ATTRIBUTE_NAME, ATTRIBUTE_VALUE, ATTRIBUTE_DESCRIPTION, DATA_TYPE_ID, created_on, created_by, is_deleted )
values( system_attributes_seq.nextval, 7, 'hotlist.case.aged.days', '14', 'Number of days an open case before it is considered aged', 4, systimestamp, 938, 0 );


--Telephony
Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values (system_attributes_seq.nextval, 1,'websocketTelephonyI3.baseUrl','ws://wmecrmd02.idexxi.com:65400/websockets/telephony/client-swing/','Endpoint URI Stem for websocket I3 telephony integration.',1,938,systimestamp,938,systimestamp,0);



--US Plant Locations for Tracking Info
INSERT INTO system_attributes (attribute_id,attribute_type_id,attribute_name,attribute_value,attribute_description,data_type_id,created_by,created_on,updated_by,updated_on,is_deleted)
values (system_attributes_seq.nextval,8,'plantLocations.US','USPB,USP1,USP4','US plant locations for Tracking Info',5,14423,SYSTIMESTAMP,14423,SYSTIMESTAMP,0);



Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values (system_attributes_seq.nextval,7,'hotlist.client.graph.order','East,Central,West,Canada,Eastern Canada,Central Canada,Western Canada','List of Ids (not separated by type because we shift data around client side)',5,938,systimestamp,938,systimestamp,0);

Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values (system_attributes_seq.nextval,7,'notifications.contracts.months','18','Number of months to check for expired contracts',4,938,systimestamp,938,systimestamp,0);

Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values (system_attributes_seq.nextval,7,'hotlist.case.aged.days','14','Number of days an open case before it is considered aged',4,938,systimestamp,938,systimestamp,0);

Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values (system_attributes_seq.nextval,7,'hotlist.needy.customer.threshold','4','Number of calls in 30 days',4,938,systimestamp,1,systimestamp,0);


--Sales Web Form attributes
Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED) values (system_attributes_seq.nextval,60,'SALES_WEB_FORM.SALES_WEB_FORM_UPDATE_CUSTOMER_MASTER.europe.LOCAL_URL','Beacon.forms.CagAccInfoUpdateForm','Master Update eu url',1,709,to_timestamp('01-JUL-14 04.45.09.990559000 PM','DD-MON-RR HH.MI.SSXFF AM'),709,to_timestamp('07-JUL-14 01.57.36.134320000 PM','DD-MON-RR HH.MI.SSXFF AM'),0);
Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED) values (system_attributes_seq.nextval,60,'SALES_WEB_FORM.SALES_WEB_FORM_UPDATE_CUSTOMER_MASTER.LOCAL_URL','Beacon.forms.CAG_Acct_Update_Form','Master Update url',1,709,to_timestamp('01-JUL-14 04.45.06.025705000 PM','DD-MON-RR HH.MI.SSXFF AM'),709,to_timestamp('07-JUL-14 01.57.29.344830000 PM','DD-MON-RR HH.MI.SSXFF AM'),0);
Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED) values (system_attributes_seq.nextval,60,'SALES_WEB_FORM.SALES_WEB_FORM_FREE_GOODS_ORDER.LOCAL_URL','Beacon.forms.FreeGoodsOrderForm','Instrument Update url',1,709,to_timestamp('01-JUL-14 04.45.00.522443000 PM','DD-MON-RR HH.MI.SSXFF AM'),709,to_timestamp('07-JUL-14 01.57.26.559215000 PM','DD-MON-RR HH.MI.SSXFF AM'),0);
Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED) values (system_attributes_seq.nextval,60,'SALES_WEB_FORM.SALES_WEB_FORM_INSTRUMENT_UPDATE.LOCAL_URL','Beacon.forms.CagSerialNumberForm','Instrument Update url',1,709,to_timestamp('01-JUL-14 04.44.57.263597000 PM','DD-MON-RR HH.MI.SSXFF AM'),709,to_timestamp('07-JUL-14 01.57.24.078542000 PM','DD-MON-RR HH.MI.SSXFF AM'),0);
Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED) values (system_attributes_seq.nextval,60,'SALES_WEB_FORM.SALES_WEB_FORM_LABS_BILLING_ADJUSTMENT.LOCAL_URL','Beacon.forms.IVS_BillingAdjustmentForm','Labs Billing Adjustment url',1,709,to_timestamp('01-JUL-14 04.44.51.737939000 PM','DD-MON-RR HH.MI.SSXFF AM'),709,to_timestamp('07-JUL-14 01.57.21.029313000 PM','DD-MON-RR HH.MI.SSXFF AM'),0);
Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED) values (system_attributes_seq.nextval,60,'SALES_WEB_FORM.INSTRUMENT_RESEARCH_REQUEST.LOCAL_URL','Beacon.forms.CagSerialNumberForm','Instrument Research Request Form url',1,709,to_timestamp('01-JUL-14 04.44.45.502008000 PM','DD-MON-RR HH.MI.SSXFF AM'),709,to_timestamp('07-JUL-14 01.57.17.051775000 PM','DD-MON-RR HH.MI.SSXFF AM'),0);

--Sales Web Form Data Attributes
Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values
(system_attributes_seq.nextval,8,'SalesFormDAO.fields.CustomerMasterUpdate.formInfoFields','CSR,CSREmail,SAP,AccountName,Division,Sales_Region,Customer_Type,Cust_Size,Customer_Specialty,RD_Change_Customer_Type,RD_Change_Cust_Size,RD_Change_Customer_Specialty,RD_New_Name,RD_Addl_Div,RD_Eff_Clos_Date,RD_New_Prim_Lab,RD_Auto_fax_no,RD_Disc_Amt,Request_Type',
  'Field Order for Group 1',5,6244,systimestamp,6244,systimestamp,0);

Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values
(system_attributes_seq.nextval,8,'SalesFormDAO.fields.CustomerMasterUpdate.contactInfoFields','Owner,Vet_Lic_No,Lic_Vet_Name,Email,InvEmailFax,Billing_EmailFax',
  'Field Order for Contact Info Fields',5,6244,systimestamp,6244,systimestamp,0);

Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values
(system_attributes_seq.nextval,8,'SalesFormDAO.fields.CustomerMasterUpdate.accountInfoFields','DiffShipTo,PO_Box,PO_ZipCode,Address1,Address2,Address3,City,County,State,ZipCode,Country,TZone,Phone,Fax',
  'Field Order for Account Info Fields',5,6244,systimestamp,6244,systimestamp,0);

Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values
(system_attributes_seq.nextval,8,'SalesFormDAO.fields.CustomerMasterUpdate.shippingInfoFields','Ship_PO_Box,Ship_PO_ZipCode,Ship_Address1,Ship_Address2,Ship_Address3,Ship_City,Ship_County,Ship_State,Ship_ZipCode,Ship_Country,Ship_TZone,Ship_Phone,Ship_Fax',
  'Field Order for Account Info Fields',5,6244,systimestamp,6244,systimestamp,0);

Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values
(system_attributes_seq.nextval,8,'SalesFormDAO.fields.CustomerMasterUpdate.paymentInfoFields','Order_Over_25K,Payment_Terms,Price_List,Comments',
  'Field Order for Payment Info Fields',5,6244,systimestamp,6244,systimestamp,0);

Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values
(system_attributes_seq.nextval,8,'SalesFormDAO.fields.CustomerMasterUpdate.mailToRoles','15281,15282,15288,38227,38226,38425',
  'If required, mail to these sales roles for practice',5,6244,systimestamp,6244,systimestamp,0);

Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values
(system_attributes_seq.nextval,8,'SalesFormDAO.fields.FreeGoodsForm.formFields','Sales_Rep_Type,supervisor,CCRep,CCRepEmail,SAP_Number,Clinic_Name,Address,City,State,Country,Zip Code,Phone,Qty_1,Product_1,PartNum_1,Qty_2,Product_2,PartNum_2,Qty_3,Product_3,PartNum_3,Qty_4,Product_4,PartNum_4,Qty_5,Product_5,PartNum_5,Shipping Terms,Rep Code,Reason Code,Comments',
  'Free Goods Form fields',5,6244,systimestamp,6244,systimestamp,0);


Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values
(system_attributes_seq.nextval,8,'SalesFormDAO.fields.InstrumentUpdateForm.formFields','CSR,CCRepEmail,Clinic,SAP,Request_Type,VetTest_SN,ProCyte_SN,ProCyte_SN,ProCyteIPU_SN,SnapReader_SN,Catalyst_SN,SNAPshot_SN,IVLS-IVS_PC_SN,VetLyte_SN,IVLS-IVS_LCD_SN,UA_SN,LaserCyte_SN,VetStat_SN,LaserCyteDX_SN,VetAutoread_SN,DIGITAL_Computer_SN,Centrifuge_SN,DIGITAL_CASSETTE_Plate_SN,ICS_Hardware_SN,DIGITAL_CTRLBOX_RELAYBOX_SN,SNAP_PRO_SN,DIGITAL_SCANNER_SN,Catalyst_One_SN,StatSpin_SN,StatSpin_Model,Minispin_SN',
  'Free Goods Form fields',5,6244,systimestamp,6244,systimestamp,0);


Insert into SYSTEM_ATTRIBUTES (ATTRIBUTE_ID,ATTRIBUTE_TYPE_ID,ATTRIBUTE_NAME,ATTRIBUTE_VALUE,ATTRIBUTE_DESCRIPTION,DATA_TYPE_ID,CREATED_BY,CREATED_ON,UPDATED_BY,UPDATED_ON,IS_DELETED)
values
(system_attributes_seq.nextval,8,'SalesFormDAO.fields.BillingAdjustmentForm.formFields','Lab_Location,Billing_Doc,SAP_Number,Clinic_Name,Accession,Patient_Name,Test_Number,TestName,Amount_Orig_Charge,BeaconCase,Amount_to_Credit,Amount_to_Debit,Explanation,CCRep,CCRepEmail',
  'Free Goods Form fields',5,6244,systimestamp,6244,systimestamp,0);
