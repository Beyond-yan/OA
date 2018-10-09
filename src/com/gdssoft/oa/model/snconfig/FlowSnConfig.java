package com.gdssoft.oa.model.snconfig;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * CqFlowSnConfig Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class FlowSnConfig extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected Long flowId;
	protected String createUser;
	protected java.util.Date createDate;
	protected com.gdssoft.oa.model.snconfig.FileSnConfig fileSnConfig;


	/**
	 * Default Empty Constructor for class CqFlowSnConfig
	 */
	public FlowSnConfig () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class CqFlowSnConfig
	 */
	public FlowSnConfig (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public FileSnConfig getFileSnConfig () {
		return fileSnConfig;
	}	
	
	public void setFileSnConfig (FileSnConfig in_fileSnConfig) {
		this.fileSnConfig = in_fileSnConfig;
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
	public Long getSnId() {
		return this.getFileSnConfig()==null?null:this.getFileSnConfig().getId();
	}
	
	/**
	 * Set the snId
	 */	
	public void setSnId(Long aValue) {
	    if (aValue==null) {
	    	fileSnConfig = null;
	    } else if (fileSnConfig == null) {
	    	fileSnConfig = new FileSnConfig(aValue);
	    	fileSnConfig.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
	    	fileSnConfig.setId(aValue);
	    }
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="FLOW_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getFlowId() {
		return this.flowId;
	}
	
	/**
	 * Set the flowId
	 */	
	public void setFlowId(Long aValue) {
		this.flowId = aValue;
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
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof FlowSnConfig)) {
			return false;
		}
		FlowSnConfig rhs = (FlowSnConfig) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
						.append(this.flowId, rhs.flowId)
				.append(this.createUser, rhs.createUser)
				.append(this.createDate, rhs.createDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
						.append(this.flowId) 
				.append(this.createUser) 
				.append(this.createDate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
						.append("flowId", this.flowId) 
				.append("createUser", this.createUser) 
				.append("createDate", this.createDate) 
				.toString();
	}



}
