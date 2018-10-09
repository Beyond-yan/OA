package com.gdssoft.oa.model.personal;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * PersonnelEmployee Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class PersonnelEmployee extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String empCode;
	protected String officePhone;
	protected String shortPhone;
	protected String imageSource;
	protected Short isLeaving;
	protected String beforeSeniority;
	protected java.util.Date leaveDate;
	protected String totalSeniority;
	protected String remark;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	protected String ext;
	protected String room;
	protected Short isLeader;
	protected Short isWorktel;
	protected com.gdssoft.oa.model.system.AppUser appUser;
	
	
	/**
	 * 	 * @return Short
	 * @hibernate.property column="IS_LEADER" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getIsLeader()
	{
		return isLeader;
	}
	/**
	 * Set the isLeaving
	 * @spring.validator type="required"
	 */	
	public void setIsLeader(Short isLeader)
	{
		this.isLeader = isLeader;
	}
	/**
	 * 	 * @return Short
	 * @hibernate.property column="IS_WORKTEL" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getIsWorktel()
	{
		return isWorktel;
	}
	/**
	 * Set the isLeaving
	 * @spring.validator type="required"
	 */	
	public void setIsWorktel(Short isWorktel)
	{
		this.isWorktel = isWorktel;
	}
	/**
	 * Default Empty Constructor for class PersonnelEmployee
	 */
	public PersonnelEmployee () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class PersonnelEmployee
	 */
	public PersonnelEmployee (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.system.AppUser getAppUser () {
		return appUser;
	}	
	
	public void setAppUser (com.gdssoft.oa.model.system.AppUser in_appUser) {
		this.appUser = in_appUser;
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
	 * 	 * @return Long
	 */
	public Long getUserId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the userId
	 */	
	public void setUserId(Long aValue) {
	    if (aValue==null) {
	    	appUser = null;
	    } else if (appUser == null) {
	        appUser = new com.gdssoft.oa.model.system.AppUser(aValue);
	        appUser.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			appUser.setUserId(aValue);
	    }
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="EMP_CODE" type="java.lang.String" length="30" not-null="true" unique="false"
	 */
	public String getEmpCode() {
		return this.empCode;
	}
	
	/**
	 * Set the empCode
	 * @spring.validator type="required"
	 */	
	public void setEmpCode(String aValue) {
		this.empCode = aValue;
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
	 * @hibernate.property column="IMAGE_SOURCE" type="java.lang.String" length="150" not-null="false" unique="false"
	 */
	public String getImageSource() {
		return this.imageSource;
	}
	
	/**
	 * Set the imageSource
	 */	
	public void setImageSource(String aValue) {
		this.imageSource = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="IS_LEAVING" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getIsLeaving() {
		return this.isLeaving;
	}
	
	/**
	 * Set the isLeaving
	 * @spring.validator type="required"
	 */	
	public void setIsLeaving(Short aValue) {
		this.isLeaving = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="BEFORE_SENIORITY" type="java.lang.String" length="3" not-null="false" unique="false"
	 */
	public String getBeforeSeniority() {
		return this.beforeSeniority;
	}
	
	/**
	 * Set the beforeSeniority
	 */	
	public void setBeforeSeniority(String aValue) {
		this.beforeSeniority = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="LEAVE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getLeaveDate() {
		return this.leaveDate;
	}
	
	/**
	 * Set the leaveDate
	 */	
	public void setLeaveDate(java.util.Date aValue) {
		this.leaveDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="TOTAL_SENIORITY" type="java.lang.String" length="3" not-null="false" unique="false"
	 */
	public String getTotalSeniority() {
		return this.totalSeniority;
	}
	
	/**
	 * Set the totalSeniority
	 */	
	public void setTotalSeniority(String aValue) {
		this.totalSeniority = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REMARK" type="java.lang.String" length="400" not-null="false" unique="false"
	 */
	public String getRemark() {
		return this.remark;
	}
	
	/**
	 * Set the remark
	 */	
	public void setRemark(String aValue) {
		this.remark = aValue;
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
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof PersonnelEmployee)) {
			return false;
		}
		PersonnelEmployee rhs = (PersonnelEmployee) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
						.append(this.empCode, rhs.empCode)
				.append(this.officePhone, rhs.officePhone)
				.append(this.shortPhone, rhs.shortPhone)
				.append(this.imageSource, rhs.imageSource)
				.append(this.isLeaving, rhs.isLeaving)
				.append(this.beforeSeniority, rhs.beforeSeniority)
				.append(this.leaveDate, rhs.leaveDate)
				.append(this.totalSeniority, rhs.totalSeniority)
				.append(this.remark, rhs.remark)
				.append(this.createDate, rhs.createDate)
				.append(this.createBy, rhs.createBy)
				.append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy)
				.append(this.ext, rhs.ext)
				.append(this.room, rhs.room)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
						.append(this.empCode) 
				.append(this.officePhone) 
				.append(this.shortPhone) 
				.append(this.imageSource) 
				.append(this.isLeaving) 
				.append(this.beforeSeniority) 
				.append(this.leaveDate) 
				.append(this.totalSeniority) 
				.append(this.remark) 
				.append(this.createDate) 
				.append(this.createBy) 
				.append(this.updateDate) 
				.append(this.updateBy) 
				.append(this.ext) 
				.append(this.room) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
						.append("empCode", this.empCode) 
				.append("officePhone", this.officePhone) 
				.append("shortPhone", this.shortPhone) 
				.append("imageSource", this.imageSource) 
				.append("isLeaving", this.isLeaving) 
				.append("beforeSeniority", this.beforeSeniority) 
				.append("leaveDate", this.leaveDate) 
				.append("totalSeniority", this.totalSeniority) 
				.append("remark", this.remark) 
				.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.append("ext", this.ext) 
				.append("room", this.room) 
				.toString();
	}



}
