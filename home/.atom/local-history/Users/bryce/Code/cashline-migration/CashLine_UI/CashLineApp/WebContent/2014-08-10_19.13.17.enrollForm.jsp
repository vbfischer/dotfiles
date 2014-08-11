<!doctype html>
<!--[if IE 8]><html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean"%>
<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html"%>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic"%>
<%@ taglib prefix="email" uri="/WEB-INF/Email.tld" %>
<%@ taglib prefix="text2" uri="/WEB-INF/Text2.tld" %>

<jsp:useBean id="merchantViewHelper" scope="session" class="com.fis.cashlineapp.helper.MerchantPresentationHelper" />
<jsp:useBean id="user_session_object" scope="session" class="com.fis.cashlineapp.forms.CashLineForm"/>
<jsp:useBean id="enrollForm" scope="session" class="com.fis.cashlineapp.forms.EnrollForm"/>
<jsp:useBean id="enrollHelper" scope="session" class="com.fis.cashlineapp.helper.EnrollHelper" />
<jsp:useBean id="welcomeHelper" scope="session" class="com.fis.cashlineapp.helper.WelcomeHelper" />

<jsp:include page="/common/meta-head.jsp" />
<body>

<jsp:include page="/common/header.jsp" />
  <jsp:include page="/common/modal-learn-more.jsp" />
  <jsp:include page="/common/modal-login.jsp" />
  <jsp:include page="/common/modal-about.jsp" />

