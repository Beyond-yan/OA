package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * OdCirPaper Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class OdCirPaper extends com.gdssoft.core.model.BaseModel {

    protected Long cirPaperId;
	protected String subject;
	protected String shortContent;
	protected java.util.Date createDate;
	protected com.gdssoft.oa.model.system.AppUser appUser;

	protected java.util.Set odCirFiles = new java.util.HashSet();
	protected java.util.Set odCirUsers = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class OdCirPaper
	 */
	public OdCirPaper () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class OdCirPaper
	 */
	public OdCirPaper (
		 Long in_cirPaperId
        ) {
		this.setCirPaperId(in_cirPaperId);
    }

	
	public com.gdssoft.oa.model.system.AppUser getAppUser () {
		return appUser;
	}	
	
	public void setAppUser (com.gdssoft.oa.model.system.AppUser in_appUser) {
		this.appUser = in_appUser;
	}

	public java.util.Set getOdCirFiles () {
		return odCirFiles;
	}	
	
	public void setOdCirFiles (java.util.Set in_odCirFiles) {
		this.odCirFiles = in_odCirFiles;
	}

	public java.util.Set getOdCirUsers () {
		return odCirUsers;
	}	
	
	public void setOdCirUsers (java.util.Set in_odCirUsers) {
		this.odCirUsers = in_odCirUsers;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="CIR_PAPER_ID" type="java.lang.Long" generator-class="native"
	 */
	public Long getCirPaperId() {
		return this.cirPaperId;
	}
	
	/**
	 * Set the cirPaperId
	 */	
	public void setCirPaperId(Long aValue) {
		this.cirPaperId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SUBJECT" type="java.lang.String" length="1024" not-null="true" unique="false"
	 */
	public String getSubject() {
		return this.subject;
	}
	
	/**
	 * Set the subject
	 * @spring.validator type="required"
	 */	
	public void setSubject(String aValue) {
		this.subject = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SHORT_CONTENT" type="java.lang.String" length="2048" not-null="false" unique="false"
	 */
	public String getShortContent() {
		return this.shortContent;
	}
	
	/**
	 * Set the shortContent
	 */	
	public void setShortContent(String aValue) {
		this.shortContent = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getCreatorId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the creatorId
	 */	
	public void setCreatorId(Long aValue) {
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
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof OdCirPaper)) {
			return false;
		}
		OdCirPaper rhs = (OdCirPaper) object;
		return new EqualsBuilder()
				.append(this.cirPaperId, rhs.cirPaperId)
				.append(this.subject, rhs.subject)
				.append(this.shortContent, rhs.shortContent)
						.append(this.createDate, rhs.createDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.cirPaperId) 
				.append(this.subject) 
				.append(this.shortContent) 
						.append(this.createDate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("cirPaperId", this.cirPaperId) 
				.append("subject", this.subject) 
				.append("shortContent", this.shortContent) 
						.append("createDate", this.createDate) 
				.toString();
	}



}
