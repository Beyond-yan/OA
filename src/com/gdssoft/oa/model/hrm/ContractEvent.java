package com.gdssoft.oa.model.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.google.gson.annotations.Expose;

/**
 * ContractEvent Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * TODO: add class/table comments
 */
public class ContractEvent extends com.gdssoft.core.model.BaseModel {
    @Expose
    protected Long eventId;
    
    @Expose
	protected String eventName;
    
    @Expose
	protected String eventDescp;
    
    @Expose
	protected java.util.Date createTime;
    
    @Expose
	protected String creator;
    
	protected com.gdssoft.oa.model.hrm.UserContract userContract;


	/**
	 * Default Empty Constructor for class ContractEvent
	 */
	public ContractEvent () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class ContractEvent
	 */
	public ContractEvent (
		 Long in_eventId
        ) {
		this.setEventId(in_eventId);
    }

	
	public com.gdssoft.oa.model.hrm.UserContract getUserContract () {
		return userContract;
	}	
	
	public void setUserContract (com.gdssoft.oa.model.hrm.UserContract in_userContract) {
		this.userContract = in_userContract;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="eventId" type="java.lang.Long" generator-class="native"
	 */
	public Long getEventId() {
		return this.eventId;
	}
	
	/**
	 * Set the eventId
	 */	
	public void setEventId(Long aValue) {
		this.eventId = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getContractId() {
		return this.getUserContract()==null?null:this.getUserContract().getContractId();
	}
	
	/**
	 * Set the contractId
	 */	
	public void setContractId(Long aValue) {
	    if (aValue==null) {
	    	userContract = null;
	    } else if (userContract == null) {
	        userContract = new com.gdssoft.oa.model.hrm.UserContract(aValue);
	        userContract.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			userContract.setContractId(aValue);
	    }
	}	

	/**
	 * 事件名称，
            如：合同创建
            合同修改
            合同变更
            合同续约
            合同终止	 * @return String
	 * @hibernate.property column="eventName" type="java.lang.String" length="64" not-null="true" unique="false"
	 */
	public String getEventName() {
		return this.eventName;
	}
	
	/**
	 * Set the eventName
	 * @spring.validator type="required"
	 */	
	public void setEventName(String aValue) {
		this.eventName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="eventDescp" type="java.lang.String" length="65535" not-null="true" unique="false"
	 */
	public String getEventDescp() {
		return this.eventDescp;
	}
	
	/**
	 * Set the eventDescp
	 * @spring.validator type="required"
	 */	
	public void setEventDescp(String aValue) {
		this.eventDescp = aValue;
	}	

	/**
	 * 时间	 * @return java.util.Date
	 * @hibernate.property column="createTime" type="java.util.Date" length="10" not-null="true" unique="false"
	 */
	public java.util.Date getCreateTime() {
		return this.createTime;
	}
	
	/**
	 * Set the createTime
	 * @spring.validator type="required"
	 */	
	public void setCreateTime(java.util.Date aValue) {
		this.createTime = aValue;
	}	

	/**
	 * 经手人	 * @return String
	 * @hibernate.property column="creator" type="java.lang.String" length="64" not-null="true" unique="false"
	 */
	public String getCreator() {
		return this.creator;
	}
	
	/**
	 * Set the creator
	 * @spring.validator type="required"
	 */	
	public void setCreator(String aValue) {
		this.creator = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ContractEvent)) {
			return false;
		}
		ContractEvent rhs = (ContractEvent) object;
		return new EqualsBuilder()
				.append(this.eventId, rhs.eventId)
						.append(this.eventName, rhs.eventName)
				.append(this.eventDescp, rhs.eventDescp)
				.append(this.createTime, rhs.createTime)
				.append(this.creator, rhs.creator)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.eventId) 
						.append(this.eventName) 
				.append(this.eventDescp) 
				.append(this.createTime) 
				.append(this.creator) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("eventId", this.eventId) 
						.append("eventName", this.eventName) 
				.append("eventDescp", this.eventDescp) 
				.append("createTime", this.createTime) 
				.append("creator", this.creator) 
				.toString();
	}



}