<!-- Main Content Area with Menu Sidebar -->
<div class="main">
	<div class="row">
    <jsp:include page="/common/navigation.jsp" />

    <div class="nine medium-9 columns">
			<div class="content">
				<!-- Enroll Now Form Page Content -->
				<h1>CERTEGY<sup>&reg;</sup> CashLine Enrollment Request Form</h1>
				<p>Please enter enrollment fields and click &quot;Next&quot; button. Required fields are marked with an asterisk (<span class="required">*</span>).</p>
                <logic:messagesPresent>
                    <logic:notEmpty property="actionMessage" name="enrollForm">
                        <div class="body_text" style="padding-bottom: 8px">
                            <bean:write name="enrollForm" property="actionMessage" filter="false" />
                        </div>
                        <br>
                        <br>
                    </logic:notEmpty>
                    <logic:empty property="actionMessage" name="enrollForm">
                        <div class="form_field_error_header">
                            <bean:message key="enroll.errors" />
                        </div>
                        <html:errors/>
                    </logic:empty>
                </logic:messagesPresent>
                <html:form action="enrollPerform.do" method="post">
                    <html:javascript formName="enrollForm"/>
                    <input type="hidden" name="mid" value="6"/>
                    <input type="hidden" name="transactionOrigin" value="someOrig"/>
                    <logic:notEmpty property="loginInfo" name="enrollForm">
                    	<h3>We've done this before</h3>
                    </logic:notEmpty>
					<fieldset>
						<legend>Personal Information</legend>
						<p>Please provide your Full Legal Name</p>
						<div class="row">
							<div class="three medium-3 columns">
                                <label <logic:messagesPresent property="firstName">class="error"</logic:messagesPresent>>First<span class="required">*</span>
                                    <html:text property="firstName"></html:text>
                       
         </label>
                                <logic:messagesPresent property="firstName">
                                    <small class="error"><html:errors property="firstName"/></small>
                                </logic:messagesPresent>
							</div>
                            <div class="three medium-3 columns">
                                <label>Middle
                                	<html:text property="middleName"></html:text>	
                                </label>
							</div>

							<div class="four medium-4 columns">
                                <label <logic:messagesPresent property="firstName">class="error"</logic:messagesPresent>>Last<span class="required">*</span>
                                <logic:notEmpty property="loginInfo" name="enrollForm">
                                	<bean:write name="enrollForm" property="lastName"/>
                                </logic:notEmpty>
                                <logic:empty property="loginInfo" name="enrollForm">
                                	<html:text property="lastName"></html:text>	
                                </logic:empty>
                                </label>
                                <logic:messagesPresent property="lastName">
                                    <small class="error"><html:errors property="lastName"/></small>
                                </logic:messagesPresent>
							</div>

							<div class="two medium-2 columns">
								<label>Suffix
									<html:select property="suffix">
										<html:option value="Jr.">Jr.</html:option>
										<html:option value="Sr.">Sr.</html:option>
										<html:option value="2nd">2nd</html:option>
										<html:option value="3rd">3rd</html:option>
										<html:option value="II">II</html:option>
										<html:option value="III">III</html:option>
										<html:option value="IV">IV</html:option>
										<html:option value="V">V</html:option>
										<html:option value="VI">VI</html:option>
									</html:select>
								</label>
							</div>
						</div>
						<div class="row">
							<div class="four medium-4 columns end">
								<label  <logic:messagesPresent property="dob">class="error"</logic:messagesPresent> >Date of Birth<span class="required">*</span>
                                    <div class="row">
                                        <div class="three medium-3 columns end">
                                        	<html:text property="dobMm" maxlength="3" ></html:text>
                                        </div>
                                        <div class="three medium-3 columns end">
                                        	<html:text property="dobDd" maxlength="2" ></html:text>
                                        </div>
                                        <div class="siz medium-6 columns end">
                                        	<html:text property="dobYyyy" maxlength="4" ></html:text>
                                        </div>
                                    </div>
								</label>
                                <logic:messagesPresent property="dob">
                                    <small class="error"><html:errors property="dob"/></small>
                                </logic:messagesPresent>
							</div>
						</div>
						<div class="row">
							<div class="six medium-6 columns">
								<label  <logic:messagesPresent property="driversLicense">class="error"</logic:messagesPresent> >State Issued ID Number<span class="required">*</span>
								<html:text property="driversLicense" ></html:text>
								</label>
                                <logic:messagesPresent property="driversLicense">
                                    <small class="error"><html:errors property="driversLicense"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="six medium-6 columns">
								<label  <logic:messagesPresent property="verifyDriversLicense">class="error"</logic:messagesPresent> >Verify State Issued ID Number<span class="required">*</span>
								<html:text property="verifyDriversLicense" ></html:text>
								</label>
                                <logic:messagesPresent property="verifyDriversLicense">
                                    <small class="error"><html:errors property="verifyDriversLicense"/></small>
                                </logic:messagesPresent>
							</div>
						</div>
						<div class="row">
							<div class="six medium-6 columns">
								<label  <logic:messagesPresent property="dlState">class="error"</logic:messagesPresent> >State of Issuance<span class="required">*</span>
								
								<html:select property="dlState">

	   								<html:option value='Alabama' >Alabama</html:option>
									<html:option value='Alaska' >Alaska</html:option>
									<html:option value='Arizona' >Arizona</html:option>
									<html:option value='Arkansas' >Arkansas</html:option>
									<html:option value='California' >California</html:option>
									<html:option value='Colorado' >Colorado</html:option>
									<html:option value='Connecticut' >Connecticut</html:option>
									<html:option value='Delaware' >Delaware</html:option>
									<html:option value='District of Columbia' >District of Columbia</html:option>
									<html:option value='Florida' >Florida</html:option>
									<html:option value='Georgia' >Georgia</html:option>
									<html:option value='Hawaii' >Hawaii</html:option>
									<html:option value='Idaho' >Idaho</html:option>
									<html:option value='Illinois' >Illinois</html:option>
									<html:option value='Indiana' >Indiana</html:option>
									<html:option value='Iowa' >Iowa</html:option>
									<html:option value='Kansas' >Kansas</html:option>
									<html:option value='Kentucky' >Kentucky</html:option>
									<html:option value='Louisiana' >Louisiana</html:option>
									<html:option value='Maine' >Maine</html:option>
									<html:option value='Maryland' >Maryland</html:option>
									<html:option value='Massachusetts' >Massachusetts</html:option>
									<html:option value='Michigan' >Michigan</html:option>
									<html:option value='Minnesota' >Minnesota</html:option>
									<html:option value='Mississippi' >Mississippi</html:option>
									<html:option value='Missouri' >Missouri</html:option>
									<html:option value='Montana' >Montana</html:option>
									<html:option value='Nebraska' >Nebraska</html:option>
									<html:option value='Nevada' >Nevada</html:option>
									<html:option value='New Hampshire' >New Hampshire</html:option>
									<html:option value='New Jersey' >New Jersey</html:option>
									<html:option value='New Mexico' >New Mexico</html:option>
									<html:option value='New York' >New York</html:option>
									<html:option value='North Carolina' >North Carolina</html:option>
									<html:option value='North Dakota' >North Dakota</html:option>
									<html:option value='Ohio' >Ohio</html:option>
									<html:option value='Oklahoma' >Oklahoma</html:option>
									<html:option value='Oregon' >Oregon</html:option>
									<html:option value='Pennsylvania' >Pennsylvania</html:option>
									<html:option value='Rhode Island' >Rhode Island</html:option>
									<html:option value='South Carolina' >South Carolina</html:option>
									<html:option value='South Dakota' >South Dakota</html:option>
									<html:option value='Tennessee' >Tennessee</html:option>
									<html:option value='Texas' >Texas</html:option>
									<html:option value='Utah' >Utah</html:option>
									<html:option value='Vermont' >Vermont</html:option>
									<html:option value='Virginia' >Virginia</html:option>
									<html:option value='Washington' >Washington</html:option>
									<html:option value='West Virginia' >West Virginia</html:option>
									<html:option value='Wisconsin' >Wisconsin</html:option>
									<html:option value='Wyoming' >Wyoming</html:option>
									<html:option value='Armed Forces Americas' >Armed Forces Americas</html:option>
									<html:option value='Armed Forces Europe' >Armed Forces Europe</html:option>
									<html:option value='Armed Forces Pacific' >Armed Forces Pacific</html:option>

								</html:select>
								</label>
                                <logic:messagesPresent property="dlState">
                                    <small class="error"><html:errors property="dlState"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="four medium-4 columns end">
								<label  <logic:messagesPresent property="expiryDate">class="error"</logic:messagesPresent> >Expiration Date<span class="required">*</span>

                                    <div class="row">
                                        <div class="three medium-3 columns end">
											<html:text property="dlMm" maxlength="3" ></html:text>
                                        </div>
                                        <div class="three medium-3 columns end">
                                            <html:text property="dlDd" maxlength="2" ></html:text>
                                        </div>
                                        <div class="siz medium-6 columns end">
                                            <html:text property="dlYyyy" maxlength="4" ></html:text>
                                        </div>
                                    </div>
                                </label>
								
                                <logic:messagesPresent property="expiryDate">
                                    <small class="error"><html:errors property="expiryDate"/></small>
                                </logic:messagesPresent>
							</div>
						</div>
						<div class="row">
							<div class="four medium-4 columns">
								<label <logic:messagesPresent property="ssn1">class="error"</logic:messagesPresent>>Social Security Number
                                    <div class="row">
                                        <div class="three medium-3 columns end">
                                        	<html:text property="ssn11" maxlength="3" ></html:text>
                                        </div>
                                        <div class="three medium-3 columns end">
                                            <html:text property="ssn12" maxlength="2" ></html:text>
                                        </div>
                                        <div class="siz medium-6 columns end">
                                        	<html:text property="ssn13" maxlength="4" ></html:text>
                                        </div>
                                    </div>
								</label>
                                <logic:messagesPresent property="ssn1">
                                    <small class="error"><html:errors property="ssn1"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="four medium-4 columns">
								<label <logic:messagesPresent property="ssn2">class="error"</logic:messagesPresent>>Verify Social Security Number
                                    <div class="row">
                                        <div class="three medium-3 columns end">
                                        	<html:text property="ssn21" maxlength="3" ></html:text>
                                        </div>
                                        <div class="three medium-3 columns end">
                                            <html:text property="ssn22" maxlength="2" ></html:text>
                                        </div>
                                        <div class="siz medium-6 columns end">
                                        	<html:text property="ssn23" maxlength="4" ></html:text>
                                        </div>                                    
                                    </div>
								</label>
                                <logic:messagesPresent property="ssn2">
                                    <small class="error"><html:errors property="ssn2"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="four medium-4 columns">
								<p class="disclaimer">Note: Your Social Security Number is not required for approval, but if entered, will typically result in a higher limit.</p>
							</div>
						</div>
						<div class="row">
							<div class="six medium-6 columns end">
								<label>Total Rewards Number
								<html:text property="totalRewardsNo"></html:text>
								</label>
							</div>
						</div>
					</fieldset>
					<fieldset>
						<legend>Current Address</legend>
						<div class="row">
							<div class="six medium-6 columns">
								<label  <logic:messagesPresent property="address1">class="error"</logic:messagesPresent>>Address 1<span class="required">*</span>
									<html:text property="address1"></html:text>
								</label>
                                <logic:messagesPresent property="address1">
                                    <small class="error"><html:errors property="address1"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="six medium-6 columns">
								<label>Address 2
								<html:text property="address2"></html:text>
								</label>
							</div>
						</div>
						<div class="row">
							<div class="four medium-4 columns">
								<label <logic:messagesPresent property="city">class="error"</logic:messagesPresent> >City<span class="required">*</span>
								<html:text property="city"></html:text>
								</label>
                                <logic:messagesPresent property="city">
                                    <small class="error"><html:errors property="city"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="three medium-3 columns">
								<label  <logic:messagesPresent property="state">class="error"</logic:messagesPresent> >State<span class="required">*</span>
					
								<html:select property="state">

	   								<html:option value='Alabama' >Alabama</html:option>
									<html:option value='Alaska' >Alaska</html:option>
									<html:option value='Arizona' >Arizona</html:option>
									<html:option value='Arkansas' >Arkansas</html:option>
									<html:option value='California' >California</html:option>
									<html:option value='Colorado' >Colorado</html:option>
									<html:option value='Connecticut' >Connecticut</html:option>
									<html:option value='Delaware' >Delaware</html:option>
									<html:option value='District of Columbia' >District of Columbia</html:option>
									<html:option value='Florida' >Florida</html:option>
									<html:option value='Georgia' >Georgia</html:option>
									<html:option value='Hawaii' >Hawaii</html:option>
									<html:option value='Idaho' >Idaho</html:option>
									<html:option value='Illinois' >Illinois</html:option>
									<html:option value='Indiana' >Indiana</html:option>
									<html:option value='Iowa' >Iowa</html:option>
									<html:option value='Kansas' >Kansas</html:option>
									<html:option value='Kentucky' >Kentucky</html:option>
									<html:option value='Louisiana' >Louisiana</html:option>
									<html:option value='Maine' >Maine</html:option>
									<html:option value='Maryland' >Maryland</html:option>
									<html:option value='Massachusetts' >Massachusetts</html:option>
									<html:option value='Michigan' >Michigan</html:option>
									<html:option value='Minnesota' >Minnesota</html:option>
									<html:option value='Mississippi' >Mississippi</html:option>
									<html:option value='Missouri' >Missouri</html:option>
									<html:option value='Montana' >Montana</html:option>
									<html:option value='Nebraska' >Nebraska</html:option>
									<html:option value='Nevada' >Nevada</html:option>
									<html:option value='New Hampshire' >New Hampshire</html:option>
									<html:option value='New Jersey' >New Jersey</html:option>
									<html:option value='New Mexico' >New Mexico</html:option>
									<html:option value='New York' >New York</html:option>
									<html:option value='North Carolina' >North Carolina</html:option>
									<html:option value='North Dakota' >North Dakota</html:option>
									<html:option value='Ohio' >Ohio</html:option>
									<html:option value='Oklahoma' >Oklahoma</html:option>
									<html:option value='Oregon' >Oregon</html:option>
									<html:option value='Pennsylvania' >Pennsylvania</html:option>
									<html:option value='Rhode Island' >Rhode Island</html:option>
									<html:option value='South Carolina' >South Carolina</html:option>
									<html:option value='South Dakota' >South Dakota</html:option>
									<html:option value='Tennessee' >Tennessee</html:option>
									<html:option value='Texas' >Texas</html:option>
									<html:option value='Utah' >Utah</html:option>
									<html:option value='Vermont' >Vermont</html:option>
									<html:option value='Virginia' >Virginia</html:option>
									<html:option value='Washington' >Washington</html:option>
									<html:option value='West Virginia' >West Virginia</html:option>
									<html:option value='Wisconsin' >Wisconsin</html:option>
									<html:option value='Wyoming' >Wyoming</html:option>
									<html:option value='Armed Forces Americas' >Armed Forces Americas</html:option>
									<html:option value='Armed Forces Europe' >Armed Forces Europe</html:option>
									<html:option value='Armed Forces Pacific' >Armed Forces Pacific</html:option>

								</html:select>
								</label>
                                <logic:messagesPresent property="state">
                                    <small class="error"><html:errors property="state"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="three medium-3 columns">
								<label <logic:messagesPresent property="postalCode">class="error"</logic:messagesPresent> >Postal Code<span class="required">*</span>
								<html:text property="postalCode"></html:text>
								</label>
                                <logic:messagesPresent property="postalCode">
                                    <small class="error"><html:errors property="postalCode"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="two medium-2 columns">
								<p class="disclaimer">Note: Only the first 5 digits are required.</p>
							</div>
						</div>
						<div class="row">
                            <div class="six medium-6 columns end">
                                <label <logic:messagesPresent property="phone">class="error"</logic:messagesPresent> >Daytime Phone<span class="required">*</span>
                                    <div class="row">
                                        <div class="three medium-3 columns end">
	                                        <html:text property="phoneAreaCode" maxlength="3"></html:text>
                                        </div>
                                        <div class="three medium-3 columns end">
                                        	<html:text property="phonePrefixCode" maxlength="3"></html:text>
                                        </div>
                                        <div class="siz medium-6 columns end">
                                        	<html:text property="phoneLocalCode" maxlength="4"></html:text>
                                        </div>
                                    </div>
                                </label>
                                <logic:messagesPresent property="phone">
                                    <small class="error"><html:errors property="phone"/></small>
                                </logic:messagesPresent>
                            </div>
						</div>
					</fieldset>
					<fieldset>
						<legend>Bank Account Information</legend>
						<div class="row">
							<div class="six medium-6 columns">
								<label <logic:messagesPresent property="routingNumber">class="error"</logic:messagesPresent> >Routing Number
								<html:text property="routingNumber"></html:text>
								</label>
                                <logic:messagesPresent property="routingNumber">
                                    <small class="error"><html:errors property="routingNumber"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="six medium-6 columns">
								<label <logic:messagesPresent property="verifyRoutingNumber">class="error"</logic:messagesPresent> >Verify Routing Number
								<html:text property="verifyRoutingNumber"></html:text>
								</label>
                                <logic:messagesPresent property="verifyRoutingNumber">
                                    <small class="error"><html:errors property="verifyRoutingNumber"/></small>
                                </logic:messagesPresent>
							</div>
						</div>
						<div class="row">
							<div class="six medium-6 columns">
								<label <logic:messagesPresent property="accountNumber">class="error"</logic:messagesPresent> >Account Number
								<html:text property="accountNumber"></html:text>
								</label>
                                <logic:messagesPresent property="accountNumber">
                                    <small class="error"><html:errors property="accountNumber"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="six medium-6 columns">
								<label <logic:messagesPresent property="verifyAccountNumber">class="error"</logic:messagesPresent> >Verify Account Number
								<html:text property="verifyAccountNumber"></html:text>
								</label>
                                <logic:messagesPresent property="verifyAccountNumber">
                                    <small class="error"><html:errors property="verifyAccountNumber"/></small>
                                </logic:messagesPresent>
							</div>
						</div>
						<div class="row">
							<div class="six medium-6 columns end">
								<label>Account Type
								<html:select property="accountType">
	   								<html:option value='Checking' >Checking</html:option>
	   								<html:option value='Savings' >Savings</html:option>
	   								<html:option value='Business Checking' >Business Checking</html:option>
	   								<html:option value='Business Savings' >Business Savings</html:option>
	   							</html:select>
								</label>
							</div>
						</div>
					</fieldset>
					<fieldset>
						<legend>Login Information</legend>
						<div class="row">
							<div class="six medium-6 columns">
								<label <logic:messagesPresent property="userName">class="error"</logic:messagesPresent> >User ID<span class="required">*</span>
								<html:text property="userName"></html:text>
								</label>
                                <logic:messagesPresent property="userName">
                                    <small class="error"><html:errors property="userName"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="six medium-6 columns">
								<label <logic:messagesPresent property="emailAddress">class="error"</logic:messagesPresent> >Email Address
								<email:email property="emailAddress" placeholder="Email Address"></email:email>
								</label>
                                <logic:messagesPresent property="emailAddress">
                                    <small class="error"><html:errors property="emailAddress"/></small>
                                </logic:messagesPresent>
							</div>
						</div>
						<div class="row">
							<div class="four medium-4 columns">
								<label <logic:messagesPresent property="password">class="error"</logic:messagesPresent> >Password<span class="required">*</span>
								<text2:text type="password" property="password" placeholder="Password"></text2:text>
								</label>
                                <logic:messagesPresent property="password">
                                    <small class="error"><html:errors property="password"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="four medium-4 columns">
								<label <logic:messagesPresent property="confirmPassword">class="error"</logic:messagesPresent> >ConfirmPassword<span class="required">*</span>
								<text2:text type="password" property="confirmPassword" placeholder="Confirm Password"></text2:text>
								</label>
                                <logic:messagesPresent property="confirmPassword">
                                    <small class="error"><html:errors property="confirmPassword"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="four medium-4 columns">
								<p class="disclaimer">Note: Your Password should be from 8 to 30 characters in length. (This must include at least one numeric digit, one upper case, one lower case and one special character from following !@#$%^+=)</p>
							</div>
						</div>
						<div class="row">
							<div class="six medium-6 columns">
								<label <logic:messagesPresent property="securityQuestion">class="error"</logic:messagesPresent> >Security Question<span class="required">*</span>
								<html:select property="securityQuestion">
								<html:option value='What was your childhood nickname?' >What was your childhood nickname?</html:option>
								<html:option value='In what city did you meet your spouse/significant other?' >In what city did you meet your spouse/significant other?</html:option>
								<html:option value='What is the name of your favorite childhood friend?' >What is the name of your favorite childhood friend?</html:option>
								<html:option value='What street did you live on in third grade?' >What street did you live on in third grade?</html:option>
								<html:option value='What is your oldest sibling&apos;s birthday month and year? (e.g., January 1900)' >What is your oldest sibling's birthday month and year? (e.g., January 1900)</html:option>
								<html:option value='What is the middle name of your oldest child?' >What is the middle name of your oldest child?</html:option>
								<html:option value='What is your oldest sibling&apos;s middle name?' >What is your oldest sibling's middle name?</html:option>
								<html:option value='What school did you attend for sixth grade?' >What school did you attend for sixth grade?</html:option>
								<html:option value='What was your childhood phone number including area code? (e.g., 000-000-0000)' >What was your childhood phone number including area code? (e.g., 000-000-0000)</html:option>
								<html:option value='What is your oldest cousin&apos;s first and last name?' >What is your oldest cousin's first and last name?</html:option>
								<html:option value='What was the name of your first stuffed animal?' >What was the name of your first stuffed animal?</html:option>
								<html:option value='In what city or town did your mother and father meet?' >In what city or town did your mother and father meet?</html:option>
								<html:option value='Where were you when you had your first kiss?' >Where were you when you had your first kiss?</html:option>
								<html:option value='What is the first name of the boy or girl that you first kissed?' >What is the first name of the boy or girl that you first kissed?</html:option>
								<html:option value='What was the last name of your third grade teacher?' >What was the last name of your third grade teacher?</html:option>
								<html:option value='In what city does your nearest sibling live?' >In what city does your nearest sibling live?</html:option>
								<html:option value='What is your oldest brother&apos;s birthday month and year? (e.g., January 1900)' >What is your oldest brother’s birthday month and year? (e.g., January 1900)</html:option>
								<html:option value='What is your maternal grandmother&apos;s maiden name?' >What is your maternal grandmother's maiden name?</html:option>
								<html:option value='In what city or town was your first job?' >In what city or town was your first job?</html:option>
								<html:option value='What is the name of the place your wedding reception was held?' >What is the name of the place your wedding reception was held?</html:option>
								<html:option value='What is the name of a college you applied to but didn&apos;t attend?' >What is the name of a college you applied to but didn't attend?</html:option>
								<html:option value='Where were you when you first heard about 9/11?' >Where were you when you first heard about 9/11?</html:option>
								</html:select>
								</label>
                                <logic:messagesPresent property="securityQuestion">
                                    <small class="error"><html:errors property="securityQuestion"/></small>
                                </logic:messagesPresent>
							</div>
							<div class="six medium-6 columns">
								<label <logic:messagesPresent property="securityAnswer">class="error"</logic:messagesPresent> >Security Answer<span class="required">*</span>
								<text2:text type="text" property="securityAnswer" placeholder="Security Answer"></text2:text>
								</label>
                                <logic:messagesPresent property="securityAnswer">
                                    <small class="error"><html:errors property="securityAnswer"/></small>
                                </logic:messagesPresent>
							</div>
						</div>
					</fieldset>
					<fieldset>
                        <legend>Security Information</legend>
                        <div class="row">
							<div class="six medium-6 columns">
                                <p>Please enter the security code shown.</p>
                            </div>
                            <div class="six medium-6 columns">
                                <p>
                                    <bean:message key="enroll.enter" />
                                    <bean:message key="enrollPage.securityCode" />
                                    <bean:message key="enroll.message1" />
                                    <span class="required">*</span>
                                </p>
                            </div>
                            <div class="six medium-6 columns">
                                <html:text name="enrollForm" property="captchaText" styleClass="form_field_large" tabindex="42" onkeyup="enableButtons(this);" />
                                <img src="Captcha.jpg" height="20" width="100" border="1">
                            </div>
                            <logic:messagesPresent property="catpchaMismatch">
                                <div class="six medium-6 columns error">
                                    <html:errors property="catpchaMismatch" />
                                </div>
                            </logic:messagesPresent>

                        <%--<table cellpadding="0px" cellspacing="0px">--%>
                                <%--<tr class="form_table_row">--%>
                                    <%--<td class="label_text">--%>
                                        <%--<bean:message key="enroll.enter" />--%>
                                        <%--<bean:message key="enrollPage.securityCode" />--%>
                                        <%--<bean:message key="enroll.message1" />--%>
                                        <%--<span class="required">*</span>--%>
                                    <%--</td>--%>
                                    <%--<td class="label_text">--%>
                                        <%--<html:text name="enrollForm" property="captchaText" styleClass="form_field_large" tabindex="42" onkeyup="enableButtons(this);" />--%>
                                    <%--</td>--%>
                                    <%--<td colspan="2">--%>
                                        <%--<img src="Captcha.jpg" height="20" width="100" border="1">--%>
                                    <%--</td>--%>
                                <%--</tr>--%>
                                <%--<logic:messagesPresent property="catpchaMismatch">--%>
                                    <%--<tr>--%>
                                        <%--<td class="error">--%>
                                            <%--<html:errors property="catpchaMismatch" />--%>
                                        <%--</td>--%>
                                    <%--</tr>--%>
                                <%--</logic:messagesPresent>--%>

                            <%--</table>--%>
						</div>
					</fieldset>
                    <p>
                        <html:button styleClass="button round secondary" onclick="saveTheForm();" property="method" value="Save" tabindex="45" />
                        <html:submit styleClass="button round" property="method" value="Next" tabindex="46"/>
                    </p>
                </html:form>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
//    function submitTheForm(temp) {
//        //document.forms[0].action = "enrollEdit.do?method=Edit&amp;section=" + temp;
//        document.forms[0].action = "enrollPerform.do"
//        document.forms[0].submit();
//    }

    function saveTheForm() {
        var elem = document.getElementById("verifyAccountNumber"),
            acctNumber = elem ? elem.value : null;
        if(acctNumber && acctNumber.length > 0){
            alert("Bank Account Information will not be saved unless the application is submitted.");
        }
        document.forms[0].action = "enrollSave.do?method=Save";
        document.forms[0].submit();
    }

    function toggleSubmit(checked){
        if(checked){
            document.getElementById("disabledButton").style.display = "none";
            document.getElementById("enabledButton").style.display = "block";
        }else
        {
            document.getElementById("disabledButton").style.display = "block";
            document.getElementById("enabledButton").style.display = "none";
        }
    }

    function enableButtons(obj){
        if(Trim( obj.value).length > 0 ){
            document.getElementById("eButtons").style.display = "block";
            document.getElementById("dButtons").style.display = "none";
        }else
        {
            document.getElementById("eButtons").style.display = "none";
            document.getElementById("dButtons").style.display = "block";
        }
    }


    window.onload=function(){
        if(document.getElementsByName('captchaText')[0] != null)
            document.getElementsByName('captchaText')[0].value = "";
        if(document.getElementsByName('cashLineConsumerAcceptance')[0] != null)
            document.getElementsByName('cashLineConsumerAcceptance')[0].checked = false;
        if(document.getElementsByName('achConsumerAcceptance')[0] != null)
            document.getElementsByName('achConsumerAcceptance')[0].checked = false;
    };
</script>

<jsp:include page="common/footer.jsp" />

<jsp:include page="/common/meta-foot.jsp" />
</body>
</html>
