package com.gdssoft.oa.model.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * SysServiceAccessLog Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SysServiceAccessLog extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String serviceAccount;
	protected java.util.Date accessDate;
	protected Long status;
	protected String errorMessage;
	protected String ipAddress;
	protected com.gdssoft.oa.model.system.SysServiceInterface sysServiceInterface;


	/**
	 * Default Empty Constructor for class SysServiceAccessLog
	 */
	public SysServiceAccessLog () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SysServiceAccessLog
	 */
	public SysServiceAccessLog (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.system.SysServiceInterface getSysServiceInterface () {
		return sysServiceInterface;
	}	
	
	public void setSysServiceInterface (com.gdssoft.oa.model.system.SysServiceInterface in_sysServiceInterface) {
		this.sysServiceInterface = in_sysServiceInterface;
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
	public Long getServiceId() {
		return this.getSysServiceInterface()==null?null:this.getSysServiceInterface().getId();
	}
	
	/**
	 * Set the serviceId
	 */	
	public void setServiceId(Long aValue) {
	    if (aValue==null) {
	    	sysServiceInterface = null;
	    } else if (sysServiceInterface == null) {
	        sysServiceInterface = new com.gdssoft.oa.model.system.SysServiceInterface(aValue);
	        sysServiceInterface.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			sysServiceInterface.setId(aValue);
	    }
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="SERVICE_ACCOUNT" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public String getServiceAccount() {
		return this.serviceAccount;
	}
	
	/**
	 * Set the serviceAccount
	 */	
	public void setServiceAccount(String aValue) {
		this.serviceAccount = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="ACCESS_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getAccessDate() {
		return this.accessDate;
	}
	
	/**
	 * Set the accessDate
	 */	
	public void setAccessDate(java.util.Date aValue) {
		this.accessDate = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="STATUS" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getStatus() {
		return this.status;
	}
	
	/**
	 * Set the status
	 */	
	public void setStatus(Long aValue) {
		this.status = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ERROR_MESSAGE" type="java.lang.String" length="4000" not-null="false" unique="false"
	 */
	public String getErrorMessage() {
		return this.errorMessage;
	}
	
	/**
	 * Set the errorMessage
	 */	
	public void setErrorMessage(String aValue) {
		this.errorMessage = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="IP_ADDRESS" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getIpAddress() {
		return this.ipAddress;
	}
	
	/**
	 * Set the ipAddress
	 */	
	public void setIpAddress(String aValue) {
		this.ipAddress = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof SysServiceAccessLog)) {
			return false;
		}
		SysServiceAccessLog rhs = (SysServiceAccessLog) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
						.append(this.serviceAccount, rhs.serviceAccount)
				.append(this.accessDate, rhs.accessDate)
				.append(this.status, rhs.status)
				.append(this.errorMessage, rhs.errorMessage)
				.append(this.ipAddress, rhs.ipAddress)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
						.append(this.serviceAccount) 
				.append(this.accessDate) 
				.append(this.status) 
				.append(this.errorMessage) 
				.append(this.ipAddress) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
						.append("serviceAccount", this.serviceAccount) 
				.append("accessDate", this.accessDate) 
				.append("status", this.status) 
				.append("errorMessage", this.errorMessage) 
				.append("ipAddress", this.ipAddress) 
				.toString();
	}



}
