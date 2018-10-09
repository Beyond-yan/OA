package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * OdFlowtype Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class OdFlowtype extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String flowName;
	protected String flowDesc;
	protected Short flowType;
	protected Integer isAutoSave;
	protected String ref1;
	protected String ref2;
	protected String ref3;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	protected Integer flowLevel;
	protected com.gdssoft.oa.model.flow.ProDefinition proDefinition;


	/**
	 * Default Empty Constructor for class OdFlowtype
	 */
	public OdFlowtype () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class OdFlowtype
	 */
	public OdFlowtype (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.flow.ProDefinition getProDefinition () {
		return proDefinition;
	}	
	
	public void setProDefinition (com.gdssoft.oa.model.flow.ProDefinition in_proDefinition) {
		this.proDefinition = in_proDefinition;
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
	 * @hibernate.property column="FLOW_NAME" type="java.lang.String" length="50" not-null="true" unique="false"
	 */
	public String getFlowName() {
		return this.flowName;
	}
	
	/**
	 * Set the flowName
	 * @spring.validator type="required"
	 */	
	public void setFlowName(String aValue) {
		this.flowName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="FLOW_DESC" type="java.lang.String" length="400" not-null="false" unique="false"
	 */
	public String getFlowDesc() {
		return this.flowDesc;
	}
	
	/**
	 * Set the flowDesc
	 */	
	public void setFlowDesc(String aValue) {
		this.flowDesc = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="FLOW_TYPE" type="java.lang.Short" length="5" not-null="false" unique="false"
	 */
	public Short getFlowType() {
		return this.flowType;
	}
	
	/**
	 * Set the flowType
	 */	
	public void setFlowType(Short aValue) {
		this.flowType = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getProcessId() {
		return this.getProDefinition()==null?null:this.getProDefinition().getDefId();
	}
	
	/**
	 * Set the processId
	 */	
	public void setProcessId(Long aValue) {
	    if (aValue==null) {
	    	proDefinition = null;
	    } else if (proDefinition == null) {
	        proDefinition = new com.gdssoft.oa.model.flow.ProDefinition(aValue);
	        proDefinition.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			proDefinition.setDefId(aValue);
	    }
	}	

	/**
	 * 	 * @return Integer
	 * @hibernate.property column="IS_AUTO_SAVE" type="java.lang.Integer" length="10" not-null="false" unique="false"
	 */
	public Integer getIsAutoSave() {
		return this.isAutoSave;
	}
	
	/**
	 * Set the isAutoSave
	 */	
	public void setIsAutoSave(Integer aValue) {
		this.isAutoSave = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REF1" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getRef1() {
		return this.ref1;
	}
	
	/**
	 * Set the ref1
	 */	
	public void setRef1(String aValue) {
		this.ref1 = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REF2" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getRef2() {
		return this.ref2;
	}
	
	/**
	 * Set the ref2
	 */	
	public void setRef2(String aValue) {
		this.ref2 = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REF3" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getRef3() {
		return this.ref3;
	}
	
	/**
	 * Set the ref3
	 */	
	public void setRef3(String aValue) {
		this.ref3 = aValue;
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
	 * 	 * @return String
	 * @hibernate.property column="CREATE_BY" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getCreateBy() {
		return this.createBy;
	}
	
	/**
	 * Set the createBy
	 */	
	public void setCreateBy(String aValue) {
		this.createBy = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="UPDATE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
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
	 * 	 * @return String
	 * @hibernate.property column="UPDATE_BY" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getUpdateBy() {
		return this.updateBy;
	}
	
	/**
	 * Set the updateBy
	 */	
	public void setUpdateBy(String aValue) {
		this.updateBy = aValue;
	}	
	
	public Integer getFlowLevel() {
		return flowLevel;
	}

	public void setFlowLevel(Integer flowLevel) {
		this.flowLevel = flowLevel;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof OdFlowtype)) {
			return false;
		}
		OdFlowtype rhs = (OdFlowtype) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.flowName, rhs.flowName)
				.append(this.flowDesc, rhs.flowDesc)
				.append(this.flowType, rhs.flowType)
						.append(this.isAutoSave, rhs.isAutoSave)
				.append(this.ref1, rhs.ref1)
				.append(this.ref2, rhs.ref2)
				.append(this.ref3, rhs.ref3)
				.append(this.createDate, rhs.createDate)
				.append(this.createBy, rhs.createBy)
				.append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.flowName) 
				.append(this.flowDesc) 
				.append(this.flowType) 
						.append(this.isAutoSave) 
				.append(this.flowLevel) 
				.append(this.ref2) 
				.append(this.ref3) 
				.append(this.createDate) 
				.append(this.createBy) 
				.append(this.updateDate) 
				.append(this.updateBy) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("flowName", this.flowName) 
				.append("flowDesc", this.flowDesc) 
				.append("flowType", this.flowType) 
						.append("isAutoSave", this.isAutoSave) 
				.append("ref1", this.flowLevel) 
				.append("ref2", this.ref2) 
				.append("ref3", this.ref3) 
				.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.toString();
	}



}
