package com.gdssoft.oa.model.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * SysDepartmentConfig Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SysDepartmentConfig extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String depCode;
	protected String depName;
	protected Long schemaId;
	protected String createUser;
	protected java.util.Date createDate;
	protected String updateUser;
	protected java.util.Date updateDate;
	protected Long depId;


	/**
	 * Default Empty Constructor for class SysDepartmentConfig
	 */
	public SysDepartmentConfig () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SysDepartmentConfig
	 */
	public SysDepartmentConfig (
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
	 * @hibernate.property column="DEP_CODE" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getDepCode() {
		return this.depCode;
	}
	
	/**
	 * Set the depCode
	 */	
	public void setDepCode(String aValue) {
		this.depCode = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DEP_NAME" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getDepName() {
		return this.depName;
	}
	
	/**
	 * Set the depName
	 */	
	public void setDepName(String aValue) {
		this.depName = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="SCHEMA_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getSchemaId() {
		return this.schemaId;
	}
	
	/**
	 * Set the schemaId
	 */	
	public void setSchemaId(Long aValue) {
		this.schemaId = aValue;
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
	
	public Long getDepId() {
		return this.depId;
	}
	
	/**
	 * Set the schemaId
	 */	
	public void setDepId(Long aValue) {
		this.depId = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof SysDepartmentConfig)) {
			return false;
		}
		SysDepartmentConfig rhs = (SysDepartmentConfig) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.depCode, rhs.depCode)
				.append(this.depName, rhs.depName)
				.append(this.schemaId, rhs.schemaId)
				.append(this.createUser, rhs.createUser)
				.append(this.createDate, rhs.createDate)
				.append(this.updateUser, rhs.updateUser)
				.append(this.updateDate, rhs.updateDate)
				.append(this.depId, rhs.depId)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.depCode) 
				.append(this.depName) 
				.append(this.schemaId) 
				.append(this.createUser) 
				.append(this.createDate) 
				.append(this.updateUser) 
				.append(this.updateDate) 
				.append(this.depId)
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("depCode", this.depCode) 
				.append("depName", this.depName) 
				.append("schemaId", this.schemaId) 
				.append("createUser", this.createUser) 
				.append("createDate", this.createDate) 
				.append("updateUser", this.updateUser) 
				.append("updateDate", this.updateDate) 
				.append("depId",this.depId)
				.toString();
	}



}
