package com.gdssoft.oa.model.snconfig;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * CqFileSnConfig Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class FileSnConfig extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String snName;
	protected Long snNumber;
	protected String snFormat;
	protected Long snType;
	protected java.util.Date expirationDate;
	protected String createUser;
	protected java.util.Date createDate;
	protected String updateUser;
	protected java.util.Date updateDate;

	protected Set flowSnConfigs = new HashSet();
	protected Set fileSnConfigHistorys = new HashSet();
	

	/**
	 * Default Empty Constructor for class CqFileSnConfig
	 */
	public FileSnConfig () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class CqFileSnConfig
	 */
	public FileSnConfig (
		 Long in_id
        ) {
		this.setId(in_id);
    }


	public Set getFlowSnConfigs () {
		return flowSnConfigs;
	}	
	
	public void setFlowSnConfigs (Set in_FlowSnConfigs) {
		this.flowSnConfigs = in_FlowSnConfigs;
	}
	public Set getFileSnConfigHistorys() {
		return fileSnConfigHistorys;
	}

	public void setFileSnConfigHistorys(Set fileSnConfigHistorys) {
		this.fileSnConfigHistorys = fileSnConfigHistorys;
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
	 * @hibernate.property column="SN_NAME" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getSnName() {
		return this.snName;
	}
	
	/**
	 * Set the snName
	 */	
	public void setSnName(String aValue) {
		this.snName = aValue;
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
	 * @hibernate.property column="CREATE_USER" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getCreateUser() {
		return this.createUser;
	}
	
	/**
	 * Set the createUser
	 */	
	public void setCreateUser(String aValue) {
		this.createUser = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="CREATE_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
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
		if (!(object instanceof FileSnConfig)) {
			return false;
		}
		FileSnConfig rhs = (FileSnConfig) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.snName, rhs.snName)
				.append(this.snNumber, rhs.snNumber)
				.append(this.snFormat, rhs.snFormat)
				.append(this.snType, rhs.snType)
				.append(this.expirationDate, rhs.expirationDate)
				.append(this.createUser, rhs.createUser)
				.append(this.createDate, rhs.createDate)
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
				.append(this.snName) 
				.append(this.snNumber) 
				.append(this.snFormat) 
				.append(this.snType) 
				.append(this.expirationDate) 
				.append(this.createUser) 
				.append(this.createDate) 
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
				.append("snName", this.snName) 
				.append("snNumber", this.snNumber) 
				.append("snFormat", this.snFormat) 
				.append("isYear", this.snType) 
				.append("expirationDate", this.expirationDate) 
				.append("createUser", this.createUser) 
				.append("createDate", this.createDate) 
				.append("updateUser", this.updateUser) 
				.append("updateDate", this.updateDate) 
				.toString();
	}



}
