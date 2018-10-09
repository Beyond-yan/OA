package com.gdssoft.oa.model.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * SysInterfaceAccount Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SysInterfaceAccount extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected com.gdssoft.oa.model.system.SysServiceAccount sysServiceAccount;
	protected com.gdssoft.oa.model.system.SysServiceInterface sysServiceInterface;


	/**
	 * Default Empty Constructor for class SysInterfaceAccount
	 */
	public SysInterfaceAccount () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SysInterfaceAccount
	 */
	public SysInterfaceAccount (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.system.SysServiceAccount getSysServiceAccount () {
		return sysServiceAccount;
	}	
	
	public void setSysServiceAccount (com.gdssoft.oa.model.system.SysServiceAccount in_sysServiceAccount) {
		this.sysServiceAccount = in_sysServiceAccount;
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
	 */
	public Long getAccountId() {
		return this.getSysServiceAccount()==null?null:this.getSysServiceAccount().getId();
	}
	
	/**
	 * Set the accountId
	 */	
	public void setAccountId(Long aValue) {
	    if (aValue==null) {
	    	sysServiceAccount = null;
	    } else if (sysServiceAccount == null) {
	        sysServiceAccount = new com.gdssoft.oa.model.system.SysServiceAccount(aValue);
	        sysServiceAccount.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			sysServiceAccount.setId(aValue);
	    }
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof SysInterfaceAccount)) {
			return false;
		}
		SysInterfaceAccount rhs = (SysInterfaceAccount) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
								.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
								.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
								.toString();
	}



}
