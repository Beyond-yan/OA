package com.gdssoft.oa.model.personal;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * Addressbook Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class Addressbook extends com.gdssoft.core.model.BaseModel {

	protected String personName;
	protected String department;
	protected String departmentOffice;
	protected String officePhone;	
	protected String mobile;
	protected String shortPhone;
	protected String room;
	protected String email;
	protected String source;
	
	protected String officeInlinetel;
	protected String companyShorttel;
	protected String employeeno;


	/**
	 * Default Empty Constructor for class Addressbook
	 */
	public Addressbook () {
		super();
	}
	
	    

	public String getDepartmentOffice() {
		return departmentOffice;
	}



	public void setDepartmentOffice(String departmentOffice) {
		this.departmentOffice = departmentOffice;
	}



	public String getOfficeInlinetel() {
		return officeInlinetel;
	}



	public void setOfficeInlinetel(String officeInlinetel) {
		this.officeInlinetel = officeInlinetel;
	}



	public String getCompanyShorttel() {
		return companyShorttel;
	}



	public void setCompanyShorttel(String companyShorttel) {
		this.companyShorttel = companyShorttel;
	}



	public String getEmployeeno() {
		return employeeno;
	}



	public void setEmployeeno(String employeeno) {
		this.employeeno = employeeno;
	}



	/**
	 * 	 * @return String
	 * @hibernate.property column="PERSON_NAME" type="java.lang.String" length="50" not-null="true" unique="false"
	 */
	public String getPersonName() {
		return this.personName;
	}
	
	/**
	 * Set the personName
	 * @spring.validator type="required"
	 */	
	public void setPersonName(String aValue) {
		this.personName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DEPARTMENT" type="java.lang.String" length="128" not-null="false" unique="false"
	 */
	public String getDepartment() {
		return this.department;
	}
	
	/**
	 * Set the department
	 */	
	public void setDepartment(String aValue) {
		this.department = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="OFFICE_PHONE" type="java.lang.String" length="30" not-null="false" unique="false"
	 */
	public String getOfficePhone() {
		return this.officePhone;
	}
	
	/**
	 * Set the officePhone
	 */	
	public void setOfficePhone(String aValue) {
		this.officePhone = aValue;
	}	

	
	/**
	 * 	 * @return String
	 * @hibernate.property column="mobile" type="java.lang.String" length="32" not-null="false" unique="false"
	 */
	public String getMobile() {
		return this.mobile;
	}
	
	/**
	 * Set the mobile
	 */	
	public void setMobile(String aValue) {
		this.mobile = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SHORT_PHONE" type="java.lang.String" length="30" not-null="false" unique="false"
	 */
	public String getShortPhone() {
		return this.shortPhone;
	}
	
	/**
	 * Set the shortPhone
	 */	
	public void setShortPhone(String aValue) {
		this.shortPhone = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ROOM" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getRoom() {
		return this.room;
	}
	
	/**
	 * Set the room
	 */	
	public void setRoom(String aValue) {
		this.room = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="email" type="java.lang.String" length="128" not-null="false" unique="false"
	 */
	public String getEmail() {
		return this.email;
	}
	
	/**
	 * Set the email
	 */	
	public void setEmail(String aValue) {
		this.email = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="source" type="java.lang.String" length="5" not-null="true" unique="false"
	 */
	public String getSource() {
		return this.source;
	}
	
	/**
	 * Set the source
	 * @spring.validator type="required"
	 */	
	public void setSource(String aValue) {
		this.source = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof Addressbook)) {
			return false;
		}
		Addressbook rhs = (Addressbook) object;
		return new EqualsBuilder()
				.append(this.personName, rhs.personName)
				.append(this.department, rhs.department)
				.append(this.officePhone, rhs.officePhone)
				.append(this.mobile, rhs.mobile)
				.append(this.shortPhone, rhs.shortPhone)
				.append(this.room, rhs.room)
				.append(this.email, rhs.email)
				.append(this.source, rhs.source)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.personName) 
				.append(this.department) 
				.append(this.officePhone) 
				.append(this.mobile) 
				.append(this.shortPhone) 
				.append(this.room) 
				.append(this.email) 
				.append(this.source) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("personName", this.personName) 
				.append("department", this.department) 
				.append("officePhone", this.officePhone) 
				.append("mobile", this.mobile) 
				.append("shortPhone", this.shortPhone) 
				.append("room", this.room) 
				.append("email", this.email) 
				.append("source", this.source) 
				.toString();
	}



}
