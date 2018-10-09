package com.gdssoft.oa.model.info;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * InfoType Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class InfoType extends com.gdssoft.core.model.BaseModel {

    protected Long typeid;
	protected String typeName;
	protected String createUser;
	protected String updateUser;
	protected java.util.Date createDate;
	protected java.util.Date updateDate;


	/**
	 * Default Empty Constructor for class InfoType
	 */
	public InfoType () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class InfoType
	 */
	public InfoType (
		 Long in_typeid
        ) {
		this.setTypeid(in_typeid);
    }

    

	/**
	 * 	 * @return Long
     * @hibernate.id column="TYPEID" type="java.lang.Long" generator-class="native"
	 */
	public Long getTypeid() {
		return this.typeid;
	}
	
	/**
	 * Set the typeid
	 */	
	public void setTypeid(Long aValue) {
		this.typeid = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="TYPE_NAME" type="java.lang.String" length="400" not-null="false" unique="false"
	 */
	public String getTypeName() {
		return this.typeName;
	}
	
	/**
	 * Set the typeName
	 */	
	public void setTypeName(String aValue) {
		this.typeName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CREATE_USER" type="java.lang.String" length="400" not-null="false" unique="false"
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

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public java.util.Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(java.util.Date updateDate) {
		this.updateDate = updateDate;
	}
}
