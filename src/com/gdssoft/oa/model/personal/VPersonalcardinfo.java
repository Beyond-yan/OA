package com.gdssoft.oa.model.personal;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * VPersonalcardinfo Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class VPersonalcardinfo extends com.gdssoft.core.model.BaseModel {

	protected String id;
	protected String username;
	protected String dep;
	protected String fullname;
	protected String useType;
	protected java.util.Date useTime;
	protected String xfposmoney;
	protected String xfcardmoney; 

	public VPersonalcardinfo(String username,String dep,String fullname,String useType,
	java.util.Date useTime,String xfposmoney,String xfcardmoney) {
		this.username = username;
		this.fullname = fullname;
		this.useType = useType;
		this.useTime = useTime;
		this.xfposmoney = xfposmoney;
		this.xfcardmoney = xfcardmoney;		
	}

	
	
	/**
	 * Default Empty Constructor for class VPersonalcardinfo
	 */
	public VPersonalcardinfo(){
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class VPersonalcardinfo
	 */
	public VPersonalcardinfo (String aValue ) {
		this.setId(aValue); 
    }

    

	public String getId() {
		return id;
	}



	public void setId(String id) {
		this.id = id;
	}



	/**
	 * 	 * @return String
	 * @hibernate.property column="username" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getUsername() {
		return this.username;
	}
	
	/**
	 * Set the username
	 */	
	public void setUsername(String aValue) {
		this.username = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="Dep" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getDep() {
		return this.dep;
	}
	
	/**
	 * Set the dep
	 */	
	public void setDep(String aValue) {
		this.dep = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="fullname" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getFullname() {
		return this.fullname;
	}
	
	/**
	 * Set the fullname
	 */	
	public void setFullname(String aValue) {
		this.fullname = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="UseType" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getUseType() {
		return useType;
	}

	public void setUseType(String useType) {
		this.useType = useType;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="useTime" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getUseTime() {
		return useTime;
	}



	public void setUseTime(java.util.Date useTime) {
		this.useTime = useTime;
	}

	/**
	 * 	 * @return String
	 * @hibernate.property column="XFPosMoney" type="java.lang.String" length="18" not-null="false" unique="false"
	 */
	public String getXfposmoney() {
		return this.xfposmoney;
	}


	/**
	 * Set the xfposmoney
	 */	
	public void setXfposmoney(String aValue) {
		this.xfposmoney = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="XFCardMoney" type="java.lang.String" length="18" not-null="false" unique="false"
	 */
	public String getXfcardmoney() {
		return this.xfcardmoney;
	}
	
	/**
	 * Set the xfcardmoney
	 */	
	public void setXfcardmoney(String aValue) {
		this.xfcardmoney = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof VPersonalcardinfo)) {
			return false;
		}
		VPersonalcardinfo rhs = (VPersonalcardinfo) object;
		return new EqualsBuilder()
				.append(this.username, rhs.username)
				.append(this.dep, rhs.dep)
				.append(this.fullname, rhs.fullname)
				.append(this.useType, rhs.useType)
				.append(this.useTime, rhs.useTime)
				.append(this.xfposmoney, rhs.xfposmoney)
				.append(this.xfcardmoney, rhs.xfcardmoney)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.username) 
				.append(this.dep) 
				.append(this.fullname) 
				.append(this.useType) 
				.append(this.useTime) 
				.append(this.xfposmoney) 
				.append(this.xfcardmoney) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("username", this.username) 
				.append("dep", this.dep) 
				.append("fullname", this.fullname) 
				.append("useType", this.useType) 
				.append("useTime", this.useTime) 
				.append("xfposmoney", this.xfposmoney) 
				.append("xfcardmoney", this.xfcardmoney) 
				.toString();
	}



}
