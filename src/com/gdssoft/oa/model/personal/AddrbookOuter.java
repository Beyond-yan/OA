package com.gdssoft.oa.model.personal;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * AddrbookOuter Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class AddrbookOuter extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String personName;
	protected Short personSex;
	protected String company;
	protected String department;
	protected String room;
	protected String officePhone;
	protected String ext;
	protected String mobile;
	protected String shortMobile;
	protected String email;
	
	
	/**
	 * 	 * @return String
	 * @hibernate.property column="EMAIL" type="java.lang.String" length="50" not-null="FALSE" unique="false"
	 */
	public String getEmail()
	{
		return email;
	}

	public void setEmail(String email)
	{
		this.email = email;
	}

	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;


	/**
	 * Default Empty Constructor for class AddrbookOuter
	 */
	public AddrbookOuter () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class AddrbookOuter
	 */
	public AddrbookOuter (
		 Long in_id
        ) {
		this.setId(in_id);
    }

    

	/**
	 * 	 * @return Long
     * @hibernate.id column="ID" type="java.lang.Long" generator-class="native"
	 */
	public Long getId() {
		return this.id;
	}
	
	/**
	 * Set the id
	 */	
	public void setId(Long aValue) {
		this.id = aValue;
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
	 * 	 * @return Short
	 * @hibernate.property column="PERSON_SEX" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getPersonSex() {
		return this.personSex;
	}
	
	/**
	 * Set the personSex
	 * @spring.validator type="required"
	 */	
	public void setPersonSex(Short aValue) {
		this.personSex = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="COMPANY" type="java.lang.String" length="50" not-null="true" unique="false"
	 */
	public String getCompany() {
		return this.company;
	}
	
	/**
	 * Set the company
	 * @spring.validator type="required"
	 */	
	public void setCompany(String aValue) {
		this.company = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DEPARTMENT" type="java.lang.String" length="50" not-null="false" unique="false"
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
	 * @hibernate.property column="OFFICE_PHONE" type="java.lang.String" length="20" not-null="false" unique="false"
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
	 * @hibernate.property column="EXT" type="java.lang.String" length="10" not-null="false" unique="false"
	 */
	public String getExt() {
		return this.ext;
	}
	
	/**
	 * Set the ext
	 */	
	public void setExt(String aValue) {
		this.ext = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="MOBILE" type="java.lang.String" length="20" not-null="false" unique="false"
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
	 * @hibernate.property column="SHORT_MOBILE" type="java.lang.String" length="10" not-null="false" unique="false"
	 */
	public String getShortMobile() {
		return this.shortMobile;
	}
	
	/**
	 * Set the shortMobile
	 */	
	public void setShortMobile(String aValue) {
		this.shortMobile = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="CREATE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getCreateDate() {
		return this.createDate;
	}
	
	/**
	 * Set the createDate
	 */	
	public void setCreateDate(java.util.Date aValue) {
		this.createDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CREATE_BY" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getCreateBy() {
		return this.createBy;
	}
	
	/**
	 * Set the createBy
	 */	
	public void setCreateBy(String aValue) {
		this.createBy = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="UPDATE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getUpdateDate() {
		return this.updateDate;
	}
	
	/**
	 * Set the updateDate
	 */	
	public void setUpdateDate(java.util.Date aValue) {
		this.updateDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="UPDATE_BY" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getUpdateBy() {
		return this.updateBy;
	}
	
	/**
	 * Set the updateBy
	 */	
	public void setUpdateBy(String aValue) {
		this.updateBy = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof AddrbookOuter)) {
			return false;
		}
		AddrbookOuter rhs = (AddrbookOuter) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.personName, rhs.personName)
				.append(this.personSex, rhs.personSex)
				.append(this.company, rhs.company)
				.append(this.department, rhs.department)
				.append(this.room, rhs.room)
				.append(this.officePhone, rhs.officePhone)
				.append(this.ext, rhs.ext)
				.append(this.mobile, rhs.mobile)
				.append(this.shortMobile, rhs.shortMobile)
				.append(this.createDate, rhs.createDate)
				.append(this.createBy, rhs.createBy)
				.append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.personName) 
				.append(this.personSex) 
				.append(this.company) 
				.append(this.department) 
				.append(this.room) 
				.append(this.officePhone) 
				.append(this.ext) 
				.append(this.mobile) 
				.append(this.shortMobile) 
				.append(this.createDate) 
				.append(this.createBy) 
				.append(this.updateDate) 
				.append(this.updateBy) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("personName", this.personName) 
				.append("personSex", this.personSex) 
				.append("company", this.company) 
				.append("department", this.department) 
				.append("room", this.room) 
				.append("officePhone", this.officePhone) 
				.append("ext", this.ext) 
				.append("mobile", this.mobile) 
				.append("shortMobile", this.shortMobile) 
				.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.toString();
	}



}
