package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * OdPersonalSign Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class OdPersonalSign extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String signTitle;
	protected String signDesc;
	protected String ref1;
	protected String ref2;
	protected String ref3;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	protected com.gdssoft.oa.model.system.AppUser appUser;
	protected com.gdssoft.oa.model.system.FileAttach fileAttach;


	/**
	 * Default Empty Constructor for class OdPersonalSign
	 */
	public OdPersonalSign () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class OdPersonalSign
	 */
	public OdPersonalSign (
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
	
	public com.gdssoft.oa.model.system.FileAttach getFileAttach () {
		return fileAttach;
	}	
	
	public void setFileAttach (com.gdssoft.oa.model.system.FileAttach in_fileAttach) {
		this.fileAttach = in_fileAttach;
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
	 * @hibernate.property column="SIGN_TITLE" type="java.lang.String" length="50" not-null="true" unique="false"
	 */
	public String getSignTitle() {
		return this.signTitle;
	}
	
	/**
	 * Set the signTitle
	 * @spring.validator type="required"
	 */	
	public void setSignTitle(String aValue) {
		this.signTitle = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SIGN_DESC" type="java.lang.String" length="400" not-null="false" unique="false"
	 */
	public String getSignDesc() {
		return this.signDesc;
	}
	
	/**
	 * Set the signDesc
	 */	
	public void setSignDesc(String aValue) {
		this.signDesc = aValue;
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
	 * 	 * @return Long
	 */
	public Long getSignFileId() {
		return this.getFileAttach()==null?null:this.getFileAttach().getFileId();
	}
	
	/**
	 * Set the signFileId
	 */	
	public void setSignFileId(Long aValue) {
	    if (aValue==null) {
	    	fileAttach = null;
	    } else if (fileAttach == null) {
	        fileAttach = new com.gdssoft.oa.model.system.FileAttach(aValue);
	        fileAttach.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			fileAttach.setFileId(aValue);
	    }
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REF1" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getRef1() {
		return this.ref1;
	}
	
	/**
	 * Set the ref1
	 */	
	public void setRef1(String aValue) {
		this.ref1 = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REF2" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getRef2() {
		return this.ref2;
	}
	
	/**
	 * Set the ref2
	 */	
	public void setRef2(String aValue) {
		this.ref2 = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REF3" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getRef3() {
		return this.ref3;
	}
	
	/**
	 * Set the ref3
	 */	
	public void setRef3(String aValue) {
		this.ref3 = aValue;
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
		if (!(object instanceof OdPersonalSign)) {
			return false;
		}
		OdPersonalSign rhs = (OdPersonalSign) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.signTitle, rhs.signTitle)
				.append(this.signDesc, rhs.signDesc)
								.append(this.ref1, rhs.ref1)
				.append(this.ref2, rhs.ref2)
				.append(this.ref3, rhs.ref3)
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
				.append(this.signTitle) 
				.append(this.signDesc) 
								.append(this.ref1) 
				.append(this.ref2) 
				.append(this.ref3) 
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
				.append("signTitle", this.signTitle) 
				.append("signDesc", this.signDesc) 
								.append("ref1", this.ref1) 
				.append("ref2", this.ref2) 
				.append("ref3", this.ref3) 
				.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.toString();
	}



}
