package com.gdssoft.oa.model.snconfig;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * CqFileSnConfigHistory Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class FileSnConfigHistory extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected Long snId;
	protected Long snNumber;
	protected String snFormat;
	protected Long snType;
	protected java.util.Date expirationDate;
	protected String updateUser;
	protected java.util.Date updateDate;
	protected FileSnConfig fileSnConfig;


	public FileSnConfig getFileSnConfig() {
		return fileSnConfig;
	}

	public void setFileSnConfig(
			FileSnConfig fileSnConfig) {
		this.fileSnConfig = fileSnConfig;
	}

	/**
	 * Default Empty Constructor for class CqFileSnConfigHistory
	 */
	public FileSnConfigHistory () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class CqFileSnConfigHistory
	 */
	public FileSnConfigHistory (
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
	    if (aValue==null) {
	    	fileSnConfig = null;
	    } else {
	    	fileSnConfig = new FileSnConfig(aValue);
	    	fileSnConfig.setVersion(new Integer(0));//set a version to cheat hibernate only
	    }
		this.id = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="SN_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getSnId() {
		return this.snId;
	}
	
	/**
	 * Set the snId
	 */	
	public void setSnId(Long aValue) {
		this.snId = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="SN_NUMBER" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getSnNumber() {
		return this.snNumber;
	}
	
	/**
	 * Set the snNumber
	 */	
	public void setSnNumber(Long aValue) {
		this.snNumber = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SN_FORMAT" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getSnFormat() {
		return this.snFormat;
	}
	
	/**
	 * Set the snFormat
	 */	
	public void setSnFormat(String aValue) {
		this.snFormat = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="IS_YEAR" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getSnType() {
		return this.snType;
	}
	
	/**
	 * Set the isYear
	 */	
	public void setSnType(Long snType) {
		this.snType = snType;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="EXPIRATION_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getExpirationDate() {
		return this.expirationDate;
	}
	
	/**
	 * Set the expirationDate
	 */	
	public void setExpirationDate(java.util.Date aValue) {
		this.expirationDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="UPDATE_USER" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getUpdateUser() {
		return this.updateUser;
	}
	
	/**
	 * Set the updateUser
	 */	
	public void setUpdateUser(String aValue) {
		this.updateUser = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="UPDATE_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
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
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof FileSnConfigHistory)) {
			return false;
		}
		FileSnConfigHistory rhs = (FileSnConfigHistory) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.snId, rhs.snId)
				.append(this.snNumber, rhs.snNumber)
				.append(this.snFormat, rhs.snFormat)
				.append(this.snType, rhs.snType)
				.append(this.expirationDate, rhs.expirationDate)
				.append(this.updateUser, rhs.updateUser)
				.append(this.updateDate, rhs.updateDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.snId) 
				.append(this.snNumber) 
				.append(this.snFormat) 
				.append(this.snType) 
				.append(this.expirationDate) 
				.append(this.updateUser) 
				.append(this.updateDate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("snId", this.snId) 
				.append("snNumber", this.snNumber) 
				.append("snFormat", this.snFormat) 
				.append("snType", this.snType) 
				.append("expirationDate", this.expirationDate) 
				.append("updateUser", this.updateUser) 
				.append("updateDate", this.updateDate) 
				.toString();
	}



}
